'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { motion } from 'framer-motion'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { Image, Loader2, Package, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const NFT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`) || '0x610F67164aEDF56a2BE9067CbDF5f85BFFb335d3' as `0x${string}`

const NFT_ABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export default function CollectionPage() {
  const { address, isConnected } = useAccount()
  const [userTokens, setUserTokens] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  const { data: totalSupply } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  })

  useEffect(() => {
    if (!isConnected || !address || !totalSupply) {
      setLoading(false)
      return
    }

    const fetchUserTokens = async () => {
      setLoading(true)
      const tokens: number[] = []
      const total = Number(totalSupply)

      for (let i = 1; i <= total; i++) {
        try {
          // In a real implementation, you'd check ownership here
          // For now, we'll show all tokens (you can filter by owner later)
          tokens.push(i)
        } catch (error) {
          console.error(`Error checking token ${i}:`, error)
        }
      }

      setUserTokens(tokens)
      setLoading(false)
    }

    fetchUserTokens()
  }, [isConnected, address, totalSupply])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="glass-effect rounded-3xl p-12 border border-purple-500/30">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-8">View your NFT collection</p>
            <WalletConnectButton />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white">My Collection</h1>
            </motion.div>
            <p className="text-xl text-gray-300">Your NFT collection on Arc Testnet</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 border border-purple-500/20 text-center"
            >
              <div className="text-3xl font-bold text-white mb-2">{userTokens.length}</div>
              <div className="text-gray-400">Total NFTs</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 border border-purple-500/20 text-center"
            >
              <div className="text-3xl font-bold text-white mb-2">{totalSupply?.toString() || '0'}</div>
              <div className="text-gray-400">Total Minted</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 border border-purple-500/20 text-center"
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">Arc</div>
              <div className="text-gray-400">Network</div>
            </motion.div>
          </div>

          {/* NFT Grid */}
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-300">Loading your collection...</p>
            </div>
          ) : userTokens.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-effect rounded-3xl p-12 border border-purple-500/30 text-center"
            >
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No NFTs Yet</h3>
              <p className="text-gray-400 mb-6">Start building your collection by minting your first NFT</p>
              <Link href="/mint">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Start Minting
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userTokens.map((tokenId, index) => (
                <motion.div
                  key={tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group glass-effect rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-400/50 transition-all"
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center relative overflow-hidden">
                    <Image className="w-16 h-16 text-purple-400/50" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition-all" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold">#{tokenId}</span>
                      <a
                        href={`https://testnet.arcscan.app/address/${NFT_CONTRACT_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-gray-400 text-sm">Arc NFT Collection</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
