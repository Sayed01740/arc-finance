'use client'

import { useAccount } from 'wagmi'
import { useTokenBalances } from '@/hooks/useTokenBalance'
import { ALL_TOKENS } from '@/utils/tokens'
import { useState } from 'react'

export function DebugPanel() {
  const { address, isConnected, chain } = useAccount()
  const { balances, isLoading, errors } = useTokenBalances(ALL_TOKENS, address)
  const [show, setShow] = useState(false)

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-50"
      >
        🐛 Debug
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-md max-h-96 overflow-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">🐛 Debug Panel</h3>
        <button onClick={() => setShow(false)} className="text-white hover:text-gray-400">
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <strong>Wallet:</strong>
          <div className="ml-2 text-gray-300">
            <div>Connected: {isConnected ? '✅' : '❌'}</div>
            <div>Address: {address || 'Not connected'}</div>
            <div>Chain: {chain?.name || 'Unknown'} (ID: {chain?.id || 'N/A'})</div>
          </div>
        </div>

        <div>
          <strong>Environment Variables:</strong>
          <div className="ml-2 text-gray-300">
            <div>
              TOKEN_A: {process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS || '❌ MISSING'}
            </div>
            <div>
              TOKEN_B: {process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS || '❌ MISSING'}
            </div>
            <div>
              AMM: {process.env.NEXT_PUBLIC_AMM_ADDRESS || '❌ MISSING'}
            </div>
            <div>
              RPC: {process.env.NEXT_PUBLIC_ARC_RPC_URL ? '✅ Set' : '❌ MISSING'}
            </div>
            <div>
              Chain ID: {process.env.NEXT_PUBLIC_ARC_CHAIN_ID || '❌ MISSING'}
            </div>
          </div>
        </div>

        <div>
          <strong>Token Balances:</strong>
          <div className="ml-2 text-gray-300">
            {ALL_TOKENS.map((token) => {
              const balance = balances[token.address.toLowerCase()] || '0'
              return (
                <div key={token.address}>
                  {token.symbol}: {parseFloat(balance) > 0 ? balance : '0.0000'}
                </div>
              )
            })}
            {isLoading && <div className="text-yellow-400">Loading...</div>}
          </div>
        </div>

        {errors.length > 0 && (
          <div>
            <strong>Errors:</strong>
            <div className="ml-2 text-red-400">
              {errors.map((error, i) => (
                <div key={i}>{error?.message || String(error)}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

