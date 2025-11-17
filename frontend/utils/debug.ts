/**
 * Debug utility to check environment variables and token configuration
 */

export function debugTokenConfig() {
  if (typeof window === 'undefined') return

  console.group('🔍 Token Configuration Debug')
  
  console.log('Environment Variables:')
  console.log('NEXT_PUBLIC_TOKEN_A_ADDRESS:', process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS)
  console.log('NEXT_PUBLIC_TOKEN_B_ADDRESS:', process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS)
  console.log('NEXT_PUBLIC_AMM_ADDRESS:', process.env.NEXT_PUBLIC_AMM_ADDRESS)
  console.log('NEXT_PUBLIC_ARC_RPC_URL:', process.env.NEXT_PUBLIC_ARC_RPC_URL)
  console.log('NEXT_PUBLIC_ARC_CHAIN_ID:', process.env.NEXT_PUBLIC_ARC_CHAIN_ID)

  // Check if tokens are loaded
  try {
    const { ALL_TOKENS } = require('@/utils/tokens')
    console.log('All Tokens:', ALL_TOKENS)
    console.log('Token Count:', ALL_TOKENS.length)
  } catch (e) {
    console.error('Error loading tokens:', e)
  }

  console.groupEnd()
}

// Auto-run in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  debugTokenConfig()
}

