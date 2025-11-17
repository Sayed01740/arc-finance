// Official Arc Testnet Token List

export interface Token {
  symbol: string
  name: string
  address: `0x${string}`
  decimals: number
  logo?: string
  isOfficial?: boolean
}

// Official Arc Testnet Tokens
export const OFFICIAL_TOKENS: Token[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin (Arc Official)',
    address: '0x3600000000000000000000000000000000000000' as `0x${string}`,
    decimals: 18,
    isOfficial: true,
  },
  // Add more official tokens as they become available
]

// Custom/Test Tokens
export const CUSTOM_TOKENS: Token[] = [
  {
    symbol: 'TKA',
    name: 'Token A',
    address: (process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    decimals: 18,
    isOfficial: false,
  },
  {
    symbol: 'TKB',
    name: 'Token B',
    address: (process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    decimals: 18,
    isOfficial: false,
  },
]

// All available tokens
export const ALL_TOKENS: Token[] = [
  ...OFFICIAL_TOKENS,
  ...CUSTOM_TOKENS,
]

// Native token (USDC on Arc testnet)
export const NATIVE_TOKEN: Token = {
  symbol: 'USDC',
  name: 'USDC (Native)',
  address: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Zero address for native
  decimals: 18,
  isOfficial: true,
}

// Helper function to find token by address
export function findTokenByAddress(address: string): Token | undefined {
  return ALL_TOKENS.find((token) => token.address.toLowerCase() === address.toLowerCase())
}

// Helper function to find token by symbol
export function findTokenBySymbol(symbol: string): Token | undefined {
  return ALL_TOKENS.find((token) => token.symbol.toUpperCase() === symbol.toUpperCase())
}

