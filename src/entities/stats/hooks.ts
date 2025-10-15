import { useQuery } from '@tanstack/react-query'
import { getQuarterlyStats, listQuarterlyEmployees, listQuarterlyYears, getQuarterlyMonthlyKipapp, getQuarterlyMonthlyAbsen, getQuarterlyMonthlyRenak } from './repository'
import type { EmployeeQuarterlyData, QuarterlyStats, EmployeeCalculatedData } from '@/utils/quarterlyReportUtils'
import { processEmployeeData, calculateQuarterlyStats, getQuarterWorkingDays } from '@/utils/quarterlyReportUtils'

export function useQuarterlyYears() {
  return useQuery({ queryKey: ['kipapp-quarterly-years'], queryFn: listQuarterlyYears, staleTime: 60_000, retry: 1 })
}

export function useQuarterlyReport(year: number, quarter: number) {
  return useQuery({
    queryKey: ['quarterly-report', year, quarter],
    queryFn: async () => {
      const [stats, employees] = await Promise.all([
        getQuarterlyStats(year, quarter),
        listQuarterlyEmployees(year, quarter),
      ])
      return { stats, employees }
    },
    enabled: !!year && !!quarter,
  })
}

export function useQuarterlyReportComplete(year: number, quarter: number) {
  return useQuery({
    queryKey: ['quarterly-report-complete', year, quarter],
    queryFn: async () => {
      // Fetch all monthly data for the quarter
      const [kipappData, absenData, renakData] = await Promise.all([
        getQuarterlyMonthlyKipapp(year, quarter),
        getQuarterlyMonthlyAbsen(year, quarter),
        getQuarterlyMonthlyRenak(year, quarter),
      ])

      // Get working days for the quarter months
      const workingDaysPerMonth = getQuarterWorkingDays(quarter)

      // Process data to create EmployeeQuarterlyData array
      const employeeMap = new Map<string, EmployeeQuarterlyData>()

      // Process KIPAPP data
      kipappData.forEach((item: any) => {
        const employeeId = item.employee_id
        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            id: employeeId,
            name: item.employees?.name || '',
            position: item.employees?.position || '',
            kipappMonth1: 0,
            kipappMonth2: 0,
            kipappMonth3: 0,
            absenMonth1: 0,
            absenMonth2: 0,
            absenMonth3: 0,
            renakMonth1: 0,
            renakMonth2: 0,
            renakMonth3: 0,
          })
        }
        
        const employee = employeeMap.get(employeeId)!
        const monthIndex = getQuarterMonthIndex(item.month, quarter)
        if (monthIndex === 0) employee.kipappMonth1 = item.kipapp_value || 0
        if (monthIndex === 1) employee.kipappMonth2 = item.kipapp_value || 0
        if (monthIndex === 2) employee.kipappMonth3 = item.kipapp_value || 0
      })

      // Process Absen data
      absenData.forEach((item: any) => {
        const employeeId = item.employee_id
        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            id: employeeId,
            name: item.employees?.name || '',
            position: item.employees?.position || '',
            kipappMonth1: 0,
            kipappMonth2: 0,
            kipappMonth3: 0,
            absenMonth1: 0,
            absenMonth2: 0,
            absenMonth3: 0,
            renakMonth1: 0,
            renakMonth2: 0,
            renakMonth3: 0,
          })
        }
        
        const employee = employeeMap.get(employeeId)!
        const monthIndex = getQuarterMonthIndex(item.month, quarter)
        if (monthIndex === 0) employee.absenMonth1 = item.absent_days || 0
        if (monthIndex === 1) employee.absenMonth2 = item.absent_days || 0
        if (monthIndex === 2) employee.absenMonth3 = item.absent_days || 0
      })

      // Process RENAK CAN data
      renakData.forEach((item: any) => {
        const employeeId = item.employee_id
        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            id: employeeId,
            name: item.employees?.name || '',
            position: item.employees?.position || '',
            kipappMonth1: 0,
            kipappMonth2: 0,
            kipappMonth3: 0,
            absenMonth1: 0,
            absenMonth2: 0,
            absenMonth3: 0,
            renakMonth1: 0,
            renakMonth2: 0,
            renakMonth3: 0,
          })
        }
        
        const employee = employeeMap.get(employeeId)!
        const monthIndex = getQuarterMonthIndex(item.month, quarter)
        if (monthIndex === 0) employee.renakMonth1 = item.actual || 0
        if (monthIndex === 1) employee.renakMonth2 = item.actual || 0
        if (monthIndex === 2) employee.renakMonth3 = item.actual || 0
      })

      const employees = Array.from(employeeMap.values())

      // Calculate statistics
      const stats = calculateQuarterlyStats(employees, workingDaysPerMonth)

      // Process all calculations
      const calculatedEmployees = processEmployeeData(employees, stats, workingDaysPerMonth)

      return {
        employees: calculatedEmployees,
        stats,
        rawData: {
          kipappData,
          absenData,
          renakData,
        }
      }
    },
    enabled: !!year && !!quarter,
  })
}

/**
 * Helper function to get month index within a quarter (0, 1, or 2)
 */
function getQuarterMonthIndex(month: number, quarter: number): number {
  const quarterMonths = {
    1: [1, 2, 3],   // Jan, Feb, Mar
    2: [4, 5, 6],   // Apr, Mei, Jun
    3: [7, 8, 9],   // Jul, Agu, Sep
    4: [10, 11, 12], // Okt, Nov, Des
  }
  
  const months = quarterMonths[quarter as keyof typeof quarterMonths] || []
  return months.indexOf(month)
}


