import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { createAbsen, deleteAbsen, listAbsen, listAbsenYears, updateAbsen } from './repository'

export const absenSchema = z.object({
  employee_id: z.string().min(1),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
  absent_days: z.coerce.number().min(0).max(31),
})

export function useAbsen() {
  return useQuery({ queryKey: ['absen'], queryFn: listAbsen, staleTime: 60_000, retry: 1 })
}

export function useAbsenYears() {
  return useQuery({ queryKey: ['absen-years'], queryFn: listAbsenYears, staleTime: 60_000, retry: 1 })
}

export function useCreateAbsen() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createAbsen,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['absen'] })
      qc.invalidateQueries({ queryKey: ['absen-years'] })
    },
  })
}

export function useUpdateAbsen() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: { absent_days?: number } }) => updateAbsen(id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['absen'] })
      qc.invalidateQueries({ queryKey: ['absen-years'] })
    },
  })
}

export function useDeleteAbsen() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAbsen(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['absen'] })
      qc.invalidateQueries({ queryKey: ['absen-years'] })
    },
  })
}


