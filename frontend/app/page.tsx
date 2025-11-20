'use client'

import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { ArrowRight, Sparkles, Image, Users, Zap, Shield, Globe, TrendingUp } from 'lucide-react'

export default function Home() {
  const { isConnected } = useAccount()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-20"
        >
          {/* Logo/Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-8 animate-float"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-white">Arc Network • Testnet</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight"
          >
            <span className="gradient-text block mb-2">Arc NFT</span>
            <span className="text-white block">Collection</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Create, mint, and own unique digital art on the Arc blockchain.
            <br />
            <span className="text-purple-400 font-semibold">Powered by Web3 technology.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            {!isConnected ? (
              <>
                <WalletConnectButton />
                <p className="text-gray-400 text-sm sm:ml-4">Connect your wallet to get started</p>
              </>
            ) : (
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <Link href="/mint">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-lg font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Start Minting
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </Link>
                <Link href="/create">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 glass-effect text-white rounded-2xl text-lg font-bold border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      Create NFT
                    </span>
                  </motion.button>
                </Link>
                <Link href="/collection">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-lg font-semibold border border-white/20 transition-all duration-300"
                  >
                    My Collection
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20"
          >
            {[
              { label: 'Total Supply', value: '10,000', icon: TrendingUp },
              { label: 'Mint Price', value: '0.01 USDC', icon: Zap },
              { label: 'Network', value: 'Arc Testnet', icon: Globe },
              { label: 'Security', value: 'Verified', icon: Shield },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-effect rounded-2xl p-6 text-center border border-purple-500/20 hover:border-purple-400/50 transition-all"
              >
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {[
            {
              icon: Image,
              title: 'Unique Digital Art',
              description: 'Each NFT is a one-of-a-kind piece of digital art with verified ownership on the blockchain. Own your favorite pieces forever.',
              color: 'from-yellow-400 to-orange-500'
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Mint NFTs in seconds with our optimized smart contracts. Low gas fees and instant transactions on Arc Network.',
              color: 'from-pink-400 to-rose-500'
            },
            {
              icon: Users,
              title: 'Growing Community',
              description: 'Join thousands of collectors and creators building the future of digital ownership together.',
              color: 'from-blue-400 to-cyan-500'
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -10 }}
              className="group relative glass-effect rounded-3xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative z-10">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto border border-purple-500/30">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your NFT Journey?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Connect your wallet and start minting unique NFTs today
            </p>
            {!isConnected && (
              <WalletConnectButton />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
