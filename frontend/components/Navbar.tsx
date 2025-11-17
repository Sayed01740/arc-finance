'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAccount, useSwitchChain } from 'wagmi'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useTheme } from './ThemeProvider'
import { arcTestnet } from '@/wagmi.config'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { WalletConnectButton } from './WalletConnectButton'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Swap', href: '/swap' },
  { name: 'Limit Order', href: '/limit-order' },
  { name: 'Liquidity', href: '/liquidity' },
  { name: 'Farming', href: '/farming' },
  { name: 'About', href: '/about' },
]

export function Navbar() {
  const pathname = usePathname()
  let theme = 'light'
  let toggleTheme = () => {}
  
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
    toggleTheme = themeContext.toggleTheme
  } catch (e) {
    // ThemeProvider not available during SSR
  }
  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSwitchChain = () => {
    if (chain?.id !== arcTestnet.id) {
      switchChain({ chainId: arcTestnet.id })
      toast.success('Switching to Arc Testnet...')
    }
  }


  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-dark-700 bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary text-white font-bold text-xl">
              AF
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Arc Finance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-gray-100'
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Wallet Connect & Network Switch */}
            <div className="flex items-center space-x-2">
              {isConnected && chain?.id !== arcTestnet.id && (
                <button
                  onClick={handleSwitchChain}
                  className="px-3 py-2 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                >
                  Switch Network
                </button>
              )}
              <WalletConnectButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
