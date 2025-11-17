'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther, formatEther, erc20Abi } from 'viem'
import { AMM_ABI } from '@/utils/abi'

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS as `0x${string}`
const TOKEN_A_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS as `0x${string}`
const TOKEN_B_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS as `0x${string}`

export function LiquidityInterface() {
  const { address } = useAccount()
  const [action, setAction] = useState<'add' | 'remove'>('add')
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [lpAmount, setLpAmount] = useState('')

  const { data: tokenABalance } = useReadContract({
    address: TOKEN_A_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: tokenBBalance } = useReadContract({
    address: TOKEN_B_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: lpBalance } = useReadContract({
    address: AMM_ADDRESS,
    abi: AMM_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: reserves } = useReadContract({
    address: AMM_ADDRESS,
    abi: AMM_ABI,
    functionName: 'getReserves',
  })

  const { writeContract: approveA, data: approveAHash } = useWriteContract()
  const { writeContract: approveB, data: approveBHash } = useWriteContract()
  const { writeContract: addLiquidity, data: addLiquidityHash } = useWriteContract()
  const { writeContract: removeLiquidity, data: removeLiquidityHash } = useWriteContract()

  const { isLoading: isApprovingA } = useWaitForTransactionReceipt({ hash: approveAHash })
  const { isLoading: isApprovingB } = useWaitForTransactionReceipt({ hash: approveBHash })
  const { isLoading: isAdding } = useWaitForTransactionReceipt({ hash: addLiquidityHash })
  const { isLoading: isRemoving } = useWaitForTransactionReceipt({ hash: removeLiquidityHash })

  const handleAddLiquidity = async () => {
    if (!amountA || !amountB || !address) return

    // Approve tokens
    approveA({
      address: TOKEN_A_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [AMM_ADDRESS, parseEther(amountA)],
    })
    
    approveB({
      address: TOKEN_B_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [AMM_ADDRESS, parseEther(amountB)],
    })

    // Wait for approvals then add liquidity
    setTimeout(() => {
      addLiquidity({
        address: AMM_ADDRESS,
        abi: AMM_ABI,
        functionName: 'addLiquidity',
        args: [parseEther(amountA), parseEther(amountB), address],
      })
    }, 2000)
  }

  const handleRemoveLiquidity = async () => {
    if (!lpAmount || !address) return

    // LP tokens are tracked in the contract, no approval needed
    removeLiquidity({
      address: AMM_ADDRESS,
      abi: AMM_ABI,
      functionName: 'removeLiquidity',
      args: [parseEther(lpAmount), address],
    })
  }

  const tokenABalanceFormatted = tokenABalance ? formatEther(tokenABalance) : '0'
  const tokenBBalanceFormatted = tokenBBalance ? formatEther(tokenBBalance) : '0'
  const lpBalanceFormatted = lpBalance ? formatEther(lpBalance) : '0'

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px' }}>
        {action === 'add' ? 'Add Liquidity' : 'Remove Liquidity'}
      </h2>

      <div style={{ marginBottom: '16px' }}>
        <button
          className={`button button-secondary ${action === 'add' ? '' : ''}`}
          onClick={() => setAction('add')}
          style={{ marginRight: '8px' }}
        >
          Add
        </button>
        <button
          className={`button button-secondary ${action === 'remove' ? '' : ''}`}
          onClick={() => setAction('remove')}
        >
          Remove
        </button>
      </div>

      {action === 'add' ? (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label className="label">Token A Amount</label>
            <input
              type="number"
              className="input"
              placeholder="0.0"
              value={amountA}
              onChange={(e) => setAmountA(e.target.value)}
            />
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              Balance: {parseFloat(tokenABalanceFormatted).toFixed(4)}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="label">Token B Amount</label>
            <input
              type="number"
              className="input"
              placeholder="0.0"
              value={amountB}
              onChange={(e) => setAmountB(e.target.value)}
            />
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              Balance: {parseFloat(tokenBBalanceFormatted).toFixed(4)}
            </div>
          </div>

          <button
            className="button"
            onClick={handleAddLiquidity}
            disabled={!amountA || !amountB || isApprovingA || isApprovingB || isAdding}
            style={{ width: '100%' }}
          >
            {isApprovingA || isApprovingB || isAdding ? 'Processing...' : 'Add Liquidity'}
          </button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '24px' }}>
            <label className="label">LP Token Amount</label>
            <input
              type="number"
              className="input"
              placeholder="0.0"
              value={lpAmount}
              onChange={(e) => setLpAmount(e.target.value)}
            />
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              Balance: {parseFloat(lpBalanceFormatted).toFixed(4)}
            </div>
          </div>

          <button
            className="button"
            onClick={handleRemoveLiquidity}
            disabled={!lpAmount || isRemoving}
            style={{ width: '100%' }}
          >
            {isRemoving ? 'Removing...' : 'Remove Liquidity'}
          </button>
        </>
      )}
    </div>
  )
}
