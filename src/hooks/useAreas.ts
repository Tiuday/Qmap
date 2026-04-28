import { useEffect, useState } from 'react'
import { supabase, isSupabaseReady } from '@/lib/supabase'
import { MOCK_AREAS } from '@/data/areas'
import type { AreaData } from '@/store/useMapStore'

// Maps DB row → AreaData — null-safe for all nullable Supabase fields
function rowToArea(row: Record<string, unknown>): AreaData {
  return {
    id: (row.id as string) ?? '',
    name: (row.name as string) ?? 'Unknown',
    locality: (row.locality as string) ?? '',
    safetyLevel: (row.safety_level as AreaData['safetyLevel']) ?? 'moderate',
    crowdDensity: (row.crowd_density as number) ?? 0,
    trafficLevel: (row.traffic_level as number) ?? 0,
    isOpen: (row.is_open as boolean) ?? true,
    vibe: (row.vibe as AreaData['vibe']) ?? 'chill',
    crimeRate: (row.crime_rate as AreaData['crimeRate']) ?? 'low',
    bestTimeToVisit: (row.best_time_to_visit as string) ?? 'Anytime',
    transport: (row.transport as string[]) ?? [],
    shortcutFrom: (row.shortcut_from as string) ?? '',
    coordinates: [
      (row.lng as number) ?? 77.209,
      (row.lat as number) ?? 28.613,
    ],
    description: (row.description as string) ?? '',
    tags: (row.tags as string[]) ?? [],
    safeNearby: [],
  }
}

export function useAreas() {
  const [areas, setAreas] = useState<AreaData[]>(MOCK_AREAS)
  const [loading, setLoading] = useState(isSupabaseReady)
  const [source, setSource] = useState<'mock' | 'supabase'>(
    isSupabaseReady ? 'supabase' : 'mock',
  )

  useEffect(() => {
    if (!isSupabaseReady || !supabase) return

    supabase
      .from('areas')
      .select('*')
      .order('name')
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          // Supabase connected but table empty or error — keep mock data
          setSource('mock')
        } else {
          setAreas(data.map(rowToArea))
          setSource('supabase')
        }
        setLoading(false)
      })
  }, [])

  return { areas, loading, source }
}
