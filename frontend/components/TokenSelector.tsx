'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Check, Circle } from 'lucide-react'
import { Token, OFFICIAL_TOKENS, CUSTOM_TOKENS } from '@/utils/tokens'

interface TokenSelectorProps {
  selectedToken: Token | null
  onSelect: (token: Token) => void
  onClose: () => void
  excludeToken?: Token | null
  showWarning?: boolean // Show warning for unsupported tokens
}

export function TokenSelector({ selectedToken, onSelect, onClose, excludeToken, showWarning = false }: TokenSelectorProps) {
  const TOKEN_A_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS?.toLowerCase()
  const TOKEN_B_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS?.toLowerCase()

  const isTokenSupported = (token: Token): boolean => {
    if (!TOKEN_A_ADDRESS || !TOKEN_B_ADDRESS) return false
    const tokenAddr = token.address.toLowerCase()
    return tokenAddr === TOKEN_A_ADDRESS || tokenAddr === TOKEN_B_ADDRESS
  }
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOfficial = OFFICIAL_TOKENS.filter(
    (token) =>
      !excludeToken ||
      token.address.toLowerCase() !== excludeToken.address.toLowerCase()
  ).filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCustom = CUSTOM_TOKENS.filter(
    (token) =>
      !excludeToken ||
      token.address.toLowerCase() !== excludeToken.address.toLowerCase()
  ).filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (token: Token) => {
    onSelect(token)
    onClose()
  }

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Select Token</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-dark-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or symbol"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Token List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Supported Tokens (TKA/TKB) */}
              {filteredCustom.filter(t => isTokenSupported(t)).length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3 px-2">
                    <Circle className="w-4 h-4 text-green-500" />
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Available in AMM Pool</h3>
                  </div>
                  <div className="space-y-1">
                    {filteredCustom.filter(t => isTokenSupported(t)).map((token) => (
                      <TokenItem
                        key={token.address}
                        token={token}
                        onSelect={handleSelect}
                        isSelected={selectedToken?.address.toLowerCase() === token.address.toLowerCase()}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Official Tokens (with warning) */}
              {filteredOfficial.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3 px-2">
                    <Circle className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Official Tokens</h3>
                    {showWarning && (
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">(Not in AMM pool)</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {filteredOfficial.map((token) => (
                      <TokenItem
                        key={token.address}
                        token={token}
                        onSelect={handleSelect}
                        isSelected={selectedToken?.address.toLowerCase() === token.address.toLowerCase()}
                        showWarning={showWarning && !isTokenSupported(token)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Tokens (unsupported) */}
              {filteredCustom.filter(t => !isTokenSupported(t)).length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3 px-2">
                    <Circle className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Custom Tokens</h3>
                    {showWarning && (
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">(Not in AMM pool)</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {filteredCustom.filter(t => !isTokenSupported(t)).map((token) => (
                      <TokenItem
                        key={token.address}
                        token={token}
                        onSelect={handleSelect}
                        isSelected={selectedToken?.address.toLowerCase() === token.address.toLowerCase()}
                        showWarning={showWarning && !isTokenSupported(token)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredOfficial.length === 0 && filteredCustom.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No tokens found</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  )
}

interface TokenItemProps {
  token: Token
  onSelect: (token: Token) => void
  isSelected: boolean
  showWarning?: boolean
}

function TokenItem({ token, onSelect, isSelected, showWarning }: TokenItemProps) {
  return (
    <button
      onClick={() => onSelect(token)}
      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
          {token.symbol[0]}
        </div>
        <div className="text-left">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100">{token.symbol}</span>
            {token.isOfficial && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                Official
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{token.name}</span>
          {showWarning && (
            <span className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 block">
              ⚠️ Not available in this AMM pool
            </span>
          )}
        </div>
      </div>
      {isSelected && (
        <Check className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      )}
    </button>
  )
}

