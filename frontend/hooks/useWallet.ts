import { useConnect, useAccount } from 'wagmi'
import toast from 'react-hot-toast'

export function useWallet() {
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()

  const connectWallet = (walletId?: string) => {
    let connectorToUse
    
    if (walletId) {
      // Try to find specific wallet connector
      connectorToUse = connectors.find((c) => 
        c.id === walletId || 
        c.name?.toLowerCase().includes(walletId.toLowerCase())
      )
    }
    
    // Fallback to MetaMask or injected
    if (!connectorToUse) {
      connectorToUse = connectors.find((c) => c.id === 'injected' || c.id === 'metaMask')
    }
    
    // Final fallback to first available connector
    if (!connectorToUse && connectors.length > 0) {
      connectorToUse = connectors[0]
    }

    if (connectorToUse) {
      connect({ connector: connectorToUse })
      toast.success('Connecting wallet...')
    } else {
      toast.error('No wallet detected. Please install a wallet extension.')
    }
  }

  return {
    connectWallet,
    isConnected,
  }
}
