'use client'

import { useState } from 'react'
import { ChevronDown, Maximize2 } from 'lucide-react'
import clsx from 'clsx'

interface Token {
  symbol: string
  name: string
  address: string
  logo?: string
}

interface TokenInputProps {
  label: string
  token: Token | null
  amount: string
  onAmountChange: (amount: string) => void
  onTokenSelect: () => void
  balance?: string
  max?: boolean
  disabled?: boolean
  className?: string
}

export function TokenInput({
  label,
  token,
  amount,
  onAmountChange,
  onTokenSelect,
  balance,
  max = true,
  disabled = false,
  className,
}: TokenInputProps) {
  const handleMax = () => {
    if (balance) {
      onAmountChange(balance)
    }
  }

  return (
    <div className={clsx('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {balance && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Balance: {parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </span>
            {max && (
              <button
                onClick={handleMax}
                className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>
      <div className="relative bg-white dark:bg-dark-800 rounded-xl border-2 border-gray-200 dark:border-dark-700 p-4 focus-within:border-primary-500 dark:focus-within:border-primary-500 transition-colors">
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.0"
            disabled={disabled}
            className="flex-1 text-2xl font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 disabled:opacity-50"
          />
          <button
            onClick={onTokenSelect}
            disabled={disabled}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors disabled:opacity-50"
          >
            {token ? (
              <>
                <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {token.symbol[0]}
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{token.symbol}</span>
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </>
            ) : (
              <>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Select Token</span>
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
