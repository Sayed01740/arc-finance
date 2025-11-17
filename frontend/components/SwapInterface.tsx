'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther, formatEther, erc20Abi } from 'viem'
import { AMM_ABI } from '@/utils/abi'

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS as `0x${string}`
const TOKEN_A_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS as `0x${string}`
const TOKEN_B_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS as `0x${string}`

export function SwapInterface() {
  const { address } = useAccount()
  const [tokenIn, setTokenIn] = useState<'A' | 'B'>('A')
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')

  const tokenInAddress = tokenIn === 'A' ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS

  const { data: tokenBalance } = useReadContract({
    address: tokenInAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      refetchInterval: 5000,
    },
  })

  const { data: amountOutPreview } = useReadContract({
    address: AMM_ADDRESS,
    abi: AMM_ABI,
    functionName: 'getAmountOut',
    args: amountIn ? [parseEther(amountIn), tokenInAddress] : undefined,
    query: {
      enabled: !!amountIn && parseFloat(amountIn) > 0,
    },
  })

  useEffect(() => {
    if (amountOutPreview) {
      setAmountOut(formatEther(amountOutPreview))
    } else {
      setAmountOut('')
    }
  }, [amountOutPreview, amountIn])

  const { writeContract: approveToken, data: approveHash } = useWriteContract()
  const { writeContract: swap, data: swapHash } = useWriteContract()

  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  const { isLoading: isSwapping } = useWaitForTransactionReceipt({
    hash: swapHash,
  })

  const handleApprove = async () => {
    if (!amountIn || !address) return
    
    approveToken({
      address: tokenInAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [AMM_ADDRESS, parseEther(amountIn)],
    })
  }

  const handleSwap = async () => {
    if (!amountIn || !address) return

    swap({
      address: AMM_ADDRESS,
      abi: AMM_ABI,
      functionName: 'swapExactTokens',
      args: [parseEther(amountIn), tokenInAddress, address],
    })
  }

  const tokenBalanceFormatted = tokenBalance ? formatEther(tokenBalance) : '0'

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px' }}>Swap Tokens</h2>
      
      <div style={{ marginBottom: '16px' }}>
        <label className="label">Swap From</label>
        <select
          className="input"
          value={tokenIn}
          onChange={(e) => {
            setTokenIn(e.target.value as 'A' | 'B')
            setAmountIn('')
            setAmountOut('')
          }}
        >
          <option value="A">Token A</option>
          <option value="B">Token B</option>
        </select>
        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
          Balance: {parseFloat(tokenBalanceFormatted).toFixed(4)}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label className="label">Amount In</label>
        <input
          type="number"
          className="input"
          placeholder="0.0"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label className="label">Amount Out (estimated)</label>
        <input
          type="text"
          className="input"
          placeholder="0.0"
          value={amountOut}
          readOnly
          style={{ background: '#f9fafb' }}
        />
      </div>

      <button
        className="button"
        onClick={handleApprove}
        disabled={!amountIn || parseFloat(amountIn) <= 0 || isApproving || isSwapping}
        style={{ marginRight: '12px', width: '100%', marginBottom: '12px' }}
      >
        {isApproving ? 'Approving...' : 'Approve Token'}
      </button>

      <button
        className="button"
        onClick={handleSwap}
        disabled={!amountIn || parseFloat(amountIn) <= 0 || !amountOut || isApproving || isSwapping}
        style={{ width: '100%' }}
      >
        {isSwapping ? 'Swapping...' : 'Swap'}
      </button>
    </div>
  )
}
