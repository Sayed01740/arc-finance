'use client'

import { http, createConfig } from 'wagmi'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { defineChain } from 'viem'

// Define Arc testnet chain
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
    injected({
      target: 'metaMask',
    }),
    injected({
      target() {
        return {
          id: 'injected',
          name: 'Injected Wallet',
          provider: typeof window !== 'undefined' ? window.ethereum : undefined,
        }
      },
    }),
    coinbaseWallet({
      appName: 'Arc Finance',
      appLogoUrl: 'https://arc-finance.vercel.app/logo.png',
    }),
  ],
  transports: {
    [arcTestnet.id]: http(),
  },
})
