import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { getTarget, listEntries, listMonthlyPercentages, listMonthlyPercentagesFiltered, listQuarterlyAverages, upsertEntry, upsertTarget } from './repository'

export const renakTargetSchema = z.object({
  year: z.coerce.number().min(2000),
  month: z.coerce.number().min(1).max(12),
  target: z.coerce.number().min(0),
})

export const renakEntrySchema = z.object({
  employee_id: z.string().min(1),
  year: z.coerce.number().min(2000),
  month: z.coerce.number().min(1).max(12),
  actual: z.coerce.number().min(0),
})

export function useRenakTarget(year: number, month: number) {
  return useQuery({
    queryKey: ['renak_target', year, month],
    queryFn: () => getTarget(year, month),
    staleTime: 60_000,
  })
}

export function useUpsertRenakTarget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: upsertTarget,
    onSuccess: (_data, variables) => {
      // Invalidate specific target query
      qc.invalidateQueries({ queryKey: ['renak_target', variables.year, variables.month] })
      // Invalidate all batch targets queries to refresh table targets
      qc.invalidateQueries({ queryKey: ['renak_targets_batch'] })
      // Invalidate all summary queries to refresh recap table
      qc.invalidateQueries({ queryKey: ['renak_summary'] })
      // Invalidate quarterly averages that might be affected
      qc.invalidateQueries({ queryKey: ['renak_quarterly'] })
    },
  })
}

export function useUpsertRenakEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: upsertEntry,
    onSuccess: (_data, variables) => {
      // Invalidate monthly percentages
      qc.invalidateQueries({ queryKey: ['renak_monthly', variables.year, variables.month] })
      // Invalidate entries for the specific period
      qc.invalidateQueries({ queryKey: ['renak_entries', variables.year, variables.month] })
      // Invalidate summary queries to refresh recap table
      qc.invalidateQueries({ queryKey: ['renak_summary'] })
      // Invalidate quarterly averages that might be affected
      qc.invalidateQueries({ queryKey: ['renak_quarterly'] })
    },
  })
}

export function useRenakMonthlyPercentages(year: number, month: number) {
  return useQuery({
    queryKey: ['renak_monthly', year, month],
    queryFn: () => listMonthlyPercentages(year, month),
    staleTime: 30_000,
  })
}

export function useRenakEntries(year: number, month: number) {
  return useQuery({
    queryKey: ['renak_entries', year, month],
    queryFn: () => listEntries(year, month),
    staleTime: 30_000,
  })
}

export function useRenakSummary(filters: {
  employeeId?: string
  yearFrom?: number
  yearTo?: number
  monthFrom?: number
  monthTo?: number
}) {
  return useQuery({
    queryKey: ['renak_summary', filters],
    queryFn: () => listMonthlyPercentagesFiltered(filters),
    staleTime: 30_000,
  })
}

// Hook to fetch multiple targets for different periods
export function useRenakTargets(periods: Array<{year: number, month: number}>) {
  return useQuery({
    queryKey: ['renak_targets_batch', periods],
    queryFn: async () => {
      const targets: Record<string, number> = {}
      for (const period of periods) {
        const target = await getTarget(period.year, period.month)
        targets[`${period.year}-${period.month}`] = target?.target || 0
      }
      return targets
    },
    staleTime: 30_000,
  })
}

export function useRenakQuarterlyAverages(year: number, quarter: number) {
  return useQuery({
    queryKey: ['renak_quarterly', year, quarter],
    queryFn: () => listQuarterlyAverages(year, quarter),
    staleTime: 30_000,
  })
}


