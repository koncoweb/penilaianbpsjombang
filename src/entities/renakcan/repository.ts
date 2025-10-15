import { supabase } from '@/integrations/supabase/client'
import type { Tables, TablesInsert } from '@/integrations/supabase/types'

export type RenakTargetRow = Tables<'renak_targets'>
export type RenakEntryRow = Tables<'renak_entries'>

export async function getTarget(year: number, month: number): Promise<RenakTargetRow | null> {
  const { data, error } = await supabase
    .from('renak_targets')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function upsertTarget(values: TablesInsert<'renak_targets'>): Promise<RenakTargetRow> {
  const { data, error } = await supabase
    .from('renak_targets')
    .upsert(values, { onConflict: 'year,month' })
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function upsertEntry(values: TablesInsert<'renak_entries'>): Promise<RenakEntryRow> {
  const { data, error } = await supabase
    .from('renak_entries')
    .upsert(values, { onConflict: ['employee_id', 'year', 'month'] })
    .select('*')
  if (error) throw error
  return data?.[0]
}

export async function listMonthlyPercentages(year: number, month: number) {
  const { data, error } = await supabase
    .from('renak_monthly_percentages')
    .select('*')
    .eq('year', year)
    .eq('month', month)
  if (error) throw error
  return data ?? []
}

export async function listEntries(year: number, month: number) {
  const { data, error } = await supabase
    .from('renak_entries')
    .select('*')
    .eq('year', year)
    .eq('month', month)
  if (error) throw error
  return data ?? []
}

export async function listMonthlyPercentagesFiltered(filters: {
  employeeId?: string
  yearFrom?: number
  yearTo?: number
  monthFrom?: number
  monthTo?: number
}) {
  let query = supabase.from('renak_monthly_percentages').select('*')
  
  // Only apply filters if they are provided (not undefined)
  if (filters.employeeId !== undefined) {
    query = query.eq('employee_id', filters.employeeId)
  }
  if (filters.yearFrom !== undefined) {
    query = query.gte('year', filters.yearFrom)
  }
  if (filters.yearTo !== undefined) {
    query = query.lte('year', filters.yearTo)
  }
  if (filters.monthFrom !== undefined) {
    query = query.gte('month', filters.monthFrom)
  }
  if (filters.monthTo !== undefined) {
    query = query.lte('month', filters.monthTo)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function listQuarterlyAverages(year: number, quarter: number) {
  const { data, error } = await supabase
    .from('renak_quarterly_averages')
    .select('*')
    .eq('year', year)
    .eq('quarter', quarter)
  if (error) throw error
  return data ?? []
}


