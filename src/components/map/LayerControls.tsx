import { Users, Shield, TrendingUp, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMapStore, type Layer } from '@/store/useMapStore'
import { cn } from '@/lib/utils'

const LAYERS: { id: Layer; label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; glow: string }[] = [
  { id: 'crowd', label: 'Crowd', icon: Users, color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)' },
  { id: 'safety', label: 'Safety', icon: Shield, color: '#22c55e', glow: 'rgba(34,197,94,0.35)' },
  { id: 'traffic', label: 'Traffic', icon: TrendingUp, color: '#f59e0b', glow: 'rgba(245,158,11,0.35)' },
  { id: 'areas', label: 'Areas', icon: MapPin, color: '#06b6d4', glow: 'rgba(6,182,212,0.35)' },
]

export function LayerControls() {
  const { activeLayers, toggleLayer } = useMapStore()

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col gap-2"
    >
      {LAYERS.map((layer) => {
        const isActive = activeLayers.includes(layer.id)
        return (
          <button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className={cn(
              'relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
              'border outline-none focus-visible:ring-2',
              isActive
                ? 'text-white'
                : 'text-white/40 border-white/5 bg-white/3 hover:text-white/70 hover:bg-white/5',
            )}
            style={
              isActive
                ? {
                    background: `${layer.color}18`,
                    border: `1px solid ${layer.color}35`,
                    boxShadow: `0 0 12px ${layer.glow}`,
                  }
                : undefined
            }
          >
            <layer.icon
              className="w-4 h-4 shrink-0"
              style={{ color: isActive ? layer.color : undefined }}
            />
            <span className="hidden md:block">{layer.label}</span>
            {isActive && (
              <motion.span
                layoutId={`layer-active-${layer.id}`}
                className="absolute right-2 w-1.5 h-1.5 rounded-full"
                style={{ background: layer.color }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </button>
        )
      })}
    </motion.div>
  )
}
