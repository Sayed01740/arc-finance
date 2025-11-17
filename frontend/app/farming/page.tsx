'use client'

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, erc20Abi } from 'viem'
import { motion } from 'framer-motion'
import { TrendingUp, Zap, Award } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AMM_ABI } from '@/utils/abi'
import toast from 'react-hot-toast'

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS as `0x${string}`

interface FarmingPool {
  id: string
  name: string
  pair: string
  apr: string
  totalStaked: string
  rewardToken: string
  staked: string
  earned: string
}

export default function FarmingPage() {
  const { address, isConnected } = useAccount()
  const [stakeAmount, setStakeAmount] = useState('')

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

  // Mock farming pools - in real app, fetch from contract
  const farmingPools: FarmingPool[] = [
    {
      id: '1',
      name: 'TKA/TKB Pool',
      pair: 'TKA/TKB',
      apr: '125.5%',
      totalStaked: '50,000',
      rewardToken: 'TKA',
      staked: lpBalance ? formatEther(lpBalance) : '0',
      earned: '0',
    },
  ]

  const handleStake = (poolId: string) => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }
    // In real app, call staking contract
    toast.success(`Staked ${stakeAmount} LP tokens!`)
    setStakeAmount('')
  }

  const handleUnstake = (poolId: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }
    // In real app, call unstaking contract
    toast.success('Unstaked successfully!')
  }

  const handleClaim = (poolId: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }
    // In real app, call claim rewards contract
    toast.success('Rewards claimed!')
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Connect Wallet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please connect your wallet to stake LP tokens and earn rewards
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">Farming & Rewards</h1>
        <p className="text-gray-600 dark:text-gray-400">Stake LP tokens to earn additional rewards</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rewards</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$125.5K</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700"
        >
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Staked</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$250K</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Award className="w-5 h-5 text-purple-500" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Pools</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{farmingPools.length}</p>
        </motion.div>
      </div>

      {/* Farming Pools */}
      <div className="space-y-4">
        {farmingPools.map((pool, index) => (
          <motion.div
            key={pool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 shadow-lg"
          >
            <div className="grid md:grid-cols-12 gap-6 items-center">
              {/* Pool Info */}
              <div className="md:col-span-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{pool.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{pool.pair}</p>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg text-sm font-medium">
                    APR: {pool.apr}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="md:col-span-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Staked:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{pool.totalStaked}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Your Staked:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {parseFloat(pool.staked).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Earned:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {pool.earned} {pool.rewardToken}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="md:col-span-4 space-y-2">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Amount"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 text-sm"
                  />
                  <Button onClick={() => handleStake(pool.id)} size="sm" variant="primary">
                    Stake
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleUnstake(pool.id)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Unstake
                  </Button>
                  <Button
                    onClick={() => handleClaim(pool.id)}
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                  >
                    Claim
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
      >
        <p className="text-sm text-blue-900 dark:text-blue-300">
          <strong>Note:</strong> Staking LP tokens allows you to earn additional rewards. Rewards are distributed
          based on your stake share of the pool. You can unstake and claim rewards at any time.
        </p>
      </motion.div>
    </div>
  )
}
