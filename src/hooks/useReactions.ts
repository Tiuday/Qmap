import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseReady, getSessionId } from '@/lib/supabase'
import type { ReactionType } from '@/lib/database.types'

export type ReactionCounts = Record<ReactionType, number>
export type UserReactions = Set<ReactionType>

const EMPTY_COUNTS: ReactionCounts = {
  helpful: 0, safe_vibe: 0, avoid: 0,
  packed: 0, chill_vibe: 0, accurate: 0,
}

export function useReactions(areaId: string) {
  const [counts, setCounts] = useState<ReactionCounts>({ ...EMPTY_COUNTS })
  const [userReactions, setUserReactions] = useState<UserReactions>(new Set())
  const [loading, setLoading] = useState(false)

  // Load counts + this user's own reactions whenever areaId changes
  useEffect(() => {
    if (!isSupabaseReady || !supabase || !areaId) return

    setLoading(true)
    setCounts({ ...EMPTY_COUNTS })
    setUserReactions(new Set())

    const session = getSessionId()
    type Row = { reaction_type: ReactionType }

    Promise.all([
      supabase.from('reactions').select('reaction_type').eq('area_id', areaId),
      supabase.from('reactions').select('reaction_type').eq('area_id', areaId).eq('user_session', session),
    ]).then(([allRes, userRes]) => {
      const allData = allRes.data as Row[] | null
      const userData = userRes.data as Row[] | null

      if (allData) {
        const c = { ...EMPTY_COUNTS }
        allData.forEach((r) => { if (r.reaction_type in c) c[r.reaction_type]++ })
        setCounts(c)
      }
      if (userData) {
        setUserReactions(new Set(userData.map((r) => r.reaction_type)))
      }
      setLoading(false)
    })
  }, [areaId])

  const toggleReaction = useCallback(
    async (type: ReactionType) => {
      if (!isSupabaseReady || !supabase) return

      const session = getSessionId()
      const hasIt = userReactions.has(type)

      // Optimistic update — instant UI feedback
      setCounts((prev) => ({
        ...prev,
        [type]: Math.max(0, prev[type] + (hasIt ? -1 : 1)),
      }))
      setUserReactions((prev) => {
        const next = new Set(prev)
        hasIt ? next.delete(type) : next.add(type)
        return next
      })

      if (hasIt) {
        await supabase
          .from('reactions')
          .delete()
          .eq('area_id', areaId)
          .eq('reaction_type', type)
          .eq('user_session', session)
      } else {
        // Type assertion needed: Supabase generic inference fails on custom DB types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('reactions') as any).upsert({
          area_id: areaId,
          reaction_type: type,
          user_session: session,
        })
      }
    },
    [areaId, userReactions],
  )

  return { counts, userReactions, loading, toggleReaction }
}
