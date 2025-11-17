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
import toast from 'react-hot-toast'

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS as `0x${string}`
const TOKEN_A_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS as `0x${string}`
const TOKEN_B_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS as `0x${string}`

// Get tokens that are actually supported by the AMM pool
const AMM_TOKEN_A = ALL_TOKENS.find(t => t.address.toLowerCase() === TOKEN_A_ADDRESS?.toLowerCase()) || null
const AMM_TOKEN_B = ALL_TOKENS.find(t => t.address.toLowerCase() === TOKEN_B_ADDRESS?.toLowerCase()) || null

// Default to AMM supported tokens (TKA/TKB)
const DEFAULT_FROM_TOKEN = AMM_TOKEN_A || ALL_TOKENS[2] || null
const DEFAULT_TO_TOKEN = AMM_TOKEN_B || ALL_TOKENS[3] || null

// Check if a token is supported by the AMM
function isTokenSupported(token: Token | null): boolean {
  if (!token || !TOKEN_A_ADDRESS || !TOKEN_B_ADDRESS) return false
  const tokenAddr = token.address.toLowerCase()
  return tokenAddr === TOKEN_A_ADDRESS.toLowerCase() || tokenAddr === TOKEN_B_ADDRESS.toLowerCase()
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

  const { data: balanceFrom } = useReadContract({
    address: tokenFromAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenFromAddress,
      refetchInterval: 5000,
    },
  })

  const { data: amountOut } = useReadContract({
    address: AMM_ADDRESS,
    abi: AMM_ABI,
    functionName: 'getAmountOut',
    args: amountFrom && parseFloat(amountFrom) > 0 ? [parseEther(amountFrom), tokenFromAddress] : undefined,
    query: {
      enabled: !!amountFrom && parseFloat(amountFrom) > 0 && !!tokenFromAddress && !!AMM_ADDRESS && isTokenSupported(tokenFrom),
    },
  })

  const { data: reserves } = useReadContract({
    address: AMM_ADDRESS,
    abi: AMM_ABI,
    functionName: 'getReserves',
    query: {
      refetchInterval: 5000,
      enabled: !!AMM_ADDRESS,
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

    // Validate tokens are supported by AMM
    if (!isTokenSupported(tokenFrom)) {
      toast.error(`${tokenFrom.symbol} is not supported in this AMM pool. Only TKA and TKB can be swapped.`)
      return
    }
    if (!isTokenSupported(tokenTo)) {
      toast.error(`${tokenTo.symbol} is not supported in this AMM pool. Only TKA and TKB can be swapped.`)
      return
    }

    // First approve
    approve({
      address: tokenFromAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [AMM_ADDRESS, parseEther(amountFrom)],
    })
    toast.loading('Approving tokens...', { id: 'approve' })

    // Swap will be called after approval in useEffect
  }

  useEffect(() => {
    if (approveHash && isApproving === false && amountFrom && tokenFromAddress && address) {
      toast.success('Approval successful!', { id: 'approve' })
      toast.loading('Swapping tokens...', { id: 'swap' })

      swap({
        address: AMM_ADDRESS,
        abi: AMM_ABI,
        functionName: 'swapExactTokens',
        args: [parseEther(amountFrom), tokenFromAddress, address],
      })
    }
  }, [approveHash, isApproving, amountFrom, tokenFromAddress, address, swap])

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

  const balanceFromFormatted = balanceFrom ? formatEther(balanceFrom) : '0'

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
          balance={balanceFromFormatted}
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
          disabled={false}
        />

        {/* Warning if tokens not supported */}
        {tokenFrom && !isTokenSupported(tokenFrom) && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ <strong>{tokenFrom.symbol}</strong> is not supported in this AMM pool. This AMM only supports <strong>TKA ↔ TKB</strong> swaps.
            </p>
          </div>
        )}
        {tokenTo && !isTokenSupported(tokenTo) && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ <strong>{tokenTo.symbol}</strong> is not supported in this AMM pool. This AMM only supports <strong>TKA ↔ TKB</strong> swaps.
            </p>
          </div>
        )}

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
            !isTokenSupported(tokenFrom) ||
            !isTokenSupported(tokenTo)
          }
          size="lg"
          className="w-full text-lg py-4"
        >
          {isApproving ? 'Approving...' : isSwapping ? 'Swapping...' : !isTokenSupported(tokenFrom) || !isTokenSupported(tokenTo) ? 'Select TKA or TKB to swap' : 'Swap'}
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
              // Show warning if not supported
              if (!isTokenSupported(token)) {
                toast.error(`${token.symbol} is not supported in this AMM. Only TKA and TKB can be swapped.`)
              }
            } else {
              // Don't allow selecting same token as "from"
              if (tokenFrom && token.address.toLowerCase() === tokenFrom.address.toLowerCase()) {
                toast.error('Cannot select the same token')
                return
              }
              setTokenTo(token)
              // Show warning if not supported
              if (!isTokenSupported(token)) {
                toast.error(`${token.symbol} is not supported in this AMM. Only TKA and TKB can be swapped.`)
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
