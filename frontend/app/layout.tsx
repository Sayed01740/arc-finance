import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from './ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Arc NFT Collection - Create & Mint NFTs on Arc Testnet',
  description: 'Create, mint, and own unique digital art NFTs on Arc Testnet blockchain. Join the future of digital ownership.',
  keywords: ['NFT', 'Arc Network', 'Blockchain', 'Digital Art', 'Web3'],
  authors: [{ name: 'Arc NFT Collection' }],
  openGraph: {
    title: 'Arc NFT Collection',
    description: 'Create, mint, and own unique digital art NFTs on Arc Testnet',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
