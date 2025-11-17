// AMM Pool Configuration
// Each pool supports one token pair

export interface Pool {
  address: `0x${string}`
  tokenA: `0x${string}`
  tokenB: `0x${string}`
  name: string
}

// All deployed AMM pools
export const POOLS: Pool[] = [
  {
    address: (process.env.NEXT_PUBLIC_AMM_ADDRESS || '0xFb2ecDB978FE3c6597F44D3e0B3B5442a6F10aAf') as `0x${string}`,
    tokenA: (process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS || '0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496') as `0x${string}`,
    tokenB: (process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS || '0xe25A6bcDAFB93762fD727d1375403506F1e4d381') as `0x${string}`,
    name: 'TKA/TKB Pool',
  },
  {
    address: '0xeCa87Acf0A8D038ed94BD4C755109fA1D391ca32' as `0x${string}`,
    tokenA: '0x3600000000000000000000000000000000000000' as `0x${string}`, // USDC
    tokenB: (process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS || '0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496') as `0x${string}`, // TKA
    name: 'USDC/TKA Pool',
  },
  {
    address: '0xb29E57E2B5b86F0637825fb898bf53E1C1244245' as `0x${string}`,
    tokenA: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a' as `0x${string}`, // USDT
    tokenB: (process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS || '0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496') as `0x${string}`, // TKA
    name: 'USDT/TKA Pool',
  },
]

// Find pool that supports a token pair
export function findPoolForPair(tokenA: string, tokenB: string): Pool | null {
  const tokenALower = tokenA.toLowerCase()
  const tokenBLower = tokenB.toLowerCase()

  return (
    POOLS.find(
      (pool) =>
        (pool.tokenA.toLowerCase() === tokenALower && pool.tokenB.toLowerCase() === tokenBLower) ||
        (pool.tokenA.toLowerCase() === tokenBLower && pool.tokenB.toLowerCase() === tokenALower)
    ) || null
  )
}

// Find pool that supports a token (either as tokenA or tokenB)
export function findPoolsForToken(token: string): Pool[] {
  const tokenLower = token.toLowerCase()
  return POOLS.filter(
    (pool) => pool.tokenA.toLowerCase() === tokenLower || pool.tokenB.toLowerCase() === tokenLower
  )
}

// Check if a token pair can be swapped directly
export function canSwapDirectly(tokenA: string, tokenB: string): boolean {
  return findPoolForPair(tokenA, tokenB) !== null
}

// Find swap route (direct or via bridge token)
export function findSwapRoute(tokenFrom: string, tokenTo: string): {
  route: 'direct' | 'via-bridge'
  pools: Pool[]
  bridgeToken?: string
} | null {
  const tokenFromLower = tokenFrom.toLowerCase()
  const tokenToLower = tokenTo.toLowerCase()

  // Check direct swap
  const directPool = findPoolForPair(tokenFrom, tokenTo)
  if (directPool) {
    return {
      route: 'direct',
      pools: [directPool],
    }
  }

  // Check via TKA bridge (most common bridge token)
  const tkaAddress = (process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS || '0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496').toLowerCase()
  
  const poolFrom = findPoolForPair(tokenFrom, tkaAddress)
  const poolTo = findPoolForPair(tokenTo, tkaAddress)

  if (poolFrom && poolTo) {
    return {
      route: 'via-bridge',
      pools: [poolFrom, poolTo],
      bridgeToken: tkaAddress,
    }
  }

  return null
}

