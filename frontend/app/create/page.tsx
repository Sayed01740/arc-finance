'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId, useBalance } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { motion } from 'framer-motion'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { Upload, Image as ImageIcon, Loader2, Sparkles, X, FileText, CheckCircle2, AlertCircle, Eye, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { logger } from '@/utils/debugLogger'

const ARC_TESTNET_CHAIN_ID = 5042002

// Get contract address from env or use fallback
const getContractAddress = (): `0x${string}` => {
  const envAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
  const fallback = '0x610F67164aEDF56a2BE9067CbDF5f85BFFb335d3' as `0x${string}`
  
  // Validate env address - must be valid hex and not zero address
  if (envAddress && 
      envAddress !== '0x0000000000000000000000000000000000000000' && 
      envAddress.startsWith('0x') && 
      envAddress.length === 42) {
    return envAddress as `0x${string}`
  }
  
  // Use fallback if env is invalid or missing
  console.warn('⚠️ Using fallback contract address. Set NEXT_PUBLIC_NFT_CONTRACT_ADDRESS in Vercel environment variables.')
  return fallback
}

const NFT_CONTRACT_ADDRESS = getContractAddress()

const NFT_ABI = [
  {
    inputs: [{ name: 'tokenURI_', type: 'string' }],
    name: 'mintWithURI',
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
    name: 'mintingEnabled',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

interface Attribute {
  trait_type: string
  value: string
}

export default function CreatePage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [attributes, setAttributes] = useState<Attribute[]>([
    { trait_type: '', value: '' }
  ])
  const [externalUrl, setExternalUrl] = useState('')
  
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
  
  // Auto-retry price fetch on error
  useEffect(() => {
    if (priceError && !isLoadingPrice) {
      logger.warn('Price fetch failed, will retry automatically', {
        component: 'CreatePage',
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

  // Debug price fetching
  useEffect(() => {
    console.log('🔍 Price fetch status:', {
      isLoadingPrice,
      hasPrice: !!mintPrice,
      price: mintPrice ? formatEther(mintPrice) : 'N/A',
      error: priceError?.message,
      contractAddress: NFT_CONTRACT_ADDRESS,
      isCorrectNetwork,
      chainId,
    })
    
    if (priceError) {
      console.error('❌ Error fetching mint price:', priceError)
      console.error('Error details:', {
        name: priceError?.name,
        message: priceError?.message,
        cause: priceError?.cause,
        shortMessage: priceError?.shortMessage,
      })
    }
    if (mintPrice) {
      console.log('✅ Mint price fetched:', mintPrice.toString(), 'wei =', formatEther(mintPrice), 'USDC')
    }
  }, [mintPrice, priceError, isLoadingPrice, isCorrectNetwork, chainId])

  const { data: totalSupply, error: totalSupplyError } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
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

  // Log contract reads
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
  }, [totalSupply, maxSupply, totalSupplyError, maxSupplyError])

  const { data: mintingEnabled, refetch: refetchMintingStatus, isLoading: isLoadingMintingStatus } = useReadContract({
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

  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract({
    mutation: {
      onSuccess: (data) => {
        logger.logTransaction('confirm', { hash: data });
        toast.loading('Transaction sent! Waiting for confirmation...', { id: 'create' })
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
        
        toast.error(errorMessage, { id: 'create', duration: 5000 })
      },
    },
  })
  
  const { isLoading: isConfirming, isSuccess, error: txError } = useWaitForTransactionReceipt({
    hash,
  })

  // Show transaction errors with comprehensive logging
  useEffect(() => {
    if (txError) {
      logger.error('Transaction receipt error', {
        component: 'CreatePage',
        action: 'waitForTransactionReceipt',
        error: txError,
      });
      toast.error('Transaction failed. Please try again.', { id: 'create' })
    }
  }, [txError])

  // Validate network on mount and when chain changes
  useEffect(() => {
    if (isConnected && !isCorrectNetwork) {
      toast.error('Please switch to Arc Testnet (Chain ID: 5042002)', {
        duration: 5000,
        icon: '⚠️'
      })
    }
  }, [isConnected, isCorrectNetwork, chainId])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }])
  }

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    const updated = [...attributes]
    updated[index] = { ...updated[index], [field]: value }
    setAttributes(updated)
  }

  const validAttributes = attributes.filter(attr => attr.trait_type.trim() && attr.value.trim())

  const removeImage = () => {
    setImage(null)
    setImageFile(null)
    setImageUrl('')
  }

  const uploadToIPFS = async (): Promise<string> => {
    try {
      logger.logMetadata('start', {
        name: name,
        hasImage: !!(image || imageUrl),
        attributesCount: validAttributes.length,
      });

      // Validate required fields
      if (!name.trim()) {
        throw new Error('NFT name is required');
      }

      // Create comprehensive metadata following OpenSea standard
      const metadata: any = {
        name: name.trim(),
        description: description.trim() || 'A unique NFT created on Arc Testnet',
        image: image || imageUrl || 'https://via.placeholder.com/500',
      };

      // Add optional fields
      if (externalUrl && externalUrl.trim()) {
        metadata.external_url = externalUrl.trim();
      }

      if (validAttributes.length > 0) {
        metadata.attributes = validAttributes.map(attr => ({
          trait_type: attr.trait_type.trim(),
          value: attr.value.trim()
        }));
      }

      // Create data URI with proper encoding
      const jsonString = JSON.stringify(metadata, null, 2);
      const base64 = btoa(unescape(encodeURIComponent(jsonString)));
      const dataURI = `data:application/json;base64,${base64}`;

      logger.logMetadata('success', {
        uriLength: dataURI.length,
        metadataSize: jsonString.length,
      });

      return dataURI;
    } catch (error: any) {
      logger.logMetadata('error', { error });
      throw error;
    }
  }

  const handleCreateNFT = async () => {
    // Validate contract address first
    if (!NFT_CONTRACT_ADDRESS || NFT_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      toast.error('Contract address not configured. Please set NEXT_PUBLIC_NFT_CONTRACT_ADDRESS in environment variables.', { duration: 8000 })
      logger.error('Invalid contract address', {
        component: 'CreatePage',
        action: 'handleCreateNFT',
        data: { contractAddress: NFT_CONTRACT_ADDRESS },
      });
      return
    }

    // Validation checks
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

    if (!name.trim()) {
      toast.error('Please enter a name for your NFT')
      return
    }

    if (!image && !imageUrl) {
      toast.error('Please upload an image or provide an image URL')
      return
    }

    if (maxSupply && totalSupply && Number(totalSupply) >= Number(maxSupply)) {
      toast.error('Maximum supply reached')
      return
    }

    // Always use fallback price if contract read fails - don't block minting
    if (!mintPrice && priceError) {
      logger.warn('Using fallback price due to contract read error', {
        component: 'CreatePage',
        action: 'handleCreateNFT',
        error: priceError,
      });
      // Continue with fallback price - don't block
    }

    if (isLoadingPrice && !mintPrice) {
      toast.error('Loading mint price. Please wait...', { duration: 2000 })
      return
    }

    const effectivePrice = mintPrice ? BigInt(mintPrice.toString()) : FALLBACK_PRICE
    const mintCost = effectivePrice
    
    // Check balance
    if (balance && balance.value < mintCost) {
      const needed = formatEther(mintCost)
      const has = formatEther(balance.value)
      toast.error(`Insufficient balance. Need ${needed} USDC, but you have ${has} USDC`)
      return
    }

    try {
      toast.loading('Preparing your NFT metadata...', { id: 'create' })
      
      const tokenURI = await uploadToIPFS()
      
      if (!tokenURI || tokenURI.length === 0) {
        throw new Error('Failed to create metadata URI');
      }

      logger.logTransaction('prepare', {
        tokenURI: tokenURI.substring(0, 100) + '...',
        tokenURILength: tokenURI.length,
        mintCost: mintCost.toString(),
        mintCostFormatted: formatEther(mintCost),
        balance: balance?.value.toString(),
        balanceFormatted: balance ? formatEther(balance.value) : 'N/A',
        contractAddress: NFT_CONTRACT_ADDRESS,
        isCorrectNetwork,
        chainId,
        name,
        hasImage: !!(image || imageUrl),
        attributesCount: validAttributes.length,
      });

      toast.loading('Preparing transaction...', { id: 'create' })

      logger.logTransaction('send', { 
        functionName: 'mintWithURI',
        mintCost: mintCost.toString(),
      });

      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'mintWithURI',
        args: [tokenURI],
        value: mintCost,
      })

      logger.info('writeContract called, waiting for user confirmation', {
        component: 'CreatePage',
        action: 'writeContract',
        data: { tokenURILength: tokenURI.length, mintCost: mintCost.toString() },
      });
    } catch (error: any) {
      logger.logTransaction('error', { error });
      toast.error(error.message || 'Failed to create NFT', { id: 'create' })
    }
  }

  // Handle success with comprehensive logging
  useEffect(() => {
    if (isSuccess && hash) {
      logger.logTransaction('success', { hash });
      toast.success('NFT created successfully!', { id: 'create', duration: 5000 })
      // Reset the form
      setName('')
      setDescription('')
      setImage(null)
      setImageFile(null)
      setImageUrl('')
      setAttributes([{ trait_type: '', value: '' }])
      setExternalUrl('')
    }
  }, [isSuccess, hash])

  // Log write errors
  useEffect(() => {
    if (writeError) {
      logger.error('Write error detected', {
        component: 'CreatePage',
        action: 'writeContract',
        error: writeError,
      });
    }
  }, [writeError])

  // Calculate remaining - default to maxSupply if totalSupply is 0 or undefined
  const remaining = maxSupply 
    ? (totalSupply !== undefined ? Number(maxSupply) - Number(totalSupply) : Number(maxSupply))
    : 10000 // Default to 10,000 if maxSupply not loaded yet
  // Fallback price if contract read fails (0.01 USDC = 0.01 ether)
  // This matches the contract's actual MINT_PRICE constant
  const FALLBACK_PRICE = parseEther('0.01')
  const effectivePrice = mintPrice ? BigInt(mintPrice.toString()) : FALLBACK_PRICE
  const price = formatEther(effectivePrice)
  
  // Log price status
  useEffect(() => {
    if (!mintPrice && priceError) {
      logger.info('Using fallback price (0.01 USDC) - contract read failed', {
        component: 'CreatePage',
        action: 'priceDisplay',
        data: {
          error: priceError.message,
          usingFallback: true,
          fallbackPrice: '0.01 USDC',
        }
      });
    }
  }, [mintPrice, priceError])

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
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-8">Connect your wallet to create your own NFT</p>
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
          className="max-w-5xl mx-auto"
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
              <h1 className="text-5xl md:text-6xl font-black text-white">Create Your NFT</h1>
            </motion.div>
            <p className="text-xl text-gray-300">Design and mint your own unique NFT on Arc Testnet</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Image Upload */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Upload Card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="glass-effect rounded-3xl p-8 border border-purple-500/30"
              >
                <label className="block text-white font-semibold mb-4 text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  NFT Image
                </label>
                
                {image ? (
                  <div className="relative group">
                    <img src={image} alt="Preview" className="w-full rounded-2xl shadow-2xl" />
                    <button
                      onClick={removeImage}
                      className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-purple-500/50 rounded-2xl cursor-pointer bg-gradient-to-br from-purple-900/20 to-pink-900/20 hover:from-purple-900/30 hover:to-pink-900/30 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-10 h-10 text-white" />
                        </div>
                        <p className="mb-2 text-sm text-gray-300">
                          <span className="font-semibold text-white">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    
                    <div className="text-center text-gray-400 text-sm font-medium">OR</div>
                    
                    <input
                      type="text"
                      placeholder="Enter image URL (e.g., https://example.com/image.png)"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-white/5 border-2 border-purple-500/50 rounded-xl px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 transition-all"
                    />
                    
                    {imageUrl && (
                      <div className="mt-4">
                        <img 
                          src={imageUrl} 
                          alt="Preview" 
                          className="w-full rounded-2xl shadow-2xl" 
                          onError={() => toast.error('Invalid image URL')} 
                        />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Details Card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="glass-effect rounded-3xl p-8 border border-purple-500/30"
              >
                <label className="block text-white font-semibold mb-4 text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  NFT Details
                </label>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter NFT name"
                      className="w-full bg-white/5 border-2 border-purple-500/50 rounded-xl px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your NFT..."
                      rows={4}
                      className="w-full bg-white/5 border-2 border-purple-500/50 rounded-xl px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">External URL (Optional)</label>
                    <input
                      type="url"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-white/5 border-2 border-purple-500/50 rounded-xl px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1">Link to your website or project</p>
                  </div>
                </div>
              </motion.div>

              {/* Attributes Card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="glass-effect rounded-3xl p-8 border border-purple-500/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-white font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Attributes / Traits
                  </label>
                  <button
                    onClick={addAttribute}
                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
                    title="Add attribute"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={attr.trait_type}
                        onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                        placeholder="Trait (e.g., Color, Rarity)"
                        className="flex-1 bg-white/5 border-2 border-purple-500/50 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 transition-all text-sm"
                      />
                      <input
                        type="text"
                        value={attr.value}
                        onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                        placeholder="Value (e.g., Blue, Legendary)"
                        className="flex-1 bg-white/5 border-2 border-purple-500/50 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 transition-all text-sm"
                      />
                      {attributes.length > 1 && (
                        <button
                          onClick={() => removeAttribute(index)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                          title="Remove attribute"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {validAttributes.length === 0 && (
                    <p className="text-xs text-gray-400 italic">Add traits to make your NFT more unique (optional)</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Preview & Summary & Mint */}
            <div className="space-y-6">
              {/* Network Warning */}
              {isConnected && !isCorrectNetwork && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect rounded-2xl p-4 border-2 border-red-500/50 bg-red-500/20"
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

              {/* Real-time Preview Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-effect rounded-3xl p-6 border border-purple-500/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Live Preview
                  </h3>
                </div>
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-4 border border-purple-500/20">
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-purple-800/20 to-pink-800/20">
                    {image || imageUrl ? (
                      <img 
                        src={image || imageUrl} 
                        alt="NFT Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-lg truncate">
                      {name || 'Your NFT Name'}
                    </h4>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {description || 'Your NFT description will appear here...'}
                    </p>
                    {validAttributes.length > 0 && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-gray-400 mb-2">Attributes:</p>
                        <div className="flex flex-wrap gap-2">
                          {validAttributes.map((attr, idx) => (
                            <div key={idx} className="bg-purple-500/20 border border-purple-400/30 rounded-lg px-2 py-1">
                              <span className="text-xs text-purple-300 font-medium">{attr.trait_type}: </span>
                              <span className="text-xs text-white">{attr.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Summary Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-effect rounded-3xl p-6 border border-purple-500/30"
              >
                <h3 className="text-white font-bold text-lg mb-4">Summary</h3>
                <div className="space-y-3">
                  {isConnected && balance && (
                    <div className="mb-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-xs text-gray-400 mb-1">Your Balance</div>
                      <div className="text-lg font-bold text-white">
                        {formatEther(balance.value)} <span className="text-sm text-purple-400">USDC</span>
                      </div>
                      {balance.value < BigInt(effectivePrice) && (
                        <div className="text-xs text-red-400 mt-1">
                          ⚠️ Insufficient balance
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>Price</span>
                    <span className="text-white font-semibold">
                      {price || '0.01'} USDC
                      {!mintPrice && !isLoadingPrice && (
                        <span className="text-xs text-yellow-400 ml-2">(Fallback)</span>
                      )}
                      {mintPrice && (
                        <span className="text-xs text-green-400 ml-2">✓</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Remaining</span>
                    <span className="text-green-400 font-semibold">{remaining.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex justify-between text-lg">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-purple-400 font-bold">{price || '0.01'} USDC</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mint Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateNFT}
                disabled={isPending || isConfirming || !isMintingEnabled || !isCorrectNetwork || (remaining !== undefined && remaining <= 0) || !name.trim() || (!image && !imageUrl) || (balance && balance.value < BigInt(effectivePrice))}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-xl font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {isConfirming ? 'Confirming...' : 'Creating...'}
                  </>
                ) : !isCorrectNetwork ? (
                  'Switch to Arc Testnet'
                ) : !isMintingEnabled && mintingEnabled === false ? (
                  'Minting Disabled'
                ) : (remaining !== undefined && remaining <= 0) ? (
                  'Sold Out'
                ) : (!image && !imageUrl) ? (
                  'Upload Image First'
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Create NFT
                  </>
                )}
              </motion.button>

              {/* Status Messages */}
              {isMintingEnabled && !isLoadingMintingStatus && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-semibold mb-1">✅ Minting Enabled</p>
                    <p className="text-gray-300 text-sm">
                      You can create custom NFTs. Make sure you have enough USDC for fees.
                    </p>
                  </div>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-center"
                >
                  <p className="text-green-400 font-semibold mb-2">
                    ✅ Your NFT has been created successfully!
                  </p>
                  <Link href="/collection" className="text-green-300 hover:text-green-200 underline text-sm">
                    View in Collection
                  </Link>
                </motion.div>
              )}

              {/* Info Card */}
              <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Note:</strong> For production use, implement IPFS upload for decentralized metadata storage.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
