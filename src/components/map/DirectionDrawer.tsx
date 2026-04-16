import { AnimatePresence, motion } from 'framer-motion'
import { X, Navigation, Shield, Clock, Car, Train, Bike, ArrowRight, Zap, Users } from 'lucide-react'
import { useMapStore } from '@/store/useMapStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ROUTE_OPTIONS = [
  {
    id: 'safest',
    label: 'Safest Route',
    icon: Shield,
    color: '#22c55e',
    time: '18 min',
    distance: '4.2 km',
    desc: 'Well-lit roads, high foot traffic, avoids reported spots',
    recommended: true,
  },
  {
    id: 'fastest',
    label: 'Fastest Route',
    icon: Zap,
    color: '#f59e0b',
    time: '11 min',
    distance: '3.1 km',
    desc: 'Minimal traffic right now — clear signal corridor',
    recommended: false,
  },
  {
    id: 'local',
    label: 'Local Shortcut',
    icon: Navigation,
    color: '#8b5cf6',
    time: '14 min',
    distance: '2.8 km',
    desc: 'Known to locals — less crowded, faster on ground',
    recommended: false,
  },
]

const TRANSPORT_OPTIONS = [
  { icon: Train, label: 'Metro', eta: '12 min', fare: '₹30–50' },
  { icon: Car, label: 'Cab/Auto', eta: '8 min', fare: '₹80–120' },
  { icon: Bike, label: 'Bike/Scooter', eta: '10 min', fare: '₹20–40' },
]

export function DirectionDrawer() {
  const { isDirectionOpen, setDirectionOpen, selectedArea } = useMapStore()

  return (
    <AnimatePresence>
      {isDirectionOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-40"
            onClick={() => setDirectionOpen(false)}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            className="absolute bottom-0 left-0 right-0 z-50 glass rounded-t-2xl border-t border-white/8 max-h-[75vh] overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-1 bg-white/15 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/7">
              <div>
                <h3 className="font-bold text-white">Directions</h3>
                {selectedArea && (
                  <p className="text-xs text-white/40">
                    To {selectedArea.name}, {selectedArea.locality}
                  </p>
                )}
              </div>
              <button
                onClick={() => setDirectionOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/8 text-white/40 hover:text-white/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* From field */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/7">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-sm text-white/50">Your current location</span>
              </div>

              {/* Route options */}
              <div>
                <p className="text-xs font-semibold text-white/40 mb-2">Choose Your Route</p>
                <div className="space-y-2">
                  {ROUTE_OPTIONS.map((route) => (
                    <button
                      key={route.id}
                      className="w-full flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left hover:border-opacity-50"
                      style={{
                        background: route.recommended ? `${route.color}10` : 'rgba(255,255,255,0.03)',
                        border: route.recommended ? `1px solid ${route.color}30` : '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${route.color}20` }}
                      >
                        <route.icon className="w-4 h-4" style={{ color: route.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-white/85">{route.label}</span>
                          {route.recommended && (
                            <Badge variant="safe" size="sm">Recommended</Badge>
                          )}
                        </div>
                        <p className="text-xs text-white/45 mb-1">{route.desc}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-white/60"><Clock className="w-3 h-3 inline mr-1" />{route.time}</span>
                          <span className="text-white/40">{route.distance}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/25 shrink-0 mt-2" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Transport options */}
              <div>
                <p className="text-xs font-semibold text-white/40 mb-2">Best Transport to Use</p>
                <div className="grid grid-cols-3 gap-2">
                  {TRANSPORT_OPTIONS.map((t) => (
                    <button
                      key={t.label}
                      className="p-3 rounded-xl bg-white/3 border border-white/7 hover:bg-white/6 transition-colors text-center"
                    >
                      <t.icon className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-white/80">{t.label}</p>
                      <p className="text-xs text-white/40">{t.eta}</p>
                      <p className="text-xs text-white/30">{t.fare}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crowd alert */}
              {selectedArea && selectedArea.crowdDensity > 75 && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-purple-500/8 border border-purple-500/20">
                  <Users className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-300/80">
                    This area is currently busy ({selectedArea.crowdDensity}% capacity).
                    Best time: {selectedArea.bestTimeToVisit}
                  </p>
                </div>
              )}
            </div>

            {/* Action */}
            <div className="p-4 border-t border-white/7">
              <Button className="w-full" size="md">
                <Navigation className="w-4 h-4" />
                Start Navigation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
