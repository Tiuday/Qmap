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
  Layers, X, Info
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

  const dotColor =
    activeLayers.includes('safety')
      ? getSafetyColor(area.safetyLevel)
      : activeLayers.includes('crowd')
      ? `hsl(${280 - area.crowdDensity * 0.6}, 85%, 65%)`
      : '#8b5cf6'

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
        whileHover={{ scale: 1.2 }}
        className="cursor-pointer"
        style={{ position: 'relative' }}
      >
        {/* Ripple for active / high density */}
        {(isActive || area.crowdDensity > 70) && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: dotColor, opacity: 0.3, top: '-4px', left: '-4px', right: '-4px', bottom: '-4px' }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Pin */}
        <div
          className="relative z-10 rounded-full border-2 border-white/80 shadow-lg transition-all duration-200"
          style={{
            width: isActive ? 18 : 12,
            height: isActive ? 18 : 12,
            background: dotColor,
            boxShadow: isActive ? `0 0 16px ${dotColor}` : undefined,
          }}
        />

        {/* Label on active */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap glass rounded-xl px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
            style={{ border: `1px solid ${dotColor}40` }}
          >
            {area.name}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-white/45">{getDensityLabel(area.crowdDensity)}</span>
              <span className="text-white/20">·</span>
              <span style={{ color: dotColor }}>
                {area.safetyLevel === 'safe' ? 'Safe' : area.safetyLevel === 'moderate' ? 'Moderate' : '⚠ Caution'}
              </span>
            </div>
          </motion.div>
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

  return (
    <div className="relative w-full h-screen bg-[#09090f] overflow-hidden">

      {/* ── Real map (no API key needed!) ── */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
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
