'use client'

import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi, formatUnits, Address } from 'viem'
import { ALL_TOKENS } from '@/utils/tokens'

/**
 * Test component to directly check balances without hooks
 */
export function TestBalance() {
  const { address, isConnected, chainId } = useAccount()

  // Test direct balance fetch for TKA
  const tokenAAddress = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS as Address | undefined
  const { data: directBalance, error: directError } = useReadContract({
    address: tokenAAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!tokenAAddress && !!address && isConnected,
    },
  })

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-4">
      <h4 className="font-bold mb-2">🔍 Direct Balance Test</h4>
      <div className="text-sm space-y-1">
        <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
        <p>Address: {address || 'None'}</p>
        <p>Chain ID: {chainId} (Expected: {process.env.NEXT_PUBLIC_ARC_CHAIN_ID || '5042002'})</p>
        <p>Token A Address: {tokenAAddress || 'NOT SET'}</p>
        {directBalance !== undefined && (
          <p>Direct Balance: {formatUnits(directBalance, 18)}</p>
        )}
        {directError && (
          <p className="text-red-600">Error: {directError.message}</p>
        )}
        <p>All Tokens Count: {ALL_TOKENS.length}</p>
        {ALL_TOKENS.map(t => (
          <p key={t.address} className="text-xs">
            {t.symbol}: {t.address}
          </p>
        ))}
      </div>
    </div>
  )
}

