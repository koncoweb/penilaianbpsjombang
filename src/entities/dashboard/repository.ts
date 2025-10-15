import { supabase } from '@/integrations/supabase/client'

export type DashboardStats = {
  totalEmployees: number
  currentMonthKipapp: { average: number; count: number }
  currentMonthAttendance: { rate: number; totalEmployees: number; absentEmployees: number }
  recentEntries: Array<{ id: string; type: 'KIPAPP' | 'Absen'; employeeName: string; value?: string; createdAt: string }>
  performanceTrend: Array<{ month: number; year: number; average: number; monthName: string }>
  quarterlyStats?: { year: number; quarter: number; avgValue: number; totalEmployees: number }
}

const getMonthName = (monthNumber: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return months[monthNumber - 1]
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const [employeesResult, kipappResult, absenResult, recentKipappResult, recentAbsenResult, quarterlyStatsResult] =
    await Promise.all([
      supabase.from('employees').select('id'),
      supabase.from('kipapp').select('kipapp_value').eq('month', currentMonth),
      supabase.from('absen').select('employee_id, absent_days').eq('month', currentMonth),
      supabase.from('kipapp').select('id, kipapp_value, created_at, employees(name)').order('created_at', { ascending: false }),
      supabase.from('absen').select('id, absent_days, created_at, employees(name)').order('created_at', { ascending: false }),
      supabase.from('kipapp_quarterly_stats').select('*').order('year', { ascending: false }),
    ])

  const totalEmployees = employeesResult.data?.length || 0

  const kipappData = kipappResult.data || []
  const currentMonthKipapp = {
    average: kipappData.length > 0 ? kipappData.reduce((sum: number, item: any) => sum + item.kipapp_value, 0) / kipappData.length : 0,
    count: kipappData.length,
  }

  const absenData = absenResult.data || []
  const currentMonthAttendance = {
    rate: 0,
    totalEmployees: absenData.length,
    absentEmployees: absenData.filter((item: any) => item.absent_days > 0).length,
  }
  if (absenData.length > 0) {
    const totalWorkingDays = 22
    const totalExpectedDays = absenData.length * totalWorkingDays
    const totalAbsentDays = absenData.reduce((sum: number, item: any) => sum + item.absent_days, 0)
    currentMonthAttendance.rate = totalExpectedDays > 0 ? ((totalExpectedDays - totalAbsentDays) / totalExpectedDays) * 100 : 0
  }

  const recentKipapp = recentKipappResult.data?.slice(0, 3) || []
  const recentAbsen = recentAbsenResult.data?.slice(0, 2) || []
  const recentEntries = [
    ...recentKipapp.map((item: any) => ({ id: item.id, type: 'KIPAPP' as const, employeeName: item.employees?.name || 'Unknown', value: String(item.kipapp_value), createdAt: item.created_at })),
    ...recentAbsen.map((item: any) => ({ id: item.id, type: 'Absen' as const, employeeName: item.employees?.name || 'Unknown', value: `${item.absent_days} hari`, createdAt: item.created_at })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const performanceTrend: Array<{ month: number; year: number; average: number; monthName: string }> = []
  for (let i = 2; i >= 0; i--) {
    const targetMonth = currentMonth - i
    const targetYear = targetMonth <= 0 ? currentYear - 1 : currentYear
    const actualMonth = targetMonth <= 0 ? targetMonth + 12 : targetMonth
    const monthKipappData = await supabase.from('kipapp').select('kipapp_value').eq('month', actualMonth)
    const monthData = monthKipappData.data || []
    const monthAverage = monthData.length > 0 ? monthData.reduce((sum: number, item: any) => sum + item.kipapp_value, 0) / monthData.length : 0
    performanceTrend.push({ month: actualMonth, year: targetYear, average: monthAverage, monthName: getMonthName(actualMonth) })
  }

  const quarterlyData = quarterlyStatsResult.data?.[0]
  const quarterlyStats = quarterlyData
    ? { year: quarterlyData.year, quarter: quarterlyData.quarter, avgValue: quarterlyData.avg_value, totalEmployees: quarterlyData.total_employees }
    : undefined

  return { totalEmployees, currentMonthKipapp, currentMonthAttendance, recentEntries, performanceTrend, quarterlyStats }
}


