'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Globe, Users, HelpCircle, Mail, FileText, Github } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    question: 'What is Arc Finance?',
    answer:
      'Arc Finance is a decentralized exchange (DEX) built on Arc testnet, allowing users to swap tokens, provide liquidity, and earn rewards through automated market making.',
  },
  {
    question: 'How do I add liquidity?',
    answer:
      'Navigate to the Liquidity page, select the token pair, enter the amounts you want to provide, and click "Add Liquidity". You will receive LP tokens representing your share of the pool.',
  },
  {
    question: 'What are the fees?',
    answer:
      'The swap fee is 0.3%, which is distributed to liquidity providers. When you provide liquidity, you earn a portion of these fees proportional to your share of the pool.',
  },
  {
    question: 'How do I earn rewards?',
    answer:
      'You can earn rewards by providing liquidity to pools (earning trading fees) or by staking LP tokens in farming pools (earning additional rewards).',
  },
  {
    question: 'What is slippage?',
    answer:
      'Slippage is the difference between the expected price of a trade and the actual executed price. It occurs when market conditions change during the transaction. You can set your slippage tolerance in the swap settings.',
  },
  {
    question: 'How do limit orders work?',
    answer:
      'Limit orders allow you to set a specific price at which you want to execute a trade. The order will be automatically executed when the market price reaches your specified limit price.',
  },
]

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Fast Swaps',
    description: 'Execute trades instantly with low slippage and competitive fees.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure',
    description: 'Built on Arc testnet with audited smart contracts and decentralized architecture.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Decentralized',
    description: 'No central authority. You control your funds at all times.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community Driven',
    description: 'Governed by the community with transparent decision-making.',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          About Arc Finance
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A decentralized exchange built on Arc testnet, enabling seamless token swaps, liquidity provision,
          and yield farming.
        </p>
      </motion.section>

      {/* Mission */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-dark-700"
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Our Mission</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Arc Finance aims to provide a user-friendly, secure, and efficient decentralized exchange platform
          on Arc testnet. We focus on low slippage, competitive fees, and sustainable liquidity provision to
          benefit all participants in the ecosystem.
        </p>
      </motion.section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100 flex items-center justify-center space-x-2">
          <HelpCircle className="w-8 h-8" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Links */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-dark-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="#"
            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-gray-100">Documentation</span>
          </Link>
          <Link
            href="#"
            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
          >
            <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-gray-100">GitHub</span>
          </Link>
          <Link
            href="#"
            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
          >
            <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-gray-100">Contact</span>
          </Link>
        </div>
      </motion.section>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4"
      >
        <p className="text-sm text-yellow-900 dark:text-yellow-300">
          <strong>Disclaimer:</strong> Arc Finance is currently deployed on Arc testnet. This is a test
          environment for development and testing purposes. Do not use real funds on testnet.
        </p>
      </motion.div>
    </div>
  )
}
