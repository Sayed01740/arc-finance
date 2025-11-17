/**
 * Check if environment variables are properly loaded
 * This helps debug missing token addresses
 */

export function checkEnvironmentVariables() {
  const env = {
    TOKEN_A_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS,
    TOKEN_B_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS,
    AMM_ADDRESS: process.env.NEXT_PUBLIC_AMM_ADDRESS,
    ARC_RPC_URL: process.env.NEXT_PUBLIC_ARC_RPC_URL,
    ARC_CHAIN_ID: process.env.NEXT_PUBLIC_ARC_CHAIN_ID,
  }

  console.group('🔍 Environment Variables Check')
  console.log('TOKEN_A_ADDRESS:', env.TOKEN_A_ADDRESS || '❌ MISSING')
  console.log('TOKEN_B_ADDRESS:', env.TOKEN_B_ADDRESS || '❌ MISSING')
  console.log('AMM_ADDRESS:', env.AMM_ADDRESS || '❌ MISSING')
  console.log('ARC_RPC_URL:', env.ARC_RPC_URL || '❌ MISSING')
  console.log('ARC_CHAIN_ID:', env.ARC_CHAIN_ID || '❌ MISSING')

  const missing = Object.entries(env).filter(([_, value]) => !value)
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.map(([key]) => key))
    console.error('💡 Make sure to set these in Vercel environment variables or .env.local')
  } else {
    console.log('✅ All environment variables are set!')
  }
  console.groupEnd()

  return env
}

// Auto-run check in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  checkEnvironmentVariables()
}

