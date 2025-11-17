'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { Clock, Plus, X } from 'lucide-react'
import { TokenInput } from '@/components/TokenInput'
import { Token, ALL_TOKENS } from '@/utils/tokens'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

// Use tokens from token list
const DEFAULT_TOKEN_FROM = ALL_TOKENS[0] || null
const DEFAULT_TOKEN_TO = ALL_TOKENS[1] || null

interface LimitOrder {
  id: string
  tokenFrom: string
  tokenTo: string
  amount: string
  limitPrice: string
  status: 'open' | 'filled' | 'cancelled'
}

export default function LimitOrderPage() {
  const { isConnected } = useAccount()
  const [tokenFrom, setTokenFrom] = useState<Token | null>(DEFAULT_TOKEN_FROM)
  const [tokenTo, setTokenTo] = useState<Token | null>(DEFAULT_TOKEN_TO)
  const [amount, setAmount] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [orders, setOrders] = useState<LimitOrder[]>([])

  const handlePlaceOrder = () => {
    if (!amount || !limitPrice || !tokenFrom || !tokenTo) {
      toast.error('Please fill all fields')
      return
    }

    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    const newOrder: LimitOrder = {
      id: Date.now().toString(),
      tokenFrom: tokenFrom.symbol,
      tokenTo: tokenTo.symbol,
      amount,
      limitPrice,
      status: 'open',
    }

    setOrders([...orders, newOrder])
    toast.success('Limit order placed successfully!')
    setAmount('')
    setLimitPrice('')
  }

  const handleCancelOrder = (id: string) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: 'cancelled' } : order)))
    toast.success('Order cancelled')
  }

  const openOrders = orders.filter((order) => order.status === 'open')

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Connect Wallet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please connect your wallet to place limit orders
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">Limit Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">Set your desired price and execute trades automatically</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Place Order Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Place Limit Order</span>
          </h2>

          <TokenInput
            label="From Token"
            token={tokenFrom}
            amount={amount}
            onAmountChange={setAmount}
            onTokenSelect={() => {
              // Toggle between available tokens
              const currentIndex = ALL_TOKENS.findIndex(t => t.address === tokenFrom?.address)
              const nextToken = ALL_TOKENS[(currentIndex + 1) % ALL_TOKENS.length]
              if (nextToken.address !== tokenTo?.address) {
                setTokenFrom(nextToken)
              }
            }}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To Token
            </label>
            <div className="bg-gray-100 dark:bg-dark-700 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {tokenTo?.symbol[0]}
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{tokenTo?.symbol}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Limit Price ({tokenTo?.symbol} per {tokenFrom?.symbol})
            </label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-700 rounded-xl bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-500 transition-colors"
            />
          </div>

          <Button onClick={handlePlaceOrder} size="lg" className="w-full">
            Place Limit Order
          </Button>
        </motion.div>

        {/* Open Orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-700 p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Open Orders</span>
          </h2>

          {openOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No open orders</p>
            </div>
          ) : (
            <div className="space-y-3">
              {openOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-50 dark:bg-dark-700 rounded-xl p-4 border border-gray-200 dark:border-dark-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {order.amount} {order.tokenFrom} → {order.tokenTo}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Limit: {order.limitPrice} {order.tokenTo} per {order.tokenFrom}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded">
                    Open
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
      >
        <p className="text-sm text-blue-900 dark:text-blue-300">
          <strong>Note:</strong> Limit orders are executed automatically when the market price reaches your specified
          limit price. Orders can be cancelled at any time before execution.
        </p>
      </motion.div>
    </div>
  )
}
