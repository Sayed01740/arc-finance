import { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary-500/50':
            variant === 'primary',
          'bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-dark-600':
            variant === 'secondary',
          'border-2 border-gray-300 dark:border-dark-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-dark-700':
            variant === 'outline',
          'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-700':
            variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
