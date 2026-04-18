import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Clock, Navigation, MapPin,
  Bus, Train, Car, Bike, ChevronRight, AlertTriangle, CheckCircle, Info,
  Coffee, ShoppingBag, Hotel, Hospital, Shield,
} from 'lucide-react'
import { useMapStore } from '@/store/useMapStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDensityLabel, getSafetyColor } from '@/data/areas'
import { useReactions } from '@/hooks/useReactions'
import { REACTION_CONFIG } from '@/lib/database.types'
import type { ReactionType } from '@/lib/database.types'
import { isSupabaseReady } from '@/lib/supabase'
import { cn } from '@/lib/utils'

function MeterBar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/45">{label}</span>
        <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

const transportIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Metro: Train,
  Cab: Car,
  Auto: Car,
  E: Bike,
  Walking: Navigation,
  Cycling: Bike,
  Bus: Bus,
}

function getTransportIcon(t: string) {
  for (const [key, Icon] of Object.entries(transportIconMap)) {
    if (t.toLowerCase().includes(key.toLowerCase())) return Icon
  }
  return Bus
}

// ── Reaction bar ─────────────────────────────────
function ReactionBar({ areaId }: { areaId: string }) {
  const { counts, userReactions, toggleReaction } = useReactions(areaId)

  if (!isSupabaseReady) return null

  return (
    <div>
      <p className="text-xs font-semibold text-white/40 mb-2">Community Vibes</p>
      <div className="grid grid-cols-3 gap-1.5">
        {(Object.entries(REACTION_CONFIG) as [ReactionType, typeof REACTION_CONFIG[ReactionType]][]).map(
          ([type, cfg]) => {
            const active = userReactions.has(type)
            return (
              <button
                key={type}
                onClick={() => toggleReaction(type)}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-xs font-medium transition-all duration-150 active:scale-95',
                  active
                    ? 'border-opacity-50 text-white'
                    : 'border-white/7 bg-white/3 text-white/45 hover:bg-white/6',
                )}
                style={active ? { background: `${cfg.color}18`, borderColor: `${cfg.color}40`, color: cfg.color } : undefined}
              >
                <span className="text-base leading-none">{cfg.emoji}</span>
                <span className="leading-none">{cfg.label}</span>
                {counts[type] > 0 && (
                  <span className="text-white/30 text-[10px]">{counts[type]}</span>
                )}
              </button>
            )
          },
        )}
      </div>
    </div>
  )
}

const safeNearbyIconMap = {
  cafe:     { Icon: Coffee,      color: '#f59e0b', label: 'Cafe'     },
  mall:     { Icon: ShoppingBag, color: '#06b6d4', label: 'Mall'     },
  hotel:    { Icon: Hotel,       color: '#8b5cf6', label: 'Hotel'    },
  hospital: { Icon: Hospital,    color: '#ef4444', label: 'Hospital' },
  metro:    { Icon: Train,       color: '#22c55e', label: 'Metro'    },
  park:     { Icon: Shield,      color: '#10b981', label: 'Park'     },
} as const

function SafeNearbySection({ places }: { places: { name: string; type: keyof typeof safeNearbyIconMap; note: string }[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
        <p className="text-xs font-semibold text-white/60">Nearby Safe Spots</p>
        <span className="text-[10px] text-white/25 ml-auto">click to shelter here</span>
      </div>
      <div className="space-y-2">
        {places.map((place, i) => {
          const { Icon, color, label } = safeNearbyIconMap[place.type]
          return (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 p-2.5 rounded-xl border border-white/7 bg-white/3 hover:bg-white/6 transition-colors cursor-default"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${color}18`, border: `1px solid ${color}28` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-semibold text-white/80 truncate">{place.name}</span>
                  <span
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ background: `${color}18`, color }}
                  >
                    {label}
                  </span>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed">{place.note}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export function AreaPanel() {
  const { selectedArea, isPanelOpen, setPanel, setDirectionOpen } = useMapStore()

  return (
    <AnimatePresence>
      {isPanelOpen && selectedArea && (
        <motion.div
          key="area-panel"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="absolute right-0 top-0 bottom-0 w-80 z-30 flex flex-col glass border-l border-white/7"
          style={{ maxHeight: '100%' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 pb-4 border-b border-white/7">
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: getSafetyColor(selectedArea.safetyLevel) }}
                />
                <span className="text-xs text-white/40 truncate">{selectedArea.locality}</span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">{selectedArea.name}</h2>
            </div>
            <button
              onClick={() => setPanel(false)}
              className="p-1.5 rounded-lg hover:bg-white/8 text-white/40 hover:text-white/80 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">

            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={selectedArea.isOpen ? 'open' : 'closed'} dot>
                {selectedArea.isOpen ? 'Open Now' : 'Closed'}
              </Badge>
              <Badge variant={selectedArea.safetyLevel}>
                {selectedArea.safetyLevel === 'safe' ? 'Safe Zone' :
                 selectedArea.safetyLevel === 'moderate' ? 'Moderate' : 'Use Caution'}
              </Badge>
              <Badge variant="purple">
                {getDensityLabel(selectedArea.crowdDensity)}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-white/55 leading-relaxed">{selectedArea.description}</p>

            {/* Meters */}
            <div className="space-y-3">
              <MeterBar
                value={selectedArea.crowdDensity}
                color="#8b5cf6"
                label="Crowd Density"
              />
              <MeterBar
                value={100 - selectedArea.trafficLevel}
                color="#22c55e"
                label="Flow Score (higher = smoother)"
              />
              <MeterBar
                value={
                  selectedArea.safetyLevel === 'safe' ? 88 :
                  selectedArea.safetyLevel === 'moderate' ? 55 : 28
                }
                color={getSafetyColor(selectedArea.safetyLevel)}
                label="Safety Score"
              />
            </div>

            {/* Safety alert */}
            {selectedArea.safetyLevel === 'danger' && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/8 border border-red-500/20">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400/90 leading-relaxed">
                  This area has elevated crime reports. Stick to main roads, avoid late-night solo visits.
                </p>
              </div>
            )}
            {selectedArea.safetyLevel === 'safe' && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-400/90 leading-relaxed">
                  Verified safe. Good lighting, active foot traffic, low incident reports.
                </p>
              </div>
            )}

            {/* Best time */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/4 border border-white/7">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white/70 mb-0.5">Best Time to Visit</p>
                <p className="text-sm text-white/55">{selectedArea.bestTimeToVisit}</p>
              </div>
            </div>

            {/* Crime rate */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/4 border border-white/7">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white/70 mb-0.5">Crime Rate</p>
                <p className="text-sm" style={{ color: selectedArea.crimeRate === 'low' ? '#22c55e' : selectedArea.crimeRate === 'medium' ? '#f59e0b' : '#ef4444' }}>
                  {selectedArea.crimeRate.charAt(0).toUpperCase() + selectedArea.crimeRate.slice(1)}
                </p>
              </div>
            </div>

            {/* Transport */}
            <div>
              <p className="text-xs font-semibold text-white/45 mb-2">How to Get There</p>
              <div className="space-y-2">
                {selectedArea.transport.map((t) => {
                  const Icon = getTransportIcon(t)
                  return (
                    <div key={t} className="flex items-center gap-2 text-sm text-white/60">
                      <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {t}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Local shortcut */}
            <div className="p-3 rounded-xl bg-purple-500/8 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-1.5">
                <Navigation className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-semibold text-purple-300">Local Shortcut</span>
              </div>
              <p className="text-xs text-white/55 leading-relaxed">{selectedArea.shortcutFrom}</p>
            </div>

            {/* Nearby safe spots */}
            <SafeNearbySection places={selectedArea.safeNearby} />

            {/* Community reactions */}
            <ReactionBar areaId={selectedArea.id} />

            {/* Tags */}
            <div>
              <p className="text-xs font-semibold text-white/45 mb-2">Vibe Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedArea.tags.map((tag) => (
                  <Badge key={tag} variant="muted" size="sm">#{tag}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 border-t border-white/7 flex gap-2">
            <Button
              className="flex-1"
              onClick={() => setDirectionOpen(true)}
            >
              <Navigation className="w-4 h-4" />
              Get Directions
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button variant="secondary" size="icon">
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
