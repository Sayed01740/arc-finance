'use client'

import Link from 'next/link'
import { useAccount } from 'wagmi'
import { WalletConnectButton } from './WalletConnectButton'
import { Sparkles, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function Navbar() {
  const { isConnected } = useAccount()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/mint', label: 'Mint', show: isConnected },
    { href: '/create', label: 'Create', show: isConnected },
    { href: '/collection', label: 'Collection', show: isConnected },
    { href: '/admin', label: 'Admin', show: isConnected },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="text-xl font-black gradient-text">Arc NFT</div>
              <div className="text-xs text-gray-400 -mt-1">Collection</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.filter(link => link.show).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-white/80 hover:text-white font-medium transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <WalletConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-effect border-t border-purple-500/20"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.filter(link => link.show).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white hover:text-purple-400 font-medium py-2 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                <WalletConnectButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
