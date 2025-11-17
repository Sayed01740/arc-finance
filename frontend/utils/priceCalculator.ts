/**
 * Price calculation helper functions
 */

/**
 * Calculate price of token A in terms of token B
 * @param reserveA Reserve of token A
 * @param reserveB Reserve of token B
 * @returns Price (B per A)
 */
export function calculatePrice(reserveA: bigint, reserveB: bigint): number {
  if (reserveA === 0n) return 0
  return Number(reserveB) / Number(reserveA)
}

/**
 * Calculate output amount using constant product formula
 * @param amountIn Input amount
 * @param reserveIn Reserve of input token
 * @param reserveOut Reserve of output token
 * @returns Output amount
 */
export function calculateAmountOut(
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint
): bigint {
  if (reserveIn === 0n || reserveOut === 0n) return 0n
  
  const amountInWithFee = amountIn * 997n // 0.3% fee
  const numerator = amountInWithFee * reserveOut
  const denominator = (reserveIn * 1000n) + amountInWithFee
  
  return numerator / denominator
}

/**
 * Calculate liquidity amount for given token amounts
 * @param amountA Amount of token A
 * @param amountB Amount of token B
 * @param reserveA Reserve of token A
 * @param reserveB Reserve of token B
 * @param totalSupply Current LP token total supply
 * @returns Liquidity amount
 */
export function calculateLiquidity(
  amountA: bigint,
  amountB: bigint,
  reserveA: bigint,
  reserveB: bigint,
  totalSupply: bigint
): bigint {
  if (reserveA === 0n && reserveB === 0n) {
    // First liquidity provision
    const k = amountA * amountB
    return sqrt(k) - 1000n // MINIMUM_LIQUIDITY
  }
  
  const liquidityA = (amountA * totalSupply) / reserveA
  const liquidityB = (amountB * totalSupply) / reserveB
  
  return liquidityA < liquidityB ? liquidityA : liquidityB
}

/**
 * Simple sqrt implementation using Babylonian method
 */
function sqrt(x: bigint): bigint {
  if (x === 0n) return 0n
  if (x < 4n) return 1n
  
  let z = x
  let y = x / 2n + 1n
  
  while (y < z) {
    z = y
    y = (x / z + z) / 2n
  }
  
  return z
}
