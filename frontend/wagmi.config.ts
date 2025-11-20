import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'
import { metaMask, injected, coinbaseWallet } from 'wagmi/connectors'

export const arcTestnet = defineChain({
  id: parseInt(process.env.NEXT_PUBLIC_ARC_CHAIN_ID || '5042002'),
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arcscan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
})

export const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'Arc NFT Mint',
      appLogoUrl: 'https://arc-nft.vercel.app/logo.png',
    }),
    // Generic injected wallet - will detect any installed wallet
    injected(),
  ],
  transports: {
    [arcTestnet.id]: http(process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc.testnet.arc.network'),
  },
})
