export type SafetyLevel = 'safe' | 'moderate' | 'danger'
export type CrimeRate = 'low' | 'medium' | 'high'
export type VibeType = 'chill' | 'social' | 'busy' | 'restricted' | 'closed'
export type ReactionType = 'helpful' | 'safe_vibe' | 'avoid' | 'packed' | 'chill_vibe' | 'accurate'
export type ReportType = 'unsafe' | 'closed' | 'overcrowded' | 'incorrect_info'

export interface Database {
  public: {
    Tables: {
      areas: {
        Row: {
          id: string
          name: string
          locality: string
          safety_level: SafetyLevel
          crowd_density: number
          traffic_level: number
          is_open: boolean
          vibe: VibeType
          crime_rate: CrimeRate
          best_time_to_visit: string
          transport: string[]
          shortcut_from: string
          lng: number
          lat: number
          description: string
          tags: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['areas']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['areas']['Insert']>
      }
      reactions: {
        Row: {
          id: string
          area_id: string
          reaction_type: ReactionType
          user_session: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['reactions']['Row'], 'id' | 'created_at'>>
      }
      reports: {
        Row: {
          id: string
          area_id: string
          report_type: ReportType
          note: string | null
          user_session: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at'>>
      }
    }
  }
}

// Reaction display config
export const REACTION_CONFIG: Record<ReactionType, { emoji: string; label: string; color: string }> = {
  helpful:    { emoji: '👍', label: 'Helpful',    color: '#8b5cf6' },
  safe_vibe:  { emoji: '🛡️', label: 'Feels Safe', color: '#22c55e' },
  avoid:      { emoji: '⚠️', label: 'Avoid',      color: '#ef4444' },
  packed:     { emoji: '🔥', label: 'Packed',     color: '#f97316' },
  chill_vibe: { emoji: '✌️', label: 'Chill',      color: '#06b6d4' },
  accurate:   { emoji: '✅', label: 'Accurate',   color: '#a78bfa' },
}
