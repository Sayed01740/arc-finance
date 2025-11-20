'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { motion } from 'framer-motion'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { Sparkles, Image, Loader2, Minus, Plus, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { logger } from '@/utils/debugLogger'

const ARC_TESTNET_CHAIN_ID = 5042002

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
  const chainId = useChainId()
  const [quantity, setQuantity] = useState(1)
  
  // Network validation
  const isCorrectNetwork = chainId === ARC_TESTNET_CHAIN_ID
  
  // Get user balance
  const { data: balance } = useBalance({
    address,
    query: {
      enabled: !!address && isConnected,
    },
  })

  const { data: mintPrice, isLoading: isLoadingPrice, error: priceError, refetch: refetchPrice } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'MINT_PRICE',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
      retry: 3,
      retryDelay: 1000,
      refetchInterval: 30000,
      staleTime: 60000,
      gcTime: 300000, // Keep in cache for 5 minutes
    },
  })

  // Debug price fetching with comprehensive logging
  useEffect(() => {
    if (isLoadingPrice) {
      logger.logPriceFetch('start', { contractAddress: NFT_CONTRACT_ADDRESS });
    } else if (priceError) {
      logger.logPriceFetch('error', { 
        error: {
          message: priceError.message,
          name: priceError.name,
          cause: priceError.cause,
          shortMessage: priceError.shortMessage,
        }
      });
    } else if (mintPrice) {
      logger.logPriceFetch('success', {
        price: mintPrice.toString(),
        formatted: formatEther(mintPrice),
      });
    }
  }, [mintPrice, priceError, isLoadingPrice])
  
  // Auto-retry price fetch on error
  useEffect(() => {
    if (priceError && !isLoadingPrice) {
      logger.warn('Price fetch failed, will retry automatically', {
        component: 'MintPage',
        action: 'priceFetchRetry',
        error: priceError,
      });
      // Auto-retry after 5 seconds
      const timer = setTimeout(() => {
        refetchPrice();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [priceError, isLoadingPrice, refetchPrice])

  const { data: totalSupply, error: totalSupplyError } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
      refetchInterval: 10000,
      retry: 3,
      staleTime: 30000,
    },
  })

  const { data: maxSupply, error: maxSupplyError } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'MAX_SUPPLY',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
      retry: 3,
      staleTime: 30000,
    },
  })

  const { data: maxMintPerTx, error: maxMintPerTxError } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'maxMintPerTx',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
      retry: 3,
      staleTime: 30000,
    },
  })

  const { data: mintingEnabled, refetch: refetchMintingStatus, isLoading: isLoadingMintingStatus, error: mintingStatusError } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'mintingEnabled',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
      refetchInterval: 10000,
      retry: 3,
      staleTime: 30000,
    },
  })

  // Debug all contract reads with comprehensive logging
  useEffect(() => {
    if (totalSupply !== undefined) {
      logger.logContractRead('totalSupply', 'success', { result: totalSupply.toString() });
    }
    if (totalSupplyError) {
      logger.logContractRead('totalSupply', 'error', { error: totalSupplyError });
    }
    if (maxSupply !== undefined) {
      logger.logContractRead('MAX_SUPPLY', 'success', { result: maxSupply.toString() });
    }
    if (maxSupplyError) {
      logger.logContractRead('MAX_SUPPLY', 'error', { error: maxSupplyError });
    }
    if (maxMintPerTx !== undefined) {
      logger.logContractRead('maxMintPerTx', 'success', { result: maxMintPerTx.toString() });
    }
    if (maxMintPerTxError) {
      logger.logContractRead('maxMintPerTx', 'error', { error: maxMintPerTxError });
    }
    if (mintingEnabled !== undefined) {
      logger.logContractRead('mintingEnabled', 'success', { result: mintingEnabled });
    }
    if (mintingStatusError) {
      logger.logContractRead('mintingEnabled', 'error', { error: mintingStatusError });
    }
  }, [totalSupply, maxSupply, maxMintPerTx, mintingEnabled, totalSupplyError, maxSupplyError, maxMintPerTxError, mintingStatusError])

  const isMintingEnabled = isLoadingMintingStatus ? true : (mintingEnabled !== false)

  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract({
    mutation: {
      onSuccess: (data) => {
        logger.logTransaction('confirm', { hash: data });
        toast.loading('Transaction sent! Waiting for confirmation...', { id: 'mint' })
      },
      onError: (error: any) => {
        logger.logTransaction('error', { 
          error: {
            name: error?.name,
            message: error?.message,
            cause: error?.cause,
            shortMessage: error?.shortMessage,
          }
        });
        
        let errorMessage = 'Transaction failed'
        
        if (error?.message) {
          if (error.message.includes('insufficient funds') || error.message.includes('balance')) {
            errorMessage = 'Insufficient USDC balance. Please add more USDC to your wallet.'
          } else if (error.message.includes('user rejected') || error.message.includes('User denied') || error.message.includes('rejected')) {
            errorMessage = 'Transaction cancelled by user'
          } else if (error.message.includes('network') || error.message.includes('connection')) {
            errorMessage = 'Network error. Please check your connection.'
          } else if (error.message.includes('execution reverted')) {
            errorMessage = 'Transaction reverted. Check contract requirements.'
          } else {
            errorMessage = error.message
          }
        } else if (error?.shortMessage) {
          errorMessage = error.shortMessage
        }
        
        toast.error(errorMessage, { id: 'mint', duration: 5000 })
      },
    },
  })
  
  const { isLoading: isConfirming, isSuccess, error: txError } = useWaitForTransactionReceipt({
    hash,
  })

  // Show transaction errors
  useEffect(() => {
    if (txError) {
      console.error('Transaction error:', txError)
      toast.error('Transaction failed. Please try again.', { id: 'mint' })
    }
  }, [txError])

  // Validate network
  useEffect(() => {
    if (isConnected && !isCorrectNetwork) {
      toast.error('Please switch to Arc Testnet (Chain ID: 5042002)', {
        duration: 5000,
        icon: '⚠️'
      })
    }
  }, [isConnected, isCorrectNetwork, chainId])

  const handleMint = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    if (!isCorrectNetwork) {
      toast.error('Please switch to Arc Testnet (Chain ID: 5042002)')
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

    // Always use fallback price if contract read fails - don't block minting
    if (!mintPrice && priceError) {
      logger.warn('Using fallback price due to contract read error', {
        component: 'MintPage',
        action: 'handleMint',
        error: priceError,
      });
      // Continue with fallback price - don't block
    }

    if (isLoadingPrice && !mintPrice) {
      toast.error('Loading mint price. Please wait...', { duration: 2000 })
      return
    }

    const effectivePrice = mintPrice ? BigInt(mintPrice.toString()) : FALLBACK_PRICE
    const totalCost = effectivePrice * BigInt(quantity)
    
    // Check balance
    if (balance && balance.value < totalCost) {
      const needed = formatEther(totalCost)
      const has = formatEther(balance.value)
      toast.error(`Insufficient balance. Need ${needed} USDC, but you have ${has} USDC`)
      return
    }

    try {
      logger.logTransaction('prepare', {
        quantity,
        totalCost: totalCost.toString(),
        totalCostFormatted: formatEther(totalCost),
        mintPrice: mintPrice ? mintPrice.toString() : 'Using fallback',
        effectivePrice: effectivePrice.toString(),
        balance: balance?.value.toString(),
        balanceFormatted: balance ? formatEther(balance.value) : 'N/A',
        contractAddress: NFT_CONTRACT_ADDRESS,
        isCorrectNetwork,
        chainId,
      });

      toast.loading('Preparing transaction...', { id: 'mint' })

      logger.logTransaction('send', { quantity, totalCost: totalCost.toString() });

      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [BigInt(quantity)],
        value: totalCost,
      })

      logger.info('writeContract called, waiting for user confirmation', {
        component: 'MintPage',
        action: 'writeContract',
        data: { quantity, totalCost: totalCost.toString() },
      });
    } catch (error: any) {
      logger.logTransaction('error', { error });
      toast.error(error.message || 'Failed to mint NFTs', { id: 'mint' })
    }
  }

  // Handle success with comprehensive logging
  useEffect(() => {
    if (isSuccess && hash) {
      logger.logTransaction('success', { hash });
      toast.success('NFTs minted successfully!', { id: 'mint', duration: 5000 })
      setQuantity(1)
    }
  }, [isSuccess, hash])

  // Log write errors
  useEffect(() => {
    if (writeError) {
      logger.error('Write error detected', {
        component: 'MintPage',
        action: 'writeContract',
        error: writeError,
      });
    }
  }, [writeError])

  // Log transaction receipt errors
  useEffect(() => {
    if (txError) {
      logger.error('Transaction receipt error', {
        component: 'MintPage',
        action: 'waitForTransactionReceipt',
        error: txError,
      });
    }
  }, [txError])

  // Fallback price if contract read fails (0.01 USDC = 0.01 ether)
  // This matches the contract's actual MINT_PRICE constant
  const FALLBACK_PRICE = parseEther('0.01')
  const effectivePrice = mintPrice ? BigInt(mintPrice.toString()) : FALLBACK_PRICE
  const totalCostWei = effectivePrice * BigInt(quantity)
  const totalCost = formatEther(totalCostWei)
  const pricePerNFT = formatEther(effectivePrice)
  
  // Log price status
  useEffect(() => {
    if (!mintPrice && priceError) {
      logger.info('Using fallback price (0.01 USDC) - contract read failed', {
        component: 'MintPage',
        action: 'priceDisplay',
        data: {
          error: priceError.message,
          usingFallback: true,
          fallbackPrice: '0.01 USDC',
        }
      });
    }
  }, [mintPrice, priceError])
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

          {/* Network Warning */}
          {isConnected && !isCorrectNetwork && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-2xl p-4 border-2 border-red-500/50 bg-red-500/20 mb-6"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-400 font-semibold mb-1">Wrong Network</p>
                  <p className="text-gray-300 text-sm">
                    Please switch to <strong>Arc Testnet</strong> (Chain ID: 5042002) to mint NFTs.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Balance Card */}
            {isConnected && balance && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-effect rounded-2xl p-6 border border-purple-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Your Balance</p>
                    <p className="text-2xl font-bold text-white">
                      {formatEther(balance.value)} <span className="text-lg text-purple-400">USDC</span>
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            )}

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
                {pricePerNFT} USDC
                {!mintPrice && isLoadingPrice && (
                  <span className="text-sm text-gray-400 ml-2">(Loading...)</span>
                )}
                {!mintPrice && !isLoadingPrice && priceError && (
                  <span className="text-sm text-yellow-400 ml-2" title={priceError.message}>⚠️ Using fallback</span>
                )}
                {mintPrice && (
                  <span className="text-sm text-green-400 ml-2">✓ Live</span>
                )}
              </div>
              {priceError && (
                <div className="text-xs text-yellow-400 mt-2">
                  Using fallback price (0.01 USDC) - Retrying...
                  <button 
                    onClick={() => refetchPrice()} 
                    className="ml-2 text-purple-400 hover:text-purple-300 underline"
                  >
                    Retry Now
                  </button>
                </div>
              )}
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
                  {totalCost || '0.01'} USDC
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-2 text-center">
                {quantity} × {pricePerNFT} USDC = {totalCost || '0.01'} USDC
              </div>
            </div>

            {/* Mint Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMint}
              disabled={isPending || isConfirming || !isCorrectNetwork || (!isMintingEnabled && !isLoadingMintingStatus) || (remaining !== undefined && remaining <= 0) || (balance && balance.value < BigInt(effectivePrice) * BigInt(quantity))}
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
