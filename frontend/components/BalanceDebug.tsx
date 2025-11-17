'use client'

import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi, formatUnits, Address } from 'viem'
import { ALL_TOKENS } from '@/utils/tokens'
import { useState, useEffect } from 'react'

export function BalanceDebug() {
  const { address, isConnected, chainId } = useAccount()
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const info: any = {
      isConnected,
      address,
      chainId,
      expectedChainId: parseInt(process.env.NEXT_PUBLIC_ARC_CHAIN_ID || '5042002'),
      envVars: {
        TOKEN_A: process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS,
        TOKEN_B: process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS,
        AMM: process.env.NEXT_PUBLIC_AMM_ADDRESS,
        RPC: process.env.NEXT_PUBLIC_ARC_RPC_URL,
      },
      tokens: ALL_TOKENS.map(t => ({
        symbol: t.symbol,
        address: t.address,
        decimals: t.decimals,
      })),
    }
    setDebugInfo(info)
  }, [isConnected, address, chainId])

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">🐛 Debug Info</h3>
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}

