'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
        <span style={{ 
          background: '#f3f4f6', 
          padding: '8px 16px', 
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button className="button button-secondary" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    )
  }

  const injectedConnector = connectors.find((c) => c.id === 'injected' || c.id === 'metaMask')
  
  return (
    <button
      className="button"
      onClick={() => {
        if (injectedConnector) {
          connect({ connector: injectedConnector })
        } else if (connectors.length > 0) {
          connect({ connector: connectors[0] })
        }
      }}
    >
      Connect Wallet
    </button>
  )
}
