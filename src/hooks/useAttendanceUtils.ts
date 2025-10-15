import { useMemo } from 'react';
import { 
  calculateQuarterlyAttendance, 
  calculateAnnualScore, 
  calculateQuarterlyStats,
  getAttendanceScoreColor,
  getAttendanceScoreLabel,
  getQuarterName,
  getMonthName,
  type AttendanceData,
  type QuarterlyAttendance,
  type QuarterlyStats
} from '@/utils/attendanceUtils';

/**
 * Hook untuk menghitung dan memformat data absensi
 */
export function useAttendanceCalculations(data: AttendanceData) {
  return useMemo(() => {
    const quarterly = calculateQuarterlyAttendance(data);
    const annual = calculateAnnualScore(data);
    
    return {
      quarterly,
      annual,
      // Helper functions
      getScoreColor: getAttendanceScoreColor,
      getScoreLabel: getAttendanceScoreLabel,
      getQuarterName,
      getMonthName,
    };
  }, [data]);
}

/**
 * Hook untuk mendapatkan statistik absensi dari data mentah
 */
export function useAttendanceStats(attendanceData: Array<{ employee_id: string; month: number; year: number; absent_days: number }>) {
  return useMemo(() => {
    // Group by employee
    const employeeStats = new Map<string, AttendanceData>();
    
    attendanceData.forEach(({ employee_id, month, year, absent_days }) => {
      if (!employeeStats.has(employee_id)) {
        employeeStats.set(employee_id, {
          apr: 0, mei: 0, jun: 0,
          jul: 0, agu: 0, sep: 0,
          okt: 0, nov: 0, des: 0,
          jan: 0, feb: 0, mar: 0,
        });
      }
      
      const data = employeeStats.get(employee_id)!;
      
      // Map month to field
      switch (month) {
        case 1: data.jan = absent_days; break;
        case 2: data.feb = absent_days; break;
        case 3: data.mar = absent_days; break;
        case 4: data.apr = absent_days; break;
        case 5: data.mei = absent_days; break;
        case 6: data.jun = absent_days; break;
        case 7: data.jul = absent_days; break;
        case 8: data.agu = absent_days; break;
        case 9: data.sep = absent_days; break;
        case 10: data.okt = absent_days; break;
        case 11: data.nov = absent_days; break;
        case 12: data.des = absent_days; break;
      }
    });
    
    // Calculate stats for each employee
    const results = Array.from(employeeStats.entries()).map(([employee_id, data]) => ({
      employee_id,
      ...calculateQuarterlyAttendance(data),
      annual: calculateAnnualScore(data),
    }));
    
    return {
      employeeStats: results,
      totalEmployees: results.length,
      averageAnnualScore: results.length > 0 
        ? Math.round(results.reduce((sum, emp) => sum + emp.annual, 0) / results.length)
        : 0,
      bestPerformer: results.length > 0 
        ? results.reduce((best, emp) => emp.annual > best.annual ? emp : best)
        : null,
      worstPerformer: results.length > 0 
        ? results.reduce((worst, emp) => emp.annual < worst.annual ? emp : worst)
        : null,
      quarterlyStats: calculateQuarterlyStats(results),
    };
  }, [attendanceData]);
}

/**
 * Hook untuk mendapatkan data absensi dalam format yang mudah digunakan
 */
export function useAttendanceData(attendanceData: Array<{ employee_id: string; month: number; year: number; absent_days: number }>) {
  return useMemo(() => {
    // Convert raw data to AttendanceData format per employee
    const employeeMap = new Map<string, AttendanceData>();
    
    attendanceData.forEach(({ employee_id, month, absent_days }) => {
      if (!employeeMap.has(employee_id)) {
        employeeMap.set(employee_id, {
          apr: 0, mei: 0, jun: 0,
          jul: 0, agu: 0, sep: 0,
          okt: 0, nov: 0, des: 0,
          jan: 0, feb: 0, mar: 0,
        });
      }
      
      const data = employeeMap.get(employee_id)!;
      
      switch (month) {
        case 1: data.jan = absent_days; break;
        case 2: data.feb = absent_days; break;
        case 3: data.mar = absent_days; break;
        case 4: data.apr = absent_days; break;
        case 5: data.mei = absent_days; break;
        case 6: data.jun = absent_days; break;
        case 7: data.jul = absent_days; break;
        case 8: data.agu = absent_days; break;
        case 9: data.sep = absent_days; break;
        case 10: data.okt = absent_days; break;
        case 11: data.nov = absent_days; break;
        case 12: data.des = absent_days; break;
      }
    });
    
    return Array.from(employeeMap.entries()).map(([employee_id, data]) => ({
      employee_id,
      data,
      quarterly: calculateQuarterlyAttendance(data),
      annual: calculateAnnualScore(data),
    }));
  }, [attendanceData]);
}
