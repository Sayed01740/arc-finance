'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther, formatEther, erc20Abi, maxUint256 } from 'viem'
import { motion } from 'framer-motion'
import { ArrowDownUp, Settings, Info } from 'lucide-react'
import { TokenInput } from '@/components/TokenInput'
import { Button } from '@/components/ui/Button'
import { AMM_ABI } from '@/utils/abi'
import toast from 'react-hot-toast'

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS as `0x${string}`
const TOKEN_A_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS as `0x${string}`
const TOKEN_B_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS as `0x${string}`

const TOKENS = {
  TKA: {
    symbol: 'TKA',
    name: 'Token A',
    address: TOKEN_A_ADDRESS,
  },
  TKB: {
    symbol: 'TKB',
    name: 'Token B',
    address: TOKEN_B_ADDRESS,
  },
}

export default function SwapPage() {
  const { address, isConnected } = useAccount()
  const [tokenFrom, setTokenFrom] = useState<typeof TOKENS.TKA | typeof TOKENS.TKB | null>(TOKENS.TKA)
  const [tokenTo, setTokenTo] = useState<typeof TOKENS.TKA | typeof TOKENS.TKB | null>(TOKENS.TKB)
  const [amountFrom, setAmountFrom] = useState('')
  const [amountTo, setAmountTo] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [showSettings, setShowSettings] = useState(false)

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
      enabled: !!amountFrom && parseFloat(amountFrom) > 0 && !!tokenFromAddress && !!AMM_ADDRESS,
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
          onTokenSelect={() => {
            // Simple token selection - in real app, show modal
            setTokenFrom(tokenFrom === TOKENS.TKA ? TOKENS.TKB : TOKENS.TKA)
          }}
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
          onTokenSelect={() => {
            setTokenTo(tokenTo === TOKENS.TKA ? TOKENS.TKB : TOKENS.TKA)
          }}
          disabled={true}
        />

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
          disabled={!amountFrom || parseFloat(amountFrom) <= 0 || isApproving || isSwapping}
          size="lg"
          className="w-full text-lg py-4"
        >
          {isApproving ? 'Approving...' : isSwapping ? 'Swapping...' : 'Swap'}
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
    </div>
  )
}
