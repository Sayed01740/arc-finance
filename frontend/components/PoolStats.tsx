'use client'

import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { AMM_ABI } from '@/utils/abi'

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS as `0x${string}`
const TOKEN_A_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS as `0x${string}`
const TOKEN_B_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS as `0x${string}`

export function PoolStats() {
  const [price, setPrice] = useState<string>('0')

  const { data: reserves } = useReadContract({
    address: AMM_ADDRESS,
    abi: AMM_ABI,
    functionName: 'getReserves',
    query: {
      refetchInterval: 5000,
    },
  })

  useEffect(() => {
    if (reserves && reserves[0] > 0n) {
      const reserveA = Number(formatEther(reserves[0]))
      const reserveB = Number(formatEther(reserves[1]))
      const calculatedPrice = reserveB / reserveA
      setPrice(calculatedPrice.toFixed(6))
    }
  }, [reserves])

  if (!reserves || reserves[0] === 0n) {
    return (
      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Pool Statistics</h2>
        <p style={{ color: '#6b7280' }}>No liquidity in the pool yet</p>
      </div>
    )
  }

  const reserveA = formatEther(reserves[0])
  const reserveB = formatEther(reserves[1])

  return (
    <div className="card">
      <h2 style={{ marginBottom: '16px' }}>Pool Statistics</h2>
      <div className="stats">
        <div className="stat">
          <div className="stat-label">Token A Reserve</div>
          <div className="stat-value">{parseFloat(reserveA).toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Token B Reserve</div>
          <div className="stat-value">{parseFloat(reserveB).toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Price (B/A)</div>
          <div className="stat-value">{price}</div>
        </div>
      </div>
    </div>
  )
}
