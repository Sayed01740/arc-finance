'use client'

import { useAccount, useReadContract } from 'wagmi'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Lock, ArrowRight, ArrowLeftRight, Coins, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { MetricCard } from '@/components/ui/MetricCard'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { AMM_ABI } from '@/utils/abi'
import { formatEther, erc20Abi } from 'viem'
import { useTokenBalances } from '@/hooks/useTokenBalance'
import { ALL_TOKENS } from '@/utils/tokens'

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS as `0x${string}`
const TOKEN_A_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS as `0x${string}`
const TOKEN_B_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS as `0x${string}`

export default function Home() {
  const { isConnected, address } = useAccount()

  const { data: reserves } = useReadContract({
    address: AMM_ADDRESS,
    abi: AMM_ABI,
    functionName: 'getReserves',
    query: {
      refetchInterval: 5000,
      enabled: !!AMM_ADDRESS,
    },
  })

  // Fetch balances for all tokens
  const { balances: allBalances } = useTokenBalances(ALL_TOKENS, address)

  // Get specific token balances
  const tokenABalance = TOKEN_A_ADDRESS ? allBalances[TOKEN_A_ADDRESS.toLowerCase()] : null
  const tokenBBalance = TOKEN_B_ADDRESS ? allBalances[TOKEN_B_ADDRESS.toLowerCase()] : null

  // Calculate TVL (simplified - using reserves)
  const tvl = reserves
    ? (parseFloat(formatEther(reserves[0])) + parseFloat(formatEther(reserves[1]))).toFixed(2)
    : '0'

  const volume24h = '12.5K' // Mock data
  const pools = reserves && reserves[0] > BigInt(0) ? 1 : 0

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 px-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Decentralized Exchange
          <br />
          <span className="text-gray-900 dark:text-gray-100">Built on Arc Network</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Swap tokens, provide liquidity, and earn rewards with minimal slippage and competitive fees.
        </p>
        <div className="flex items-center justify-center space-x-4">
          {!isConnected ? (
            <WalletConnectButton />
          ) : (
            <Link href="/swap">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Swapping <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
          <Link href="/liquidity">
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Add Liquidity
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Value Locked"
          value={`$${tvl}K`}
          subtitle="Across all pools"
          icon={<Lock className="w-5 h-5" />}
          trend={{ value: '+12.5%', isPositive: true }}
        />
        <MetricCard
          title="24h Volume"
          value={`$${volume24h}`}
          subtitle="Total trading volume"
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: '+8.2%', isPositive: true }}
        />
        <MetricCard
          title="Active Pools"
          value={pools.toString()}
          subtitle="Liquidity pools"
          icon={<BarChart3 className="w-5 h-5" />}
        />
      </section>

      {/* Features */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <ArrowLeftRight className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Swap</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Trade tokens instantly with low slippage and competitive fees.
            </p>
            <Link href="/swap" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Start Swapping →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <Coins className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Liquidity</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Provide liquidity to earn trading fees and LP rewards.
            </p>
            <Link href="/liquidity" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Add Liquidity →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Farming</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Stake LP tokens to earn additional rewards and incentives.
            </p>
            <Link href="/farming" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Start Farming →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      {isConnected && (tokenABalance || tokenBBalance) && (
        <section className="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-dark-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Your Balances</h3>
          <div className="grid grid-cols-2 gap-4">
            {tokenABalance && parseFloat(tokenABalance) > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Token A</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {parseFloat(tokenABalance).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}
                </p>
              </div>
            )}
            {tokenBBalance && parseFloat(tokenBBalance) > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Token B</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {parseFloat(tokenBBalance).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}