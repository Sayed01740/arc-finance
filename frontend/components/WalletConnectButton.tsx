'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Wallet, Sparkles } from 'lucide-react'

// Professional wallet icons with proper logo URLs
const walletConfig: Record<string, { name: string; icon: string; color?: string }> = {
  'MetaMask': {
    name: 'MetaMask',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    color: '#F6851B'
  },
  'WalletConnect': {
    name: 'WalletConnect',
    icon: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
    color: '#3B99FC'
  },
  'OKX Wallet': {
    name: 'OKX Wallet',
    icon: 'https://www.okx.com/favicon.ico',
    color: '#000000'
  },
  'Bitget Wallet': {
    name: 'Bitget Wallet',
    icon: 'https://web3.bitget.com/favicon.ico',
    color: '#1E1E1E'
  },
  'TokenPocket': {
    name: 'TokenPocket',
    icon: 'https://tokenpocket.pro/favicon.ico',
    color: '#2984FF'
  },
  'Bybit Wallet': {
    name: 'Bybit Wallet',
    icon: 'https://www.bybit.com/favicon.ico',
    color: '#F7A600'
  },
  'Trust Wallet': {
    name: 'Trust Wallet',
    icon: 'https://trustwallet.com/assets/images/favicon.png',
    color: '#3375BB'
  },
  'Particle': {
    name: 'Particle',
    icon: 'https://static.particle.network/favicon.ico',
    color: '#5B4FFF'
  },
  'Rabby': {
    name: 'Rabby',
    icon: 'https://rabby.io/favicon.ico',
    color: '#8697FF'
  },
  'OneKey': {
    name: 'OneKey',
    icon: 'https://onekey.so/favicon.ico',
    color: '#00B812'
  },
  'Xdefi': {
    name: 'Xdefi',
    icon: 'https://xdefi.io/favicon.ico',
    color: '#1A1A1A'
  },
  'Phantom': {
    name: 'Phantom',
    icon: 'https://phantom.app/favicon.ico',
    color: '#AB9FF2'
  },
  'Binance Wallet': {
    name: 'Binance Wallet',
    icon: 'https://www.binance.com/favicon.ico',
    color: '#F3BA2F'
  },
  'Safe': {
    name: 'Safe',
    icon: 'https://safe.global/favicon.ico',
    color: '#12FF80'
  },
  'Injected': {
    name: 'Injected',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIxMiIgZmlsbD0iIzE1MTUxNSIvPjxwYXRoIGQ9Ik0zMiAyMEMyNS4zNzI2IDIwIDIwIDI1LjM3MjYgMjAgMzJDMjAgMzguNjI3NCAyNS4zNzI2IDQ0IDMyIDQ0QzM4LjYyNzQgNDQgNDQgMzguNjI3NCA0NCAzMkM0NCAyNS4zNzI2IDM4LjYyNzQgMjAgMzIgMjBaIiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+',
    color: '#151515'
  },
  'Coinbase Wallet': {
    name: 'Coinbase Wallet',
    icon: 'https://images.ctfassets.net/9sy2a00eg0cc/6y0Pv7Slf2vqnlk4rYW6f5/0b1bf6167fd0c07a664b16c65c0d6e6a/coinbase-wallet-logo.svg',
    color: '#0052FF'
  },
}

// Map connector IDs to wallet names
const connectorNameMap: Record<string, string> = {
  'io.metamask': 'MetaMask',
  'io.metamask.flask': 'MetaMask',
  'walletConnect': 'WalletConnect',
  'walletConnectLegacy': 'WalletConnect',
  'okxwallet': 'OKX Wallet',
  'okx': 'OKX Wallet',
  'bitkeep': 'Bitget Wallet',
  'bitget': 'Bitget Wallet',
  'tokenpocket': 'TokenPocket',
  'bybit': 'Bybit Wallet',
  'trust': 'Trust Wallet',
  'trustwallet': 'Trust Wallet',
  'particle': 'Particle',
  'rabby': 'Rabby',
  'onekey': 'OneKey',
  'onekeywallet': 'OneKey',
  'xdefi': 'Xdefi',
  'phantom': 'Phantom',
  'binance': 'Binance Wallet',
  'binancechainwallet': 'Binance Wallet',
  'safe': 'Safe',
  'gnosis': 'Safe',
  'injected': 'Injected',
  'coinbaseWalletSDK': 'Coinbase Wallet',
  'coinbase': 'Coinbase Wallet',
}

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-4"
      >
        <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20">
          <span className="text-white text-sm font-medium">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors font-medium"
        >
          Disconnect
        </button>
      </motion.div>
    )
  }

  const handleConnect = (connector: any) => {
    connect({ connector })
    setIsModalOpen(false)
  }

  const getWalletConfig = (connector: any) => {
    const id = connector.id.toLowerCase()
    const name = connector.name || ''
    
    // Try to match by connector ID
    for (const [key, walletName] of Object.entries(connectorNameMap)) {
      if (id.includes(key.toLowerCase()) || name.toLowerCase().includes(key.toLowerCase())) {
        return walletConfig[walletName] || walletConfig['Injected']
      }
    }
    
    // Try direct name match
    if (walletConfig[name]) {
      return walletConfig[name]
    }
    
    // Fallback to injected
    return walletConfig['Injected']
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
      >
        <Wallet className="w-5 h-5" />
        Connect Wallet
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
            />
            
            {/* Modal Container */}
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 300,
                  mass: 0.8
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto border border-gray-200/50"
              >
                {/* Header with gradient accent */}
                <div className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-b border-gray-200/60">
                  <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Connect Wallet</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Choose your preferred wallet to continue</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-gray-200/60 rounded-full transition-all duration-200 hover:rotate-90"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Wallet Grid */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
                  {connectors.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {connectors.map((connector, index) => {
                        const config = getWalletConfig(connector)
                        
                        return (
                          <motion.button
                            key={connector.uid}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleConnect(connector)}
                            className="group relative flex flex-col items-center justify-center p-6 bg-white rounded-2xl border-2 border-gray-200/60 hover:border-blue-400/60 hover:shadow-xl transition-all duration-300 overflow-hidden"
                          >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
                            
                            {/* Wallet Icon Container */}
                            <div className="relative w-16 h-16 mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300 shadow-sm group-hover:shadow-md">
                              <img 
                                src={config.icon}
                                alt={config.name}
                                className="w-12 h-12 object-contain z-10 relative"
                                onError={(e) => {
                                  // Fallback to colored circle with first letter
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg z-10 relative" style="background: linear-gradient(135deg, ${config.color || '#6366f1'} 0%, ${config.color || '#8b5cf6'} 100%)">
                                        ${config.name.charAt(0)}
                                      </div>
                                    `
                                  }
                                }}
                              />
                              {/* Shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/20 group-hover:to-transparent rounded-2xl transition-all duration-300" />
                            </div>
                            
                            {/* Wallet Name */}
                            <span className="text-sm font-semibold text-gray-700 text-center leading-tight group-hover:text-gray-900 transition-colors z-10 relative">
                              {config.name}
                            </span>
                            
                            {/* Hover border glow */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/40 transition-all duration-300 pointer-events-none" />
                            
                            {/* Bottom accent line on hover */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                          </motion.button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Wallet className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium mb-2">No wallets detected</p>
                      <p className="text-sm text-gray-500">
                        Please install a wallet extension like MetaMask to continue
                      </p>
                    </div>
                  )}
                  
                  {/* Footer Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200/60">
                    <div className="flex items-start gap-3 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                      <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 mb-1">New to Web3?</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Wallets are used to interact with blockchain applications. Download a wallet like MetaMask or Coinbase Wallet to get started.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  )
}
