import { useConnect, useAccount } from 'wagmi'
import { useTheme } from '@/components/ThemeProvider'
import toast from 'react-hot-toast'

export function useWallet() {
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()

  const connectWallet = () => {
    const injectedConnector = connectors.find((c) => c.id === 'injected' || c.id === 'metaMask')
    if (injectedConnector) {
      connect({ connector: injectedConnector })
      toast.success('Connecting wallet...')
    } else if (connectors.length > 0) {
      connect({ connector: connectors[0] })
      toast.success('Connecting wallet...')
    } else {
      toast.error('No wallet connector available. Please install MetaMask.')
    }
  }

  return {
    connectWallet,
    isConnected,
  }
}
