'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther, formatEther, erc20Abi, maxUint256 } from 'viem'
import { motion } from 'framer-motion'
import { ArrowDownUp, Settings, Info } from 'lucide-react'
import { TokenInput } from '@/components/TokenInput'
import { Button } from '@/components/ui/Button'
import { TokenSelector } from '@/components/TokenSelector'
import { AMM_ABI } from '@/utils/abi'
import { Token, ALL_TOKENS, findTokenByAddress } from '@/utils/tokens'
import { findPoolForPair, findSwapRoute, canSwapDirectly } from '@/utils/pools'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import toast from 'react-hot-toast'

// Debug token config in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const { debugTokenConfig } = require('@/utils/debug')
  debugTokenConfig()
}

// Default to first available tokens
const DEFAULT_FROM_TOKEN = ALL_TOKENS[0] || null
const DEFAULT_TO_TOKEN = ALL_TOKENS[1] || null

// Check if a token pair can be swapped (directly or via bridge)
function canSwapTokens(tokenFrom: Token | null, tokenTo: Token | null): {
  canSwap: boolean
  route: 'direct' | 'via-bridge' | null
  poolAddress?: `0x${string}`
  pools?: Array<{ address: `0x${string}` }>
} {
  if (!tokenFrom || !tokenTo) {
    return { canSwap: false, route: null }
  }

  // Check direct swap
  const directPool = findPoolForPair(tokenFrom.address, tokenTo.address)
  if (directPool) {
    return {
      canSwap: true,
      route: 'direct',
      poolAddress: directPool.address,
      pools: [{ address: directPool.address }],
    }
  }

  // Check via bridge (TKA)
  const route = findSwapRoute(tokenFrom.address, tokenTo.address)
  if (route) {
    return {
      canSwap: true,
      route: route.route,
      pools: route.pools.map(p => ({ address: p.address })),
    }
  }

  return { canSwap: false, route: null }
}

export default function SwapPage() {
  const { address, isConnected } = useAccount()
  const [tokenFrom, setTokenFrom] = useState<Token | null>(DEFAULT_FROM_TOKEN)
  const [tokenTo, setTokenTo] = useState<Token | null>(DEFAULT_TO_TOKEN)
  const [amountFrom, setAmountFrom] = useState('')
  const [amountTo, setAmountTo] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [showSettings, setShowSettings] = useState(false)
  const [showTokenSelector, setShowTokenSelector] = useState<'from' | 'to' | null>(null)

  const tokenFromAddress = tokenFrom?.address as `0x${string}`
  const tokenToAddress = tokenTo?.address as `0x${string}`

  // Find pool for this token pair
  const swapInfo = canSwapTokens(tokenFrom, tokenTo)
  const poolAddress = swapInfo.poolAddress || swapInfo.pools?.[0]?.address

  // Use custom hook for better balance handling
  const { formattedBalance: balanceFromFormatted, isLoading: isLoadingBalanceFrom, error: balanceFromError } = useTokenBalance(tokenFrom, address)
  const { formattedBalance: balanceToFormatted, isLoading: isLoadingBalanceTo, error: balanceToError } = useTokenBalance(tokenTo, address)

  const { data: amountOut } = useReadContract({
    address: poolAddress,
    abi: AMM_ABI,
    functionName: 'getAmountOut',
    args: amountFrom && parseFloat(amountFrom) > 0 ? [parseEther(amountFrom), tokenFromAddress] : undefined,
    query: {
      enabled: !!amountFrom && parseFloat(amountFrom) > 0 && !!tokenFromAddress && !!poolAddress && swapInfo.canSwap && swapInfo.route === 'direct',
    },
  })

  const { data: reserves } = useReadContract({
    address: poolAddress,
    abi: AMM_ABI,
    functionName: 'getReserves',
    query: {
      refetchInterval: 5000,
      enabled: !!poolAddress && swapInfo.canSwap && swapInfo.route === 'direct',
    },
  })

  useEffect(() => {
    if (amountOut) {
      setAmountTo(formatEther(amountOut))
    } else {
      setAmountTo('')
    }
  }, [amountOut, amountFrom])

  // Calculate price impact
  const priceImpact =
    reserves && amountFrom && parseFloat(amountFrom) > 0 && amountOut
      ? ((parseFloat(amountFrom) / parseFloat(formatEther(reserves[0]))) * 100).toFixed(2)
      : '0'

  const { writeContract: approve, data: approveHash } = useWriteContract()
  const { writeContract: swap, data: swapHash } = useWriteContract()

  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  const { isLoading: isSwapping } = useWaitForTransactionReceipt({
    hash: swapHash,
  })

  const handleSwap = () => {
    if (!tokenFrom || !tokenTo || !amountFrom || !isConnected) {
      toast.error('Please connect wallet and enter amount')
      return
    }

    // Check if swap is possible
    const swapInfo = canSwapTokens(tokenFrom, tokenTo)
    if (!swapInfo.canSwap) {
      toast.error(`Cannot swap ${tokenFrom.symbol} to ${tokenTo.symbol}. No pool available for this pair.`)
      return
    }

    if (!poolAddress) {
      toast.error('Pool address not found')
      return
    }

    // For now, only support direct swaps (multi-hop will be added later)
    if (swapInfo.route !== 'direct') {
      toast.error(`Multi-hop swaps not yet implemented. Please use direct pairs.`)
      return
    }

    // First approve
    approve({
      address: tokenFromAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [poolAddress, parseEther(amountFrom)],
    })
    toast.loading('Approving tokens...', { id: 'approve' })

    // Swap will be called after approval in useEffect
  }

  useEffect(() => {
    if (approveHash && isApproving === false && amountFrom && tokenFromAddress && address && poolAddress) {
      toast.success('Approval successful!', { id: 'approve' })
      toast.loading('Swapping tokens...', { id: 'swap' })

      swap({
        address: poolAddress,
        abi: AMM_ABI,
        functionName: 'swapExactTokens',
        args: [parseEther(amountFrom), tokenFromAddress, address],
      })
    }
  }, [approveHash, isApproving, amountFrom, tokenFromAddress, address, poolAddress, swap])

  useEffect(() => {
    if (swapHash && isSwapping === false) {
      toast.success('Swap successful!', { id: 'swap' })
      setAmountFrom('')
      setAmountTo('')
    }
  }, [swapHash, isSwapping])

  const handleFlip = () => {
    const tempToken = tokenFrom
    const tempAmount = amountFrom
    setTokenFrom(tokenTo)
    setTokenTo(tempToken)
    setAmountFrom(amountTo)
    setAmountTo(tempAmount)
  }

  // Log errors for debugging
  useEffect(() => {
    if (balanceFromError) {
      console.error('Error fetching balance for tokenFrom:', balanceFromError)
    }
    if (balanceToError) {
      console.error('Error fetching balance for tokenTo:', balanceToError)
    }
  }, [balanceFromError, balanceToError])

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Connect Wallet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please connect your wallet to start swapping tokens
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">Swap Tokens</h1>
        <p className="text-gray-600 dark:text-gray-400">Trade tokens instantly with low slippage</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 p-6 space-y-4"
      >
        {/* From Token */}
        <TokenInput
          label="From"
          token={tokenFrom}
          amount={amountFrom}
          onAmountChange={setAmountFrom}
          onTokenSelect={() => setShowTokenSelector('from')}
          balance={balanceFromFormatted || '0'}
        />

        {/* Flip Button */}
        <div className="flex justify-center -my-2">
          <button
            onClick={handleFlip}
            className="p-3 rounded-full bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors border-4 border-white dark:border-dark-800"
          >
            <ArrowDownUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* To Token */}
        <TokenInput
          label="To"
          token={tokenTo}
          amount={amountTo}
          onAmountChange={() => {}} // Read-only
          onTokenSelect={() => setShowTokenSelector('to')}
          balance={balanceToFormatted || '0'}
          disabled={false}
        />

        {/* Swap Route Info */}
        {tokenFrom && tokenTo && (() => {
          const swapInfo = canSwapTokens(tokenFrom, tokenTo)
          if (!swapInfo.canSwap) {
            return (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-800 dark:text-red-300">
                  ❌ Cannot swap <strong>{tokenFrom.symbol}</strong> to <strong>{tokenTo.symbol}</strong>. No pool available for this pair.
                </p>
              </div>
            )
          }
          if (swapInfo.route === 'via-bridge') {
            return (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  ℹ️ This swap will route through TKA bridge (multi-hop). Direct swaps only for now.
                </p>
              </div>
            )
          }
          return null
        })()}

        {/* Swap Info */}
        {amountFrom && parseFloat(amountFrom) > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 dark:bg-dark-700 rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Price Impact</span>
              <span
                className={`font-medium ${
                  parseFloat(priceImpact) > 1 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {priceImpact}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Slippage Tolerance</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{slippage}%</span>
            </div>
            {reserves && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Rate</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  1 {tokenFrom?.symbol} ={' '}
                  {(
                    parseFloat(formatEther(reserves[1])) / parseFloat(formatEther(reserves[0]))
                  ).toFixed(6)}{' '}
                  {tokenTo?.symbol}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={
            !amountFrom || 
            parseFloat(amountFrom) <= 0 || 
            isApproving || 
            isSwapping ||
            !swapInfo.canSwap ||
            swapInfo.route !== 'direct'
          }
          size="lg"
          className="w-full text-lg py-4"
        >
          {isApproving ? 'Approving...' : isSwapping ? 'Swapping...' : !swapInfo.canSwap ? 'No pool available' : swapInfo.route !== 'direct' ? 'Direct swap only' : 'Swap'}
        </Button>
      </motion.div>

      {/* Settings */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <span className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Swap Settings</span>
          </span>
          <span>{showSettings ? '−' : '+'}</span>
        </button>
        {showSettings && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Slippage Tolerance (%)
              </label>
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                min="0.1"
                max="50"
                step="0.1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Token Selector Modal */}
      {showTokenSelector && (
        <TokenSelector
          selectedToken={showTokenSelector === 'from' ? tokenFrom : tokenTo}
          onSelect={(token) => {
            if (showTokenSelector === 'from') {
              // Don't allow selecting same token as "to"
              if (tokenTo && token.address.toLowerCase() === tokenTo.address.toLowerCase()) {
                toast.error('Cannot select the same token')
                return
              }
              setTokenFrom(token)
              // Check if swap is possible
              const swapCheck = canSwapTokens(token, tokenTo)
              if (!swapCheck.canSwap && tokenTo) {
                toast.error(`Cannot swap ${token.symbol} to ${tokenTo.symbol}. No pool available.`)
              }
            } else {
              // Don't allow selecting same token as "from"
              if (tokenFrom && token.address.toLowerCase() === tokenFrom.address.toLowerCase()) {
                toast.error('Cannot select the same token')
                return
              }
              setTokenTo(token)
              // Check if swap is possible
              const swapCheck = canSwapTokens(tokenFrom, token)
              if (!swapCheck.canSwap && tokenFrom) {
                toast.error(`Cannot swap ${tokenFrom.symbol} to ${token.symbol}. No pool available.`)
              }
            }
          }}
          onClose={() => setShowTokenSelector(null)}
          excludeToken={showTokenSelector === 'from' ? tokenTo : tokenFrom}
          showWarning={true}
        />
      )}
    </div>
  )
}
