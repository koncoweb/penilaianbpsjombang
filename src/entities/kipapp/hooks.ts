import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { computeQuarterlyKipapp, createKipapp, deleteKipapp, listKipapp, updateKipapp } from './repository'

export const kipappSchema = z.object({
  employee_id: z.string().min(1, 'Pegawai harus dipilih'),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
  kipapp_value: z.coerce.number().min(0),
})

export function useKipapp() {
  return useQuery({ queryKey: ['kipapp'], queryFn: listKipapp, staleTime: 60_000, retry: 1 })
}

export function useCreateKipapp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createKipapp,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kipapp'] }),
  })
}

export function useUpdateKipapp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: { kipapp_value?: number } }) => updateKipapp(id, values),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kipapp'] }),
  })
}

export function useDeleteKipapp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteKipapp(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kipapp'] }),
  })
}

export function useComputeQuarterlyKipapp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (year: number) => computeQuarterlyKipapp(year),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kipapp_quarterly'] })
    },
  })
}


