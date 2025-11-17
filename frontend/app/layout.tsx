import { Metadata } from 'next'
import { ClientProviders } from './ClientProviders'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arc Finance - Decentralized Exchange',
  description: 'Trade tokens, provide liquidity, and earn rewards on Arc Network',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
