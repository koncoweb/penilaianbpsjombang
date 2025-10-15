import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface RenakStats {
  totalEntries: number
  currentMonthEntries: number
  completionRate: number
  targetAchievement: number
}

export function useRenakStats() {
  return useQuery({
    queryKey: ['renak-stats'],
    queryFn: async (): Promise<RenakStats> => {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1

      // Fetch total entries count
      const { count: totalEntries, error: totalError } = await supabase
        .from('renak_entries')
        .select('*', { count: 'exact', head: true })

      if (totalError) throw totalError

      // Fetch current month entries count
      const { count: currentMonthEntries, error: currentError } = await supabase
        .from('renak_entries')
        .select('*', { count: 'exact', head: true })
        .eq('year', currentYear)
        .eq('month', currentMonth)

      if (currentError) throw currentError

      // Fetch target for current month
      const { data: targetData, error: targetError } = await supabase
        .from('renak_targets')
        .select('target')
        .eq('year', currentYear)
        .eq('month', currentMonth)
        .maybeSingle()

      if (targetError) throw targetError

      const target = targetData?.target || 0
      const completionRate = target > 0 ? Math.min((currentMonthEntries || 0) / target * 100, 100) : 0
      const targetAchievement = target > 0 ? Math.round((currentMonthEntries || 0) / target * 100) : 0

      return {
        totalEntries: totalEntries || 0,
        currentMonthEntries: currentMonthEntries || 0,
        completionRate: Math.round(completionRate),
        targetAchievement: Math.min(targetAchievement, 100)
      }
    },
    staleTime: 30_000, // 30 seconds
    retry: 1
  })
}
