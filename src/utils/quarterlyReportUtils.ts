/**
 * Utility functions for quarterly report calculations
 * Implements exact Excel formulas for weighted averages and final scores
 */

export interface EmployeeQuarterlyData {
  id: string;
  name: string;
  position: string;
  // Monthly KIPAPP values
  kipappMonth1: number;
  kipappMonth2: number;
  kipappMonth3: number;
  // Monthly Absen values
  absenMonth1: number;
  absenMonth2: number;
  absenMonth3: number;
  // Monthly RENAK CAN values
  renakMonth1: number;
  renakMonth2: number;
  renakMonth3: number;
}

export interface QuarterlyStats {
  rataKipapp: { min: number; max: number; range: number };
  absensi: { min: number; max: number; range: number };
  totalAbsenRenak: { min: number; max: number; range: number };
}

export interface EmployeeCalculatedData extends EmployeeQuarterlyData {
  rataKipapp: number;
  rataTertimbangKipapp: number;
  absensi: number;
  totalAbsenRenak: number;
  rataTertimbangRenakCan: number;
  final: number;
  peringkat: number;
}

/**
 * Calculate average KIPAPP value from 3 months
 */
export function calculateRataKipapp(month1: number, month2: number, month3: number): number {
  return (month1 + month2 + month3) / 3;
}

/**
 * Calculate attendance percentage from absent days and working days
 * Formula: ((working_days - absent_days) / working_days) × 100
 */
export function calculateAbsensiPercentage(absentDays: number, workingDays: number): number {
  if (workingDays === 0) return 0;
  return Math.round(((workingDays - absentDays) / workingDays) * 100);
}

/**
 * Calculate weighted average for KIPAPP using Excel formula
 * Excel: K$39-(F$39-F2)*K$40/F$40
 * Code: maxAbsensi - ((maxRataKipapp - employeeRataKipapp) * rangeAbsensi / rangeRataKipapp)
 */
export function calculateRataTertimbangKipapp(
  rataKipapp: number,
  maxAbsensi: number,
  rangeAbsensi: number,
  maxRataKipapp: number,
  rangeRataKipapp: number
): number {
  if (rangeRataKipapp === 0) return maxAbsensi; // All employees have same KIPAPP score
  return maxAbsensi - ((maxRataKipapp - rataKipapp) * rangeAbsensi / rangeRataKipapp);
}

/**
 * Calculate weighted average for RENAK CAN using Excel formula
 * Excel: K$39-(O$39-O2)*K$40/O$40
 * Code: maxAbsensi - ((maxTotalRenak - employeeTotalRenak) * rangeAbsensi / rangeTotalRenak)
 */
export function calculateRataTertimbangRenakCan(
  totalRenak: number,
  maxAbsensi: number,
  rangeAbsensi: number,
  maxTotalRenak: number,
  rangeTotalRenak: number
): number {
  if (rangeTotalRenak === 0) return maxAbsensi; // All employees have same RENAK total
  return maxAbsensi - ((maxTotalRenak - totalRenak) * rangeAbsensi / rangeTotalRenak);
}

/**
 * Calculate final score using Excel formula
 * Excel: (0.4*G2)+(0.4*K2)+(0.2*P2)
 * Code: (0.4 * rataTertimbangKipapp) + (0.4 * absensi) + (0.2 * rataTertimbangRenakCan)
 */
export function calculateFinalScore(
  rataTertimbangKipapp: number,
  absensi: number,
  rataTertimbangRenakCan: number
): number {
  return (0.4 * rataTertimbangKipapp) + (0.4 * absensi) + (0.2 * rataTertimbangRenakCan);
}

/**
 * Calculate quarterly statistics (min, max, range) for all employees
 */
export function calculateQuarterlyStats(employees: EmployeeQuarterlyData[], workingDaysPerMonth: number[]): QuarterlyStats {
  const rataKipappValues: number[] = [];
  const absensiValues: number[] = [];
  const totalAbsenRenakValues: number[] = [];

  employees.forEach(employee => {
    // Calculate Rata Kipapp
    const rataKipapp = calculateRataKipapp(employee.kipappMonth1, employee.kipappMonth2, employee.kipappMonth3);
    rataKipappValues.push(rataKipapp);

    // Calculate ABSENSI
    const totalAbsentDays = employee.absenMonth1 + employee.absenMonth2 + employee.absenMonth3;
    const totalWorkingDays = workingDaysPerMonth[0] + workingDaysPerMonth[1] + workingDaysPerMonth[2];
    const absensi = calculateAbsensiPercentage(totalAbsentDays, totalWorkingDays);
    absensiValues.push(absensi);

    // Calculate TOTAL ABSEN RENAK
    const totalAbsenRenak = employee.renakMonth1 + employee.renakMonth2 + employee.renakMonth3;
    totalAbsenRenakValues.push(totalAbsenRenak);
  });

  const getStats = (values: number[]) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { min, max, range: max - min };
  };

  return {
    rataKipapp: getStats(rataKipappValues),
    absensi: getStats(absensiValues),
    totalAbsenRenak: getStats(totalAbsenRenakValues),
  };
}

/**
 * Process employee data and calculate all derived values
 */
export function processEmployeeData(
  employees: EmployeeQuarterlyData[],
  stats: QuarterlyStats,
  workingDaysPerMonth: number[]
): EmployeeCalculatedData[] {
  const processedEmployees = employees.map(employee => {
    // Calculate basic values
    const rataKipapp = calculateRataKipapp(employee.kipappMonth1, employee.kipappMonth2, employee.kipappMonth3);
    const totalAbsentDays = employee.absenMonth1 + employee.absenMonth2 + employee.absenMonth3;
    const totalWorkingDays = workingDaysPerMonth[0] + workingDaysPerMonth[1] + workingDaysPerMonth[2];
    const absensi = calculateAbsensiPercentage(totalAbsentDays, totalWorkingDays);
    const totalAbsenRenak = employee.renakMonth1 + employee.renakMonth2 + employee.renakMonth3;

    // Calculate weighted averages using Excel formulas
    // Using fixed values from Excel: K$39 = 100, K$40 = 20
    const maxAbsensi = 100;
    const rangeAbsensi = 20;

    const rataTertimbangKipapp = calculateRataTertimbangKipapp(
      rataKipapp,
      maxAbsensi,
      rangeAbsensi,
      stats.rataKipapp.max,
      stats.rataKipapp.range
    );

    const rataTertimbangRenakCan = calculateRataTertimbangRenakCan(
      totalAbsenRenak,
      maxAbsensi,
      rangeAbsensi,
      stats.totalAbsenRenak.max,
      stats.totalAbsenRenak.range
    );

    // Calculate final score
    const final = calculateFinalScore(rataTertimbangKipapp, absensi, rataTertimbangRenakCan);

    return {
      ...employee,
      rataKipapp,
      rataTertimbangKipapp,
      absensi,
      totalAbsenRenak,
      rataTertimbangRenakCan,
      final,
      peringkat: 0, // Will be set after sorting
    };
  });

  // Sort by final score (descending) and assign rankings
  const sortedEmployees = processedEmployees.sort((a, b) => b.final - a.final);
  sortedEmployees.forEach((employee, index) => {
    employee.peringkat = index + 1;
  });

  return sortedEmployees;
}

/**
 * Get quarter month mapping
 */
export function getQuarterMonths(quarter: number): number[] {
  switch (quarter) {
    case 1: return [1, 2, 3]; // Jan, Feb, Mar
    case 2: return [4, 5, 6]; // Apr, Mei, Jun
    case 3: return [7, 8, 9]; // Jul, Agu, Sep
    case 4: return [10, 11, 12]; // Okt, Nov, Des
    default: return [];
  }
}

/**
 * Get working days for quarter months
 */
export function getQuarterWorkingDays(quarter: number): number[] {
  const WORKING_DAYS_PER_MONTH = {
    1: 31,  // Januari
    2: 28,  // Februari (non-leap year)
    3: 31,  // Maret
    4: 30,  // April
    5: 31,  // Mei
    6: 30,  // Juni
    7: 31,  // Juli
    8: 31,  // Agustus
    9: 30,  // September
    10: 31, // Oktober
    11: 30, // November
    12: 31, // Desember
  };

  const months = getQuarterMonths(quarter);
  return months.map(month => WORKING_DAYS_PER_MONTH[month as keyof typeof WORKING_DAYS_PER_MONTH]);
}

/**
 * Format number with Indonesian decimal notation (comma instead of dot)
 */
export function formatIndonesianDecimal(value: number, decimals: number = 2): string {
  return value.toFixed(decimals).replace('.', ',');
}
