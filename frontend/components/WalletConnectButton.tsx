'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, X, ChevronDown, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface WalletOption {
  id: string
  name: string
  icon: string
  connectorId: string
}

const walletOptions: WalletOption[] = [
  { id: 'metaMask', name: 'MetaMask', icon: '🦊', connectorId: 'injected' },
  { id: 'rabby', name: 'Rabby Wallet', icon: '🐰', connectorId: 'injected' },
  { id: 'trust', name: 'Trust Wallet', icon: '🔒', connectorId: 'injected' },
  { id: 'okx', name: 'OKX Wallet', icon: '⚡', connectorId: 'injected' },
  { id: 'bitget', name: 'Bitget Wallet', icon: '💼', connectorId: 'injected' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🟦', connectorId: 'coinbaseWalletSDK' },
  { id: 'phantom', name: 'Phantom', icon: '👻', connectorId: 'injected' },
  { id: 'injected', name: 'Other EVM Wallet', icon: '🔌', connectorId: 'injected' },
]

export function WalletConnectButton() {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [showWalletModal, setShowWalletModal] = useState(false)

  const handleConnect = (walletOption: WalletOption) => {
    try {
      // Check if wallet is installed
      const isInstalled = typeof window !== 'undefined' && window.ethereum
      
      if (!isInstalled && walletOption.id !== 'injected') {
        toast.error(`${walletOption.name} not detected. Please install the wallet extension.`)
        return
      }

      // Try to find specific connector
      let connectorToUse = connectors.find((c) => {
        if (walletOption.id === 'metaMask') {
          return c.id === 'metaMaskSDK' || c.id === 'metaMask' || c.name?.toLowerCase().includes('metamask')
        }
        if (walletOption.id === 'coinbase') {
          return c.id === 'coinbaseWalletSDK' || c.id === 'coinbase'
        }
        return c.id === walletOption.connectorId || c.name?.toLowerCase().includes(walletOption.id.toLowerCase())
      })

      // Fallback to injected connector for all injected wallets
      if (!connectorToUse && walletOption.connectorId === 'injected') {
        connectorToUse = connectors.find((c) => c.id === 'injected' || c.id === 'metaMaskSDK')
      }

      // Final fallback to MetaMask or first available connector
      if (!connectorToUse) {
        connectorToUse = connectors.find((c) => c.id === 'metaMaskSDK' || c.id === 'metaMask') || connectors[0]
      }

      if (connectorToUse) {
        connect({ connector: connectorToUse })
        toast.success(`Connecting to ${walletOption.name}...`)
        setShowWalletModal(false)
      } else {
        toast.error(`Failed to connect to ${walletOption.name}. Please install the wallet extension.`)
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      toast.error(`Failed to connect to ${walletOption.name}`)
    }
  }

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
  const connectedWalletName = connector?.name || 'Wallet'

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-mono text-gray-900 dark:text-gray-100">{shortAddress}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">({connectedWalletName})</span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowWalletModal(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-lg shadow-primary-500/50"
      >
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Wallet Selection Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWalletModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Connect Wallet
                  </h2>
                  <button
                    onClick={() => setShowWalletModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Connect to one of our available wallet providers or create a new wallet.
                </p>

                <div className="space-y-2">
                  {walletOptions.map((wallet) => {
                    const ethereum = typeof window !== 'undefined' ? (window as any).ethereum : null
                    const isInstalled = ethereum && (
                      wallet.id === 'injected' || 
                      (wallet.id === 'metaMask' && (ethereum.isMetaMask || ethereum.providers?.some((p: any) => p.isMetaMask))) ||
                      (wallet.id === 'rabby' && (ethereum.isRabby || ethereum.providers?.some((p: any) => p.isRabby))) ||
                      (wallet.id === 'trust' && (ethereum.isTrust || ethereum.providers?.some((p: any) => p.isTrust))) ||
                      (wallet.id === 'okx' && (ethereum.isOKExWallet || ethereum.providers?.some((p: any) => p.isOKExWallet))) ||
                      (wallet.id === 'bitget' && (ethereum.isBitKeep || ethereum.providers?.some((p: any) => p.isBitKeep))) ||
                      (wallet.id === 'phantom' && (ethereum.isPhantom || ethereum.providers?.some((p: any) => p.isPhantom))) ||
                      (wallet.id === 'coinbase' && ethereum.isCoinbaseWallet)
                    )

                    return (
                      <motion.button
                        key={wallet.id}
                        onClick={() => handleConnect(wallet)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-xl transition-colors border-2 border-transparent hover:border-primary-500 dark:hover:border-primary-500 group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{wallet.icon}</span>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                              {wallet.name}
                            </p>
                            {isInstalled && (
                              <p className="text-xs text-green-600 dark:text-green-400">Detected</p>
                            )}
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary-500 rotate-[-90deg]" />
                      </motion.button>
                    )
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
                  <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                    New to Ethereum?{' '}
                    <a
                      href="https://ethereum.org/en/wallets/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Learn more about wallets
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}