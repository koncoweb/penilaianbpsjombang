import { supabase } from '@/integrations/supabase/client'
import type { Tables } from '@/integrations/supabase/types'

export type QuarterlyStatsRow = Tables<'kipapp_quarterly_stats'>

export async function listQuarterlyYears(): Promise<number[]> {
  const { data, error } = await supabase
    .from('kipapp_quarterly')
    .select('year')
    .order('year', { ascending: false })
  if (error) throw error
  const years = [...new Set((data ?? []).map((r: any) => r.year))] as number[]
  return years.length ? years : [new Date().getFullYear()]
}

export async function getQuarterlyStats(year: number, quarter: number): Promise<QuarterlyStatsRow> {
  const { data, error } = await supabase
    .from('kipapp_quarterly_stats')
    .select('*')
    .eq('year', year)
    .eq('quarter', quarter)
    .maybeSingle()
  if (error) throw error
  if (!data) throw new Error(`Belum ada data statistik untuk Triwulan ${quarter} tahun ${year}.`)
  return data
}

export async function listQuarterlyEmployees(year: number, quarter: number): Promise<Array<{ id: string; name: string; position: string; avg_value: number }>> {
  const { data, error } = await supabase
    .from('kipapp_quarterly')
    .select('id, avg_value, employees(name, position)')
    .eq('year', year)
    .eq('quarter', quarter)
  if (error) throw error
  return (data ?? []).map((item: any) => ({ id: item.id, name: item.employees.name, position: item.employees.position, avg_value: item.avg_value }))
    .sort((a, b) => b.avg_value - a.avg_value)
}

/**
 * Get quarterly months based on quarter number
 */
function getQuarterMonths(quarter: number): number[] {
  switch (quarter) {
    case 1: return [1, 2, 3]; // Jan, Feb, Mar
    case 2: return [4, 5, 6]; // Apr, Mei, Jun
    case 3: return [7, 8, 9]; // Jul, Agu, Sep
    case 4: return [10, 11, 12]; // Okt, Nov, Des
    default: return [];
  }
}

/**
 * Fetch monthly KIPAPP data for a specific quarter
 */
export async function getQuarterlyMonthlyKipapp(year: number, quarter: number) {
  const months = getQuarterMonths(quarter);
  
  const { data, error } = await supabase
    .from('kipapp')
    .select('employee_id, month, kipapp_value, employees(id, name, position)')
    .eq('year', year)
    .in('month', months)
    .order('employee_id')
    .order('month')
  
  if (error) throw error
  return data ?? []
}

/**
 * Fetch monthly attendance data for a specific quarter
 */
export async function getQuarterlyMonthlyAbsen(year: number, quarter: number) {
  const months = getQuarterMonths(quarter);
  
  const { data, error } = await supabase
    .from('absen')
    .select('employee_id, month, absent_days, employees(id, name, position)')
    .eq('year', year)
    .in('month', months)
    .order('employee_id')
    .order('month')
  
  if (error) throw error
  return data ?? []
}

/**
 * Fetch monthly RENAK CAN data for a specific quarter
 */
export async function getQuarterlyMonthlyRenak(year: number, quarter: number) {
  const months = getQuarterMonths(quarter);
  
  const { data, error } = await supabase
    .from('renak_entries')
    .select('employee_id, month, actual, employees(id, name, position)')
    .eq('year', year)
    .in('month', months)
    .order('employee_id')
    .order('month')
  
  if (error) throw error
  return data ?? []
}


