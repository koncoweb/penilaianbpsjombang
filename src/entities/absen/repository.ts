import { supabase } from '@/integrations/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types'

export type AbsenRow = Tables<'absen'> & { employees?: { name: string } }
export type NewAbsen = TablesInsert<'absen'>
export type UpdateAbsen = TablesUpdate<'absen'>

export async function listAbsen(): Promise<AbsenRow[]> {
  const { data, error } = await supabase
    .from('absen')
    .select('*, employees(name)')
    .order('year', { ascending: false })
  if (error) throw error
  return (data as AbsenRow[]) ?? []
}

export async function listAbsenYears(): Promise<number[]> {
  const { data, error } = await supabase
    .from('absen')
    .select('year')
    .order('year', { ascending: false })
  if (error) throw error
  const years = [...new Set((data ?? []).map((r: any) => r.year))] as number[]
  return years.sort((a, b) => b - a)
}

export async function createAbsen(values: NewAbsen): Promise<void> {
  const { error } = await supabase.from('absen').insert(values)
  if (error) throw error
}

export async function updateAbsen(id: string, values: UpdateAbsen): Promise<void> {
  const { error } = await supabase.from('absen').update(values).eq('id', id)
  if (error) throw error
}

export async function deleteAbsen(id: string): Promise<void> {
  const { error } = await supabase.from('absen').delete().eq('id', id)
  if (error) throw error
}


