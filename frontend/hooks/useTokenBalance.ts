'use client'

import { useAccount, useReadContract } from 'wagmi'
import { formatUnits, erc20Abi, Address } from 'viem'
import { Token } from '@/utils/tokens'
import { useState, useEffect } from 'react'

/**
 * Hook to fetch token balance for any token address
 * Handles decimals properly and provides formatted balance
 */
export function useTokenBalance(token: Token | null, address?: Address) {
  const { address: accountAddress } = useAccount()
  const userAddress = address || accountAddress

  const { data: balance, error, isLoading, refetch } = useReadContract({
    address: token?.address as Address | undefined,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!token?.address && !!userAddress && token.address !== '0x0000000000000000000000000000000000000000',
      refetchInterval: 10000, // Refetch every 10 seconds
      retry: 3,
    },
  })

  // Format balance using token decimals
  const formattedBalance = balance && token
    ? formatUnits(balance, token.decimals)
    : '0'

  return {
    balance,
    formattedBalance,
    error,
    isLoading,
    refetch,
  }
}

/**
 * Hook to fetch balances for multiple tokens at once
 * Note: This hook conditionally calls useReadContract, which violates React hooks rules
 * For better performance, use useTokenBalance for individual tokens
 */
export function useTokenBalances(tokens: Token[], address?: Address) {
  const { address: accountAddress } = useAccount()
  const userAddress = address || accountAddress
  const [balances, setBalances] = useState<Record<string, string>>({})

  // Fetch each token balance individually
  const balanceResults = tokens.map((token) => {
    const balanceQuery = useReadContract({
      address: token.address as Address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!token.address && !!userAddress && token.address !== '0x0000000000000000000000000000000000000000',
        refetchInterval: 10000,
        retry: 3,
      },
    })

    return { token, ...balanceQuery }
  })

  useEffect(() => {
    const newBalances: Record<string, string> = {}
    balanceResults.forEach(({ token, data }) => {
      const addressKey = token.address.toLowerCase()
      if (data !== undefined && data !== null && token) {
        newBalances[addressKey] = formatUnits(data, token.decimals)
      } else {
        newBalances[addressKey] = '0'
      }
    })
    setBalances(newBalances)
  }, [balanceResults.map(br => br.data).join(',')])

  return {
    balances,
    isLoading: balanceResults.some(br => br.isLoading),
    errors: balanceResults.filter(br => br.error).map(br => br.error),
  }
}

