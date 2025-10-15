import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { createEmployee, deleteEmployee, listEmployees, updateEmployee } from './repository'

export const employeeSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  nip: z.string().min(1, 'NIP harus diisi'),
  position: z.string().min(1, 'Jabatan harus diisi'),
})

export function useEmployees(search?: string) {
  return useQuery({
    queryKey: ['employees', search ?? ''],
    queryFn: () => listEmployees(search),
    staleTime: 60_000,
    retry: 1,
  })
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

export function useUpdateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: { name?: string; nip?: string; position?: string } }) => updateEmployee(id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

export function useDeleteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}


