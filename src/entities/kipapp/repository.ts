import { supabase } from '@/integrations/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types'

export type KipappRow = Tables<'kipapp'> & { employees?: { name: string } }
export type NewKipapp = TablesInsert<'kipapp'>
export type UpdateKipapp = TablesUpdate<'kipapp'>

export async function listKipapp(): Promise<KipappRow[]> {
  const { data, error } = await supabase
    .from('kipapp')
    .select('*, employees(name)')
    .order('year', { ascending: false })
  if (error) throw error
  return (data as KipappRow[]) ?? []
}

export async function createKipapp(values: NewKipapp): Promise<KipappRow> {
  const { data, error } = await supabase
    .from('kipapp')
    .insert(values)
    .select('*, employees(name)')
    .single()
  if (error) throw error
  return data as KipappRow
}

export async function updateKipapp(id: string, values: UpdateKipapp): Promise<KipappRow> {
  const { data, error } = await supabase
    .from('kipapp')
    .update(values)
    .eq('id', id)
    .select('*, employees(name)')
    .single()
  if (error) throw error
  return data as KipappRow
}

export async function deleteKipapp(id: string): Promise<void> {
  const { error } = await supabase.from('kipapp').delete().eq('id', id)
  if (error) throw error
}

export async function computeQuarterlyKipapp(year: number): Promise<void> {
  const { error } = await supabase.rpc('compute_quarterly_kipapp', { p_year: year })
  if (error) throw error
}


