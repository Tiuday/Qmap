import { create } from 'zustand'

export type Layer = 'crowd' | 'safety' | 'traffic' | 'areas'
export type SafetyLevel = 'safe' | 'moderate' | 'danger'
export type VibeType = 'chill' | 'social' | 'busy' | 'restricted' | 'closed'

export interface AreaData {
  id: string
  name: string
  locality: string
  safetyLevel: SafetyLevel
  crowdDensity: number   // 0–100
  trafficLevel: number   // 0–100
  isOpen: boolean
  vibe: VibeType
  crimeRate: 'low' | 'medium' | 'high'
  bestTimeToVisit: string
  transport: string[]
  shortcutFrom: string
  coordinates: [number, number]
  description: string
  tags: string[]
  safeNearby: { name: string; type: 'cafe' | 'mall' | 'hotel' | 'hospital' | 'metro' | 'park'; note: string }[]
}

interface MapState {
  activeLayers: Layer[]
  selectedArea: AreaData | null
  isPanelOpen: boolean
  isDirectionOpen: boolean
  viewState: {
    longitude: number
    latitude: number
    zoom: number
  }

  toggleLayer: (layer: Layer) => void
  selectArea: (area: AreaData | null) => void
  setPanel: (open: boolean) => void
  setDirectionOpen: (open: boolean) => void
  setViewState: (vs: Partial<MapState['viewState']>) => void
}

export const useMapStore = create<MapState>((set) => ({
  activeLayers: ['crowd', 'safety'],
  selectedArea: null,
  isPanelOpen: false,
  isDirectionOpen: false,
  viewState: {
    longitude: 77.209,
    latitude: 28.6139,
    zoom: 12,
  },

  toggleLayer: (layer) =>
    set((s) => ({
      activeLayers: s.activeLayers.includes(layer)
        ? s.activeLayers.filter((l) => l !== layer)
        : [...s.activeLayers, layer],
    })),

  selectArea: (area) =>
    set({ selectedArea: area, isPanelOpen: area !== null }),

  setPanel: (open) =>
    set((s) => ({
      isPanelOpen: open,
      selectedArea: open ? s.selectedArea : null,
    })),

  setDirectionOpen: (open) => set({ isDirectionOpen: open }),

  setViewState: (vs) =>
    set((s) => ({ viewState: { ...s.viewState, ...vs } })),
}))
