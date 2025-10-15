import { supabase } from '@/integrations/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types'

export type EmployeeRow = Tables<'employees'>
export type NewEmployee = TablesInsert<'employees'>
export type UpdateEmployee = TablesUpdate<'employees'>

export async function listEmployees(search?: string): Promise<EmployeeRow[]> {
  let query = supabase.from('employees').select('*').order('created_at', { ascending: false })
  if (search && search.trim()) {
    query = query.ilike('name', `%${search.trim()}%`)
  }
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createEmployee(values: NewEmployee): Promise<EmployeeRow> {
  const { data, error } = await supabase.from('employees').insert(values).select('*').single()
  if (error) throw error
  return data
}

export async function updateEmployee(id: string, values: UpdateEmployee): Promise<EmployeeRow> {
  const { data, error } = await supabase.from('employees').update(values).eq('id', id).select('*').single()
  if (error) throw error
  return data
}

export async function deleteEmployee(id: string): Promise<void> {
  const { error } = await supabase.from('employees').delete().eq('id', id)
  if (error) throw error
}


