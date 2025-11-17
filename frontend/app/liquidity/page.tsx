'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, erc20Abi } from 'viem'
import { motion } from 'framer-motion'
import { Plus, Minus, TrendingUp, BarChart3 } from 'lucide-react'
import { TokenInput } from '@/components/TokenInput'
import { Token, ALL_TOKENS } from '@/utils/tokens'
import { Button } from '@/components/ui/Button'
import { AMM_ABI } from '@/utils/abi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTokenBalance } from '@/hooks/useTokenBalance'
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

// Mock price data for chart
const generatePriceData = () => {
  const data = []
  const basePrice = 1.0
  for (let i = 0; i < 30; i++) {
    data.push({
      time: `${i + 1}d`,
      price: basePrice + (Math.random() - 0.5) * 0.2,
    })
  }
  return data
}

export default function LiquidityPage() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add')
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [lpAmount, setLpAmount] = useState('')

  const { data: reserves } = useReadContract({
    address: AMM_ADDRESS,
    abi: AMM_ABI,
    functionName: 'getReserves',
    query: {
      refetchInterval: 5000,
      enabled: !!AMM_ADDRESS,
    },
  })

  const { data: lpBalance } = useReadContract({
    address: AMM_ADDRESS,
    abi: AMM_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!AMM_ADDRESS,
      refetchInterval: 5000,
    },
  })

  // Find tokens from ALL_TOKENS list
  const tokenA = ALL_TOKENS.find(t => t.address.toLowerCase() === TOKEN_A_ADDRESS?.toLowerCase())
  const tokenB = ALL_TOKENS.find(t => t.address.toLowerCase() === TOKEN_B_ADDRESS?.toLowerCase())

  // Use custom hook for better balance handling
  const { formattedBalance: tokenABalanceFormatted, error: tokenAError } = useTokenBalance(tokenA || null, address)
  const { formattedBalance: tokenBBalanceFormatted, error: tokenBError } = useTokenBalance(tokenB || null, address)

  const { writeContract: approveA, data: approveAHash } = useWriteContract()
  const { writeContract: approveB, data: approveBHash } = useWriteContract()
  const { writeContract: addLiquidity, data: addLiquidityHash } = useWriteContract()
  const { writeContract: removeLiquidity, data: removeLiquidityHash } = useWriteContract()

  const { isLoading: isApprovingA } = useWaitForTransactionReceipt({ hash: approveAHash })
  const { isLoading: isApprovingB } = useWaitForTransactionReceipt({ hash: approveBHash })
  const { isLoading: isAdding } = useWaitForTransactionReceipt({ hash: addLiquidityHash })
  const { isLoading: isRemoving } = useWaitForTransactionReceipt({ hash: removeLiquidityHash })

  const handleAddLiquidity = async () => {
    if (!amountA || !amountB || !isConnected) {
      toast.error('Please enter amounts and connect wallet')
      return
    }

    try {
      toast.loading('Approving tokens...', { id: 'approve' })
      
      approveA({
        address: TOKEN_A_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [AMM_ADDRESS, parseEther(amountA)],
      })
      
      approveB({
        address: TOKEN_B_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [AMM_ADDRESS, parseEther(amountB)],
      })
    } catch (error) {
      toast.error('Approval failed')
    }
  }

  useEffect(() => {
    if (approveAHash && approveBHash && !isApprovingA && !isApprovingB) {
      toast.success('Approvals successful!', { id: 'approve' })
      toast.loading('Adding liquidity...', { id: 'add' })
      
      addLiquidity({
        address: AMM_ADDRESS,
        abi: AMM_ABI,
        functionName: 'addLiquidity',
        args: [parseEther(amountA), parseEther(amountB), address!],
      })
    }
  }, [approveAHash, approveBHash, isApprovingA, isApprovingB])

  useEffect(() => {
    if (addLiquidityHash && !isAdding) {
      toast.success('Liquidity added successfully!', { id: 'add' })
      setAmountA('')
      setAmountB('')
    }
  }, [addLiquidityHash, isAdding])

  const handleRemoveLiquidity = () => {
    if (!lpAmount || !isConnected) {
      toast.error('Please enter LP amount and connect wallet')
      return
    }

    toast.loading('Removing liquidity...', { id: 'remove' })
    removeLiquidity({
      address: AMM_ADDRESS,
      abi: AMM_ABI,
      functionName: 'removeLiquidity',
      args: [parseEther(lpAmount), address!],
    })
  }

  useEffect(() => {
    if (removeLiquidityHash && !isRemoving) {
      toast.success('Liquidity removed successfully!', { id: 'remove' })
      setLpAmount('')
    }
  }, [removeLiquidityHash, isRemoving])

  const reserveA = reserves ? formatEther(reserves[0]) : '0'
  const reserveB = reserves ? formatEther(reserves[1]) : '0'
  const lpBalanceFormatted = lpBalance ? formatEther(lpBalance) : '0'
  // Log errors for debugging
  useEffect(() => {
    if (tokenAError) {
      console.error('Error fetching tokenA balance:', tokenAError)
    }
    if (tokenBError) {
      console.error('Error fetching tokenB balance:', tokenBError)
    }
  }, [tokenAError, tokenBError])
  const priceData = generatePriceData()

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Connect Wallet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please connect your wallet to manage liquidity
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">Liquidity Pools</h1>
        <p className="text-gray-600 dark:text-gray-400">Add or remove liquidity from pools</p>
      </div>

      {/* Pool Statistics */}
      {reserves && reserves[0] > BigInt(0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Token A Reserve</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {parseFloat(reserveA).toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Token B Reserve</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {parseFloat(reserveB).toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pool Price</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {(parseFloat(reserveB) / parseFloat(reserveA)).toFixed(4)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Price Chart */}
      {reserves && reserves[0] > BigInt(0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Price Chart</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#667eea"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-dark-700">
        <button
          onClick={() => setActiveTab('add')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'add'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Add Liquidity
        </button>
        <button
          onClick={() => setActiveTab('remove')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'remove'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <Minus className="w-4 h-4 inline mr-2" />
          Remove Liquidity
        </button>
      </div>

      {/* Add Liquidity */}
      {activeTab === 'add' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 p-6 space-y-4"
        >
          <TokenInput
            label="Token A Amount"
            token={ALL_TOKENS[0] || null}
            amount={amountA}
            onAmountChange={setAmountA}
            onTokenSelect={() => {}}
            balance={tokenABalanceFormatted}
          />
          <TokenInput
            label="Token B Amount"
            token={ALL_TOKENS[1] || null}
            amount={amountB}
            onAmountChange={setAmountB}
            onTokenSelect={() => {}}
            balance={tokenBBalanceFormatted}
          />
          {reserves && reserves[0] > BigInt(0) && (
            <div className="bg-gray-50 dark:bg-dark-700 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Optimal ratio: 1 TKA = {(parseFloat(reserveB) / parseFloat(reserveA)).toFixed(4)} TKB</p>
            </div>
          )}
          <Button
            onClick={handleAddLiquidity}
            disabled={!amountA || !amountB || isApprovingA || isApprovingB || isAdding}
            size="lg"
            className="w-full"
          >
            {isApprovingA || isApprovingB || isAdding ? 'Processing...' : 'Add Liquidity'}
          </Button>
        </motion.div>
      )}

      {/* Remove Liquidity */}
      {activeTab === 'remove' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 p-6 space-y-4"
        >
          <TokenInput
            label="LP Token Amount"
            token={null}
            amount={lpAmount}
            onAmountChange={setLpAmount}
            onTokenSelect={() => {}}
            balance={lpBalanceFormatted}
          />
          {reserves && reserves[0] > 0n && lpAmount && parseFloat(lpAmount) > 0 && (
            <div className="bg-gray-50 dark:bg-dark-700 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">You will receive:</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Token A:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {((parseFloat(lpAmount) / parseFloat(lpBalanceFormatted || '1')) * parseFloat(reserveA)).toFixed(4)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Token B:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {((parseFloat(lpAmount) / parseFloat(lpBalanceFormatted || '1')) * parseFloat(reserveB)).toFixed(4)}
                </span>
              </div>
            </div>
          )}
          <Button
            onClick={handleRemoveLiquidity}
            disabled={!lpAmount || isRemoving}
            size="lg"
            className="w-full"
          >
            {isRemoving ? 'Removing...' : 'Remove Liquidity'}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
