import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useEmployees } from '@/entities/employees/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRenakEntries, useRenakSummary, useRenakTarget, useRenakTargets, useUpsertRenakEntry, useUpsertRenakTarget } from '@/entities/renakcan/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { calculateRenakPercentage, formatIdDecimal2 } from '@/utils/renakUtils'

const months = [
  'Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'
]

const RenakCan = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)

  // Summary filters
  const [summaryFilters, setSummaryFilters] = useState({
    employeeId: 'all',
    yearFrom: new Date().getFullYear(),
    yearTo: new Date().getFullYear(),
    monthFrom: 1,
    monthTo: 12,
  })

  const { data: employees = [] } = useEmployees()

  const { data: targetRow } = useRenakTarget(year, month)
  const upsertTarget = useUpsertRenakTarget()

  const [targetValue, setTargetValue] = useState<string>('0')
  useEffect(() => {
    setTargetValue(String(targetRow?.target ?? 0))
  }, [targetRow?.target])

  // Load existing entries for the selected period
  const { data: existingEntries = [] } = useRenakEntries(year, month)
  const employeeIdToActual = useMemo(() => {
    const map = new Map<string, number>()
    for (const entry of existingEntries) {
      map.set(entry.employee_id, entry.actual)
    }
    return map
  }, [existingEntries])

  const upsertEntry = useUpsertRenakEntry()

  // Per-row state management
  type RowData = {
    employeeId: string
    year: number
    month: number
    actual: string
  }
  const [rowData, setRowData] = useState<Record<string, RowData>>({})

  // Get all unique periods from row data for batch target fetching
  const periods = useMemo(() => {
    const uniquePeriods = new Set<string>()
    
    // Always include current period
    uniquePeriods.add(`${year}-${month}`)
    
    // Add periods from row data
    Object.values(rowData).forEach(row => {
      if (row.year && row.month) {
        uniquePeriods.add(`${row.year}-${row.month}`)
      }
    })
    
    return Array.from(uniquePeriods).map(period => {
      const [year, month] = period.split('-').map(Number)
      return { year, month }
    })
  }, [rowData, year, month])

  // Fetch targets for all periods used in rows
  const { data: targetsMap = {} } = useRenakTargets(periods)

  // Refresh targets when period changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['renak_targets_batch'] })
  }, [year, month, queryClient])

  // Summary data - only apply filters when they're not default values
  const shouldFilterEmployee = summaryFilters.employeeId !== 'all'
  const shouldFilterYear = summaryFilters.yearFrom !== new Date().getFullYear() || summaryFilters.yearTo !== new Date().getFullYear()
  const shouldFilterMonth = summaryFilters.monthFrom !== 1 || summaryFilters.monthTo !== 12
  
  const { data: summaryData = [] } = useRenakSummary({
    employeeId: shouldFilterEmployee ? summaryFilters.employeeId : undefined,
    yearFrom: shouldFilterYear ? summaryFilters.yearFrom : undefined,
    yearTo: shouldFilterYear ? summaryFilters.yearTo : undefined,
    monthFrom: shouldFilterMonth ? summaryFilters.monthFrom : undefined,
    monthTo: shouldFilterMonth ? summaryFilters.monthTo : undefined,
  })
  
  // Compute summary statistics
  const summaryStats = useMemo(() => {
    const grouped = new Map<string, number[]>()
    
    for (const row of summaryData as any[]) {
      if (row.employee_id && row.percent != null) {
        if (!grouped.has(row.employee_id)) {
          grouped.set(row.employee_id, [])
        }
        grouped.get(row.employee_id)!.push(row.percent)
      }
    }
    
    const results: Array<{
      employeeId: string
      employeeName: string
      average: number
      min: number
      max: number
      range: number
    }> = []
    
    for (const [employeeId, percentages] of grouped) {
      const employee = employees.find(emp => emp.id === employeeId)
      if (employee && percentages.length > 0) {
        const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length
        const min = Math.min(...percentages)
        const max = Math.max(...percentages)
        const range = max - min
        
        results.push({
          employeeId,
          employeeName: employee.name,
          average: avg,
          min,
          max,
          range,
        })
      }
    }
    
    return results.sort((a, b) => b.average - a.average)
  }, [summaryData, employees])

  const handleSaveTarget = async () => {
    const numeric = parseFloat(targetValue.replace(',', '.'))
    
    try {
      await upsertTarget.mutateAsync({ year, month, target: isNaN(numeric) ? 0 : numeric })
      const action = targetRow && targetRow.target > 0 ? 'diperbarui' : 'disimpan'
      toast({ title: `Target ${action}` })
    } catch (e: any) {
      toast({ title: 'Gagal simpan target', description: e.message, variant: 'destructive' })
    }
  }

  // Initialize row data for each employee
  useEffect(() => {
    const newRowData: Record<string, RowData> = {}
    employees.forEach(emp => {
      // Always initialize with current year/month as defaults
      // If row exists, preserve actual value but update year/month
      const existingRow = rowData[emp.id]
      newRowData[emp.id] = {
        employeeId: emp.id,
        year: year,
        month: month,
        actual: existingRow?.actual || ''
      }
    })
    setRowData(newRowData)
  }, [employees, year, month])

  // Prefill actuals from existing entries for current period
  useEffect(() => {
    const updatedRowData = { ...rowData }
    for (const entry of existingEntries) {
      // Only prefill if the entry matches current period
      if (entry.employee_id && entry.year === year && entry.month === month) {
        if (updatedRowData[entry.employee_id]) {
          updatedRowData[entry.employee_id].actual = String(entry.actual)
        }
      }
    }
    setRowData(updatedRowData)
  }, [existingEntries, year, month])

  // Calculate live percentage for an employee row
  const calculateLivePercentage = (employeeId: string) => {
    const row = rowData[employeeId]
    if (!row) return 0
    
    // Ensure we have valid year/month values
    const calcYear = row.year || year
    const calcMonth = row.month || month
    
    // Get target for this specific period
    const targetKey = `${calcYear}-${calcMonth}`
    const targetNum = targetsMap[targetKey] || 0
    const actualNum = parseFloat(row.actual.replace(',', '.')) || 0
    return calculateRenakPercentage(actualNum, targetNum)
  }

  const handleSaveRow = async (employeeId: string) => {
    const row = rowData[employeeId]
    if (!row) return
    
    // Ensure we have valid year/month values
    const saveYear = row.year || year
    const saveMonth = row.month || month
    
    if (!saveYear || !saveMonth) {
      toast({ 
        title: 'Data tidak lengkap', 
        description: 'Tahun dan bulan harus dipilih', 
        variant: 'destructive' 
      })
      return
    }
    
    const val = parseFloat(row.actual.replace(',', '.'))
    try {
      await upsertEntry.mutateAsync({ 
        employee_id: employeeId, 
        year: saveYear, 
        month: saveMonth, 
        actual: isNaN(val) ? 0 : val 
      })
      toast({ title: 'Realisasi disimpan' })
    } catch (e: any) {
      toast({ title: 'Gagal simpan realisasi', description: e.message, variant: 'destructive' })
    }
  }

  const updateRowData = (employeeId: string, field: keyof RowData, value: string | number) => {
    setRowData(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">RENAK CAN - Target & Realisasi</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Periode & Target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium mb-2 block">Bulan</label>
              <Select value={String(month)} onValueChange={(v) => setMonth(parseInt(v))}>
                <SelectTrigger><SelectValue placeholder="Bulan" /></SelectTrigger>
                <SelectContent>
                  {months.map((m, idx) => (
                    <SelectItem key={m} value={String(idx + 1)}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tahun</label>
              <Select value={String(year)} onValueChange={(v) => setYear(parseInt(v))}>
                <SelectTrigger><SelectValue placeholder="Tahun" /></SelectTrigger>
                <SelectContent>
                  {[year, year-1, year-2].map(y => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Target</label>
              <Input value={targetValue}
                     onChange={(e) => setTargetValue(e.target.value)}
                     inputMode="decimal" placeholder="0" />
              {targetRow && targetRow.target > 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  Target sudah ada: {formatIdDecimal2(targetRow.target)}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveTarget} 
                disabled={upsertTarget.isPending} 
                variant={targetRow && targetRow.target > 0 ? "outline" : "default"}
                className="flex-1"
              >
                {targetRow && targetRow.target > 0 ? "Update Target" : "Simpan Target"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Input Realisasi per Pegawai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Bulan</TableHead>
                <TableHead>Tahun</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Realisasi</TableHead>
                <TableHead className="text-right">Persentase</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => {
                const row = rowData[emp.id]
                const livePercent = calculateLivePercentage(emp.id)
                return (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.nip}</TableCell>
                    <TableCell className="w-[120px]">
                      <Select 
                        value={String(row?.month || month)} 
                        onValueChange={(v) => updateRowData(emp.id, 'month', parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m, idx) => (
                            <SelectItem key={m} value={String(idx + 1)}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="w-[100px]">
                      <Select 
                        value={String(row?.year || year)} 
                        onValueChange={(v) => updateRowData(emp.id, 'year', parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[year, year-1, year-2].map(y => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="w-[100px] text-center">
                      <span className={`text-sm ${targetsMap[`${row?.year || year}-${row?.month || month}`] > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {targetsMap[`${row?.year || year}-${row?.month || month}`] > 0 
                          ? formatIdDecimal2(targetsMap[`${row?.year || year}-${row?.month || month}`])
                          : 'Belum ada target'
                        }
                      </span>
                    </TableCell>
                    <TableCell className="w-[120px]">
                      <Input
                        value={row?.actual ?? ''}
                        onChange={(e) => updateRowData(emp.id, 'actual', e.target.value)}
                        placeholder="0"
                        inputMode="decimal"
                      />
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatIdDecimal2(livePercent)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleSaveRow(emp.id)} disabled={upsertEntry.isPending}>Simpan</Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rekapitulasi RENAK CAN</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Pegawai</label>
              <Select 
                value={summaryFilters.employeeId} 
                onValueChange={(value) => setSummaryFilters(prev => ({ ...prev, employeeId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Pegawai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Pegawai</SelectItem>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tahun Dari</label>
              <Select 
                value={String(summaryFilters.yearFrom)} 
                onValueChange={(value) => setSummaryFilters(prev => ({ ...prev, yearFrom: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025, 2026].map(y => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tahun Sampai</label>
              <Select 
                value={String(summaryFilters.yearTo)} 
                onValueChange={(value) => setSummaryFilters(prev => ({ ...prev, yearTo: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025, 2026].map(y => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Bulan Dari</label>
              <Select 
                value={String(summaryFilters.monthFrom)} 
                onValueChange={(value) => setSummaryFilters(prev => ({ ...prev, monthFrom: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m, idx) => (
                    <SelectItem key={m} value={String(idx + 1)}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Bulan Sampai</label>
              <Select 
                value={String(summaryFilters.monthTo)} 
                onValueChange={(value) => setSummaryFilters(prev => ({ ...prev, monthTo: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m, idx) => (
                    <SelectItem key={m} value={String(idx + 1)}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setSummaryFilters({
                  employeeId: 'all',
                  yearFrom: new Date().getFullYear(),
                  yearTo: new Date().getFullYear(),
                  monthFrom: 1,
                  monthTo: 12,
                })}
                className="w-full"
              >
                Reset Filter
              </Button>
            </div>
          </div>

          {/* Summary Table */}
          {summaryStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data untuk filter ini
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pegawai</TableHead>
                  <TableHead className="text-right">Rata-rata Persentase</TableHead>
                  <TableHead className="text-right">Min</TableHead>
                  <TableHead className="text-right">Max</TableHead>
                  <TableHead className="text-right">Range</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryStats.map((stat) => (
                  <TableRow key={stat.employeeId}>
                    <TableCell className="font-medium">{stat.employeeName}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatIdDecimal2(stat.average)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIdDecimal2(stat.min)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIdDecimal2(stat.max)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIdDecimal2(stat.range)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RenakCan


