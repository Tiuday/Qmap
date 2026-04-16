import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 disabled:opacity-40 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40 active:scale-[0.97]':
              variant === 'primary',
            'bg-white/8 hover:bg-white/12 text-white/90 border border-white/10 active:scale-[0.97]':
              variant === 'secondary',
            'hover:bg-white/6 text-white/70 hover:text-white/90 active:scale-[0.97]':
              variant === 'ghost',
            'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 active:scale-[0.97]':
              variant === 'danger',
            'border border-purple-500/40 hover:border-purple-400/60 text-purple-300 hover:bg-purple-500/10 active:scale-[0.97]':
              variant === 'outline',
            // Sizes
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
            'w-9 h-9 p-0 rounded-lg': size === 'icon',
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
