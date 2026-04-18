import { useCallback, useRef, useState } from 'react'
import Map, {
  Marker,
  Source,
  Layer,
  type MapRef,
  type LayerProps,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Search, ArrowLeft,
  Layers, X, Info, Plus, Minus,
  Shield, AlertTriangle, Siren,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMapStore, type AreaData } from '@/store/useMapStore'
import { getSafetyColor, getDensityLabel } from '@/data/areas'
import { useAreas } from '@/hooks/useAreas'
import { LayerControls } from '@/components/map/LayerControls'
import { AreaPanel } from '@/components/map/AreaPanel'
import { DirectionDrawer } from '@/components/map/DirectionDrawer'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// CARTO Dark Matter — free, no API key required
const MAP_STYLE =
  (import.meta.env.VITE_MAP_STYLE as string) ||
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

// ── Heatmap Layer definition ──────────────────────────────────
const heatmapLayer: LayerProps = {
  id: 'crowd-heatmap',
  type: 'heatmap',
  maxzoom: 16,
  paint: {
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'intensity'], 0, 0, 1, 1],
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(26,0,48,0)',
      0.2, 'rgba(74,20,140,0.6)',
      0.4, 'rgba(123,31,162,0.7)',
      0.6, 'rgba(170,0,255,0.8)',
      0.8, 'rgba(200,30,240,0.85)',
      1, 'rgba(224,64,251,0.9)',
    ],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 20, 9, 60],
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 14, 0.7],
  },
}

// ── SVG teardrop pin ──────────────────────────────────────────
function TearPin({ color, size, PinIcon }: {
  color: string
  size: number
  PinIcon: React.ComponentType<{ size?: number; color?: string }>
}) {
  return (
    <div style={{ position: 'relative', width: size, height: Math.round(size * 1.35) }}>
      <svg
        width={size}
        height={Math.round(size * 1.35)}
        viewBox="0 0 40 54"
        fill="none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <path
          d="M20 0C8.954 0 0 8.954 0 20C0 34 20 54 20 54C20 54 40 34 40 20C40 8.954 31.046 0 20 0Z"
          fill={color}
        />
        {/* inner highlight circle */}
        <circle cx="20" cy="20" r="12" fill="rgba(255,255,255,0.18)" />
        <circle cx="20" cy="20" r="11" fill="rgba(0,0,0,0.12)" />
      </svg>
      {/* Icon centred in the bubble */}
      <div style={{
        position: 'absolute',
        top: '37%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <PinIcon size={Math.round(size * 0.38)} color="white" />
      </div>
    </div>
  )
}

// ── Area marker component ─────────────────────────────────────
function AreaMarker({
  area,
  isActive,
  activeLayers,
}: {
  area: AreaData
  isActive: boolean
  activeLayers: string[]
}) {
  const { selectArea } = useMapStore()
  const [hovered, setHovered] = useState(false)

  const pinColor =
    activeLayers.includes('safety')
      ? getSafetyColor(area.safetyLevel)
      : activeLayers.includes('crowd')
      ? `hsl(${280 - area.crowdDensity * 0.6}, 85%, 65%)`
      : '#8b5cf6'

  const PinIcon =
    area.safetyLevel === 'safe'     ? Shield :
    area.safetyLevel === 'moderate' ? AlertTriangle :
                                      Siren

  const pinSize = isActive ? 46 : hovered ? 40 : 34

  return (
    <Marker
      longitude={area.coordinates[0]}
      latitude={area.coordinates[1]}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation()
        selectArea(area)
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="cursor-pointer relative select-none"
        style={{ filter: (isActive || hovered) ? `drop-shadow(0 0 10px ${pinColor}cc)` : `drop-shadow(0 3px 8px ${pinColor}66)` }}
      >
        {/* Pulse ring — active or high density */}
        {(isActive || area.crowdDensity > 70) && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              background: pinColor,
              width: pinSize * 0.7,
              height: pinSize * 0.7,
              top: '10%',
              left: '50%',
              translateX: '-50%',
              opacity: 0.25,
            }}
            animate={{ scale: [1, 2.2, 1], opacity: [0.25, 0, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        <motion.div
          animate={{ scale: isActive ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <TearPin color={pinColor} size={pinSize} PinIcon={PinIcon} />
        </motion.div>

        {/* Name label — always visible; expanded on active */}
        {isActive ? (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap glass rounded-xl px-3 py-1.5 text-xs font-semibold text-white shadow-lg z-10"
            style={{ border: `1px solid ${pinColor}50` }}
          >
            {area.name}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-white/45">{getDensityLabel(area.crowdDensity)}</span>
              <span className="text-white/20">·</span>
              <span style={{ color: pinColor }}>
                {area.safetyLevel === 'safe' ? 'Safe' : area.safetyLevel === 'moderate' ? 'Moderate' : '⚠ Caution'}
              </span>
            </div>
          </motion.div>
        ) : (
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap text-[10px] font-semibold text-white/70 pointer-events-none select-none"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.6)' }}
          >
            {area.name}
          </div>
        )}
      </motion.div>
    </Marker>
  )
}

// ── Search result item ────────────────────────────────────────
function SearchResult({ area, onClick }: { area: AreaData; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${getSafetyColor(area.safetyLevel)}20` }}
      >
        <MapPin className="w-3.5 h-3.5" style={{ color: getSafetyColor(area.safetyLevel) }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/85 truncate">{area.name}</p>
        <p className="text-xs text-white/40 truncate">{area.locality}</p>
      </div>
      <Badge variant={area.safetyLevel} size="sm">{area.safetyLevel}</Badge>
    </button>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function MapView() {
  const navigate = useNavigate()
  const mapRef = useRef<MapRef>(null)
  const { activeLayers, viewState, setViewState, selectedArea, selectArea } = useMapStore()
  const { areas, source } = useAreas()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [layerPanelOpen, setLayerPanelOpen] = useState(false)
  const [hoveredAreaId] = useState<string | null>(null)

  const filteredAreas = areas.filter(
    (a) =>
      searchQuery.length > 1 &&
      (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       a.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
       a.tags.some((t) => t.includes(searchQuery.toLowerCase()))),
  )

  // GeoJSON for heatmap
  const heatmapGeoJSON = {
    type: 'FeatureCollection' as const,
    features: areas.map((a) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: a.coordinates },
      properties: { intensity: a.crowdDensity / 100 },
    })),
  }

  const flyToArea = useCallback(
    (area: AreaData) => {
      mapRef.current?.flyTo({
        center: area.coordinates,
        zoom: 14,
        duration: 800,
      })
      selectArea(area)
      setSearchQuery('')
      setSearchOpen(false)
    },
    [selectArea],
  )

  // Road recoloring + hover glow on map load
  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const style = map.getStyle()
    const roadLayerIds: string[] = []

    // Road color tiers: minor → subtle violet, secondary → medium purple, primary/motorway → bright violet
    const getRoadColor = (id: string) => {
      if (id.includes('motorway') || id.includes('trunk'))         return '#8b5cf6'
      if (id.includes('primary'))                                   return '#7c3aed'
      if (id.includes('secondary') || id.includes('tertiary'))     return '#5b21b6'
      if (id.includes('minor') || id.includes('service'))          return '#3b1a7a'
      return '#4a1d9a'
    }
    const getRoadOpacity = (id: string) => {
      if (id.includes('motorway') || id.includes('trunk'))         return 0.9
      if (id.includes('primary'))                                   return 0.78
      if (id.includes('secondary') || id.includes('tertiary'))     return 0.6
      return 0.4
    }

    style.layers.forEach((layer) => {
      if (layer.type !== 'line') return
      const srcLayer = (layer as Record<string, unknown>)['source-layer'] as string | undefined
      if (srcLayer !== 'transportation') return
      if (/rail|transit|ferry|aeroway/.test(layer.id)) return

      try {
        map.setPaintProperty(layer.id, 'line-color', getRoadColor(layer.id))
        map.setPaintProperty(layer.id, 'line-opacity', getRoadOpacity(layer.id))
        roadLayerIds.push(layer.id)
      } catch { /* layer may not support paint override */ }
    })

    // Hover: brighten all roads when cursor enters any road feature
    const handleRoadEnter = () => {
      roadLayerIds.forEach((id) => {
        try {
          map.setPaintProperty(id, 'line-opacity', Math.min(getRoadOpacity(id) + 0.3, 1))
          map.setPaintProperty(id, 'line-color', '#a78bfa')
        } catch {}
      })
      map.getCanvas().style.cursor = 'pointer'
    }
    const handleRoadLeave = () => {
      roadLayerIds.forEach((id) => {
        try {
          map.setPaintProperty(id, 'line-opacity', getRoadOpacity(id))
          map.setPaintProperty(id, 'line-color', getRoadColor(id))
        } catch {}
      })
      map.getCanvas().style.cursor = ''
    }

    roadLayerIds.forEach((id) => {
      map.on('mouseenter', id, handleRoadEnter)
      map.on('mouseleave', id, handleRoadLeave)
    })
  }, [])

  return (
    <div className="relative w-full h-screen bg-[#09090f] overflow-hidden">

      {/* ── Real map (no API key needed!) ── */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        onLoad={onMapLoad}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        onClick={() => { if (selectedArea) selectArea(null) }}
      >
        {/* Crowd heatmap layer */}
        {activeLayers.includes('crowd') && (
          <Source id="crowd-data" type="geojson" data={heatmapGeoJSON}>
            <Layer {...heatmapLayer} />
          </Source>
        )}

        {/* Area markers (shown when areas or safety layer active) */}
        {(activeLayers.includes('areas') || activeLayers.includes('safety')) &&
          areas.map((area) => (
            <AreaMarker
              key={area.id}
              area={area}
              isActive={selectedArea?.id === area.id || hoveredAreaId === area.id}
              activeLayers={activeLayers}
            />
          ))}
      </Map>

      {/* ── Top bar ── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center gap-3"
      >
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="glass w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white/90 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Search */}
        <div className="flex-1 relative">
          <div className="glass rounded-xl flex items-center gap-2 px-3.5 h-10">
            <Search className="w-4 h-4 text-white/35 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search areas, vibes, safety..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchOpen(false) }}>
                <X className="w-3.5 h-3.5 text-white/35 hover:text-white/60" />
              </button>
            )}
          </div>

          {/* Search dropdown */}
          <AnimatePresence>
            {searchOpen && searchQuery.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden border border-white/8"
              >
                {filteredAreas.length > 0 ? (
                  filteredAreas.slice(0, 5).map((area) => (
                    <SearchResult key={area.id} area={area} onClick={() => flyToArea(area)} />
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-white/35 text-center">
                    No areas found for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Layer toggle */}
        <button
          onClick={() => setLayerPanelOpen(!layerPanelOpen)}
          className={cn(
            'glass w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0',
            layerPanelOpen ? 'text-purple-400 border-purple-500/30' : 'text-white/60 hover:text-white/90',
          )}
        >
          <Layers className="w-4 h-4" />
        </button>
      </motion.div>

      {/* ── Layer panel ── */}
      <AnimatePresence>
        {layerPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-20 right-4 z-20 glass rounded-2xl p-4 border border-white/8 min-w-[140px]"
          >
            <p className="text-xs font-semibold text-white/40 mb-3">Layers</p>
            <LayerControls />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Zoom controls ── */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1"
      >
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-11 h-11 flex flex-col items-center justify-center glass rounded-xl border border-white/10 text-white/60 hover:text-purple-300 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all duration-200 group shadow-lg"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] text-white/25 font-mono mt-0.5">+</span>
        </button>
        <div className="w-px h-3 bg-white/10" />
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-11 h-11 flex flex-col items-center justify-center glass rounded-xl border border-white/10 text-white/60 hover:text-purple-300 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all duration-200 group shadow-lg"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] text-white/25 font-mono mt-0.5">−</span>
        </button>
      </motion.div>

      {/* ── Crowd density legend ── */}
      {activeLayers.includes('crowd') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-4 z-20 glass rounded-xl p-3"
        >
          <p className="text-xs text-white/35 mb-2">Crowd Density</p>
          <div className="flex items-center gap-1">
            {['#1a0030', '#4a148c', '#7b1fa2', '#aa00ff', '#e040fb'].map((c, i) => (
              <div key={i} className="rounded-sm" style={{ width: 22, height: 8, background: c }} />
            ))}
            <span className="text-xs text-white/25 ml-1">Max</span>
          </div>
        </motion.div>
      )}

      {/* ── Area count chip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 right-4 z-20 glass rounded-xl px-3 py-2 flex items-center gap-2"
      >
        <Info className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-xs text-white/45">{areas.length} areas · {source}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </motion.div>

      {/* ── Side panel ── */}
      <AreaPanel />

      {/* ── Direction drawer ── */}
      <DirectionDrawer />
    </div>
  )
}
