'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, usePublicClient } from 'wagmi'
import { formatEther, createPublicClient, http } from 'viem'
import { motion } from 'framer-motion'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { Settings, CheckCircle2, XCircle, Loader2, AlertCircle, Shield, TrendingUp, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

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
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
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
  {
    inputs: [{ name: '_enabled', type: 'bool' }],
    name: 'setMintingEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'MINT_PRICE',
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
] as const

export default function AdminPage() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const [contractOwner, setContractOwner] = useState<string | null>(null)
  const [isLoadingOwner, setIsLoadingOwner] = useState(true)
  const [ownerError, setOwnerError] = useState<Error | null>(null)
  const hasTriedFetch = useRef(false)

  // Direct fetch function - always use our own client
  const fetchOwner = useCallback(async () => {
    if (hasTriedFetch.current && contractOwner) {
      console.log('Owner already fetched, skipping...')
      return
    }
    
    try {
      setIsLoadingOwner(true)
      setOwnerError(null)
      console.log('=== FETCHING CONTRACT OWNER ===')
      console.log('Contract address:', NFT_CONTRACT_ADDRESS)
      
      // Always create our own client for reliability
      const rpcUrl = process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc.testnet.arc.network'
      console.log('Creating publicClient with RPC:', rpcUrl)
      
      const client = createPublicClient({
        transport: http(rpcUrl, { timeout: 30000 }),
      })
      
      console.log('Calling readContract...')
      const owner = await client.readContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'owner',
      })
      
      console.log('✅ Owner fetched successfully:', owner)
      setContractOwner(owner as string)
      hasTriedFetch.current = true
      setIsLoadingOwner(false)
    } catch (error: any) {
      console.error('❌ Owner fetch error:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        name: error.name,
      })
      setOwnerError(error)
      setIsLoadingOwner(false)
      toast.error(`Failed to fetch owner: ${error.message}`)
    }
  }, [contractOwner])

  // Fetch owner immediately on mount
  useEffect(() => {
    if (!hasTriedFetch.current) {
      console.log('Component mounted, fetching owner...')
      fetchOwner()
    }
  }, [fetchOwner])

  const { data: mintingEnabled, refetch: refetchMintingEnabled } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'mintingEnabled',
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

  const { data: mintPrice } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'MINT_PRICE',
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

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const isOwner = contractOwner && address && contractOwner.toLowerCase() === address.toLowerCase()

  const handleToggleMinting = (enabled: boolean) => {
    if (!isOwner) {
      toast.error('Only the contract owner can modify settings')
      return
    }

    writeContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: NFT_ABI,
      functionName: 'setMintingEnabled',
      args: [enabled],
    })

    toast.loading(enabled ? 'Enabling minting...' : 'Disabling minting...', { id: 'toggle-minting' })
  }

  if (isSuccess) {
    toast.success('Settings updated successfully!', { id: 'toggle-minting' })
    refetchMintingEnabled()
  }

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
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-8">Connect your wallet to access admin panel</p>
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
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white">Admin Panel</h1>
            </motion.div>
            <p className="text-xl text-gray-300">Manage your NFT contract settings</p>
          </div>

          {/* Loading Owner */}
          {isLoadingOwner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-3xl p-6 border border-blue-500/50 mb-8"
            >
              <div className="flex items-center gap-4">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                <div className="flex-1">
                  <h3 className="text-blue-400 font-bold text-lg mb-2">Loading Contract Owner...</h3>
                  <p className="text-gray-300 mb-3">
                    Please wait while we verify contract ownership.
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    Contract: <code className="bg-white/10 px-1 py-0.5 rounded">{NFT_CONTRACT_ADDRESS}</code>
                  </p>
                </div>
                <button
                  onClick={() => {
                    console.log('=== MANUAL REFRESH TRIGGERED ===')
                    hasTriedFetch.current = false
                    fetchOwner()
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 underline bg-blue-500/20 px-3 py-2 rounded font-semibold"
                >
                  🔄 Refresh
                </button>
              </div>
            </motion.div>
          )}

          {/* Owner Warning */}
          {!isLoadingOwner && !isOwner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-3xl p-6 border border-yellow-500/50 mb-8"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-yellow-400 font-bold text-lg mb-2">⚠️ Not Contract Owner</h3>
                  <p className="text-gray-300 mb-3">
                    You are not the contract owner. Only the owner can modify settings.
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">
                      <span className="font-semibold text-white">Contract Owner:</span>{' '}
                      {isLoadingOwner ? (
                        <code className="bg-white/10 px-2 py-1 rounded">Loading...</code>
                      ) : ownerError ? (
                        <div className="mt-2 space-y-2">
                          <code className="bg-red-500/20 px-2 py-1 rounded text-red-400 block">
                            Error: {ownerError.message || 'Failed to load owner'}
                          </code>
                          <button
                            onClick={() => {
                              console.log('Manual retry triggered')
                              hasTriedFetch.current = false
                              fetchOwner()
                            }}
                            className="text-xs text-purple-400 hover:text-purple-300 underline bg-purple-500/20 px-3 py-1 rounded"
                          >
                            🔄 Retry Now
                          </button>
                        </div>
                      ) : (
                        <code className="bg-white/10 px-2 py-1 rounded">{contractOwner || 'Unknown'}</code>
                      )}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-semibold text-white">Your Address:</span>{' '}
                      <code className="bg-white/10 px-2 py-1 rounded">{address}</code>
                    </p>
                    {contractOwner && address && (
                      <p className="text-gray-400 mt-2">
                        <span className="font-semibold text-white">Match:</span>{' '}
                        <span className={contractOwner.toLowerCase() === address.toLowerCase() ? 'text-green-400' : 'text-red-400'}>
                          {contractOwner.toLowerCase() === address.toLowerCase() ? '✅ Yes' : '❌ No'}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 border border-purple-500/20"
            >
              <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{totalSupply?.toString() || '0'}</div>
              <div className="text-sm text-gray-400">Total Supply</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 border border-purple-500/20"
            >
              <DollarSign className="w-8 h-8 text-green-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {mintPrice ? formatEther(mintPrice) : '0.01'}
              </div>
              <div className="text-sm text-gray-400">Mint Price</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 border border-purple-500/20"
            >
              <Shield className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{maxMintPerTx?.toString() || '10'}</div>
              <div className="text-sm text-gray-400">Max Per TX</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-effect rounded-2xl p-6 border border-purple-500/20"
            >
              {mintingEnabled ? (
                <CheckCircle2 className="w-8 h-8 text-green-400 mb-3" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400 mb-3" />
              )}
              <div className={`text-2xl font-bold mb-1 ${mintingEnabled ? 'text-green-400' : 'text-red-400'}`}>
                {mintingEnabled ? 'Enabled' : 'Disabled'}
              </div>
              <div className="text-sm text-gray-400">Minting Status</div>
            </motion.div>
          </div>

          {/* Main Admin Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-3xl p-8 border border-purple-500/30"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              Minting Control
            </h2>

            {isOwner ? (
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Current Status</h3>
                      <p className="text-gray-300">
                        Minting is currently{' '}
                        <span className={`font-bold ${mintingEnabled ? 'text-green-400' : 'text-red-400'}`}>
                          {mintingEnabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </p>
                    </div>
                    {mintingEnabled ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleToggleMinting(true)}
                      disabled={isPending || isConfirming || mintingEnabled === true}
                      className="py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isPending || isConfirming ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Enable Minting
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleToggleMinting(false)}
                      disabled={isPending || isConfirming || mintingEnabled === false}
                      className="py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isPending || isConfirming ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          Disable Minting
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-center"
                  >
                    <p className="text-green-400 font-semibold">✅ Settings updated successfully!</p>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                <p className="text-yellow-400 font-semibold text-center">
                  You need to be the contract owner to modify settings
                </p>
              </div>
            )}

            {/* Contract Info */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Contract Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Contract Address</span>
                  <code className="text-purple-400 font-mono">{NFT_CONTRACT_ADDRESS}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Supply</span>
                  <span className="text-white font-semibold">{maxSupply?.toString() || '10,000'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network</span>
                  <span className="text-white font-semibold">Arc Testnet</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
