import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'safe' | 'moderate' | 'danger' | 'purple' | 'accent' | 'muted' | 'open' | 'closed'
  size?: 'sm' | 'md'
  className?: string
  dot?: boolean
}

const variants = {
  safe: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  moderate: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/25',
  purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/25',
  accent: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25',
  muted: 'bg-white/5 text-white/50 border border-white/8',
  open: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  closed: 'bg-red-500/15 text-red-400 border border-red-500/25',
}

const dotColors = {
  safe: 'bg-emerald-400',
  moderate: 'bg-amber-400',
  danger: 'bg-red-400',
  purple: 'bg-purple-400',
  accent: 'bg-cyan-400',
  muted: 'bg-white/30',
  open: 'bg-emerald-400',
  closed: 'bg-red-400',
}

export function Badge({ children, variant = 'muted', size = 'sm', className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variants[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])}
        />
      )}
      {children}
    </span>
  )
}
