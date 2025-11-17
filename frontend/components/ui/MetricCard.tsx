import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MetricCardProps {
  title: string
  value: string | ReactNode
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
}

export function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-gray-600 dark:text-gray-400">{icon}</div>}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        </div>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{value}</div>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-500">{subtitle}</p>
      )}
    </motion.div>
  )
}
