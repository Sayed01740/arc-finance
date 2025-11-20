'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { motion } from 'framer-motion'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { Sparkles, Image, Loader2, Minus, Plus, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const NFT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`) || '0x610F67164aEDF56a2BE9067CbDF5f85BFFb335d3' as `0x${string}`

const NFT_ABI = [
  {
    inputs: [{ name: 'quantity', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MINT_PRICE',
    outputs: [{ name: '', type: 'uint256' }],
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
  {
    inputs: [],
    name: 'MAX_SUPPLY',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxMintPerTx',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintingEnabled',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export default function MintPage() {
  const { address, isConnected } = useAccount()
  const [quantity, setQuantity] = useState(1)

  const { data: mintPrice } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'MINT_PRICE',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  })

  const { data: totalSupply } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
      refetchInterval: 5000,
    },
  })

  const { data: maxSupply } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'MAX_SUPPLY',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  })

  const { data: maxMintPerTx } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'maxMintPerTx',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    },
  })

  const { data: mintingEnabled, refetch: refetchMintingStatus, isLoading: isLoadingMintingStatus, error: mintingStatusError } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'mintingEnabled',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
      refetchInterval: 5000,
      retry: 3,
    },
  })

  const isMintingEnabled = isLoadingMintingStatus ? true : (mintingEnabled !== false)

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleMint = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    if (!isMintingEnabled) {
      toast.error('Minting is currently disabled')
      return
    }

    if (quantity < 1 || (maxMintPerTx && quantity > Number(maxMintPerTx))) {
      toast.error(`Quantity must be between 1 and ${maxMintPerTx || 10}`)
      return
    }

    if (!mintPrice) {
      toast.error('Unable to fetch mint price')
      return
    }

    const totalCost = BigInt(mintPrice) * BigInt(quantity)

    writeContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: NFT_ABI,
      functionName: 'mint',
      args: [BigInt(quantity)],
      value: totalCost,
    })

    toast.loading('Minting your NFTs...', { id: 'mint' })
  }

  if (isSuccess) {
    toast.success('NFTs minted successfully!', { id: 'mint' })
  }

  const totalCost = mintPrice ? formatEther(BigInt(mintPrice) * BigInt(quantity)) : '0'
  // Calculate remaining - default to maxSupply if totalSupply is 0 or undefined
  const remaining = maxSupply 
    ? (totalSupply !== undefined ? Number(maxSupply) - Number(totalSupply) : Number(maxSupply))
    : 10000 // Default to 10,000 if maxSupply not loaded yet
  const progress = maxSupply && totalSupply ? (Number(totalSupply) / Number(maxSupply)) * 100 : 0

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
              <Image className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-8">Connect your wallet to start minting unique NFTs</p>
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
          className="max-w-4xl mx-auto"
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
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white">Mint Your NFT</h1>
            </motion.div>
            <p className="text-xl text-gray-300">Own a piece of digital art on Arc Testnet</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Supply Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 border border-purple-500/20"
            >
              <div className="text-sm text-gray-400 mb-2">Total Supply</div>
              <div className="text-3xl font-bold text-white mb-2">
                {totalSupply?.toString() || '0'} / {maxSupply?.toString() || '10,000'}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                />
              </div>
            </motion.div>

            {/* Remaining Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 border border-purple-500/20"
            >
              <div className="text-sm text-gray-400 mb-2">Remaining</div>
              <div className="text-3xl font-bold text-green-400">{remaining.toLocaleString()}</div>
            </motion.div>

            {/* Price Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 border border-purple-500/20"
            >
              <div className="text-sm text-gray-400 mb-2">Price per NFT</div>
              <div className="text-3xl font-bold text-yellow-400">
                {mintPrice ? formatEther(mintPrice) : '0.01'} USDC
              </div>
            </motion.div>
          </div>

          {/* Main Mint Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-3xl p-8 border border-purple-500/30"
          >
            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-4 text-lg">Quantity</label>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                >
                  <Minus className="w-6 h-6" />
                </motion.button>
                <div className="flex-1">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1
                      const max = maxMintPerTx ? Number(maxMintPerTx) : 10
                      setQuantity(Math.min(Math.max(1, val), max))
                    }}
                    min={1}
                    max={maxMintPerTx ? Number(maxMintPerTx) : 10}
                    className="w-full bg-white/5 border-2 border-purple-500/50 rounded-xl px-6 py-4 text-white text-center text-3xl font-bold focus:outline-none focus:border-purple-400"
                  />
                  <p className="text-center text-gray-400 text-sm mt-2">
                    Max {maxMintPerTx?.toString() || '10'} per transaction
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const max = maxMintPerTx ? Number(maxMintPerTx) : 10
                    setQuantity(Math.min(quantity + 1, max))
                  }}
                  disabled={quantity >= (maxMintPerTx ? Number(maxMintPerTx) : 10)}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                >
                  <Plus className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Total Cost */}
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg">Total Cost</span>
                <span className="text-3xl font-bold text-white">
                  {totalCost} USDC
                </span>
              </div>
            </div>

            {/* Mint Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMint}
              disabled={isPending || isConfirming || (!isMintingEnabled && !isLoadingMintingStatus) || (remaining !== undefined && remaining <= 0)}
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-xl font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {isConfirming ? 'Confirming...' : 'Minting...'}
                </>
              ) : isLoadingMintingStatus ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Checking Status...
                </>
                ) : !isMintingEnabled && mintingEnabled === false ? (
                  <>
                    <AlertCircle className="w-6 h-6" />
                    Minting Disabled
                  </>
                ) : (remaining !== undefined && remaining <= 0) ? (
                  'Sold Out'
                ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Mint {quantity} NFT{quantity > 1 ? 's' : ''}
                </>
              )}
            </motion.button>

            {/* Status Messages */}
            {(isMintingEnabled || isLoadingMintingStatus) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-400 font-semibold mb-1">✅ Minting is Enabled!</p>
                  <p className="text-gray-300 text-sm">
                    You can mint NFTs. Make sure you have enough USDC for gas fees and minting costs.
                  </p>
                </div>
              </motion.div>
            )}

            {!isMintingEnabled && !isLoadingMintingStatus && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl"
              >
                <p className="text-yellow-400 font-semibold mb-2">⚠️ Minting is Currently Disabled</p>
                <p className="text-gray-300 text-sm mb-3">
                  The contract owner has disabled minting. Please check back later.
                </p>
                <button
                  onClick={() => refetchMintingStatus()}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Refresh Status
                </button>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-center"
              >
                <p className="text-green-400 font-semibold text-lg">
                  ✅ Successfully minted {quantity} NFT{quantity > 1 ? 's' : ''}!
                </p>
                <Link href="/collection" className="text-green-300 hover:text-green-200 underline text-sm mt-2 inline-block">
                  View in Collection
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
