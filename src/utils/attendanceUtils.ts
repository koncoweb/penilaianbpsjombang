/**
 * Utility functions for attendance score calculations
 * Used across multiple pages to ensure consistency
 */

export interface AttendanceData {
  apr: number;
  mei: number;
  jun: number;
  jul: number;
  agu: number;
  sep: number;
  okt: number;
  nov: number;
  des: number;
  jan: number;
  feb: number;
  mar: number;
}

export interface QuarterlyAttendance {
  q1: {
    apr: number;
    mei: number;
    jun: number;
    total: number;
    score: number;
  };
  q2: {
    jul: number;
    agu: number;
    sep: number;
    total: number;
    score: number;
  };
  q3: {
    okt: number;
    nov: number;
    des: number;
    total: number;
    score: number;
  };
  q4: {
    jan: number;
    feb: number;
    mar: number;
    total: number;
    score: number;
  };
}

export interface QuarterlyStats {
  q1: { min: number; max: number; range: number; avg: number };
  q2: { min: number; max: number; range: number; avg: number };
  q3: { min: number; max: number; range: number; avg: number };
  q4: { min: number; max: number; range: number; avg: number };
}

/**
 * Working days per month (assuming standard working days)
 */
export const WORKING_DAYS_PER_MONTH = {
  jan: 31, // January
  feb: 28, // February (non-leap year)
  mar: 31, // March
  apr: 30, // April
  mei: 31, // May
  jun: 30, // June
  jul: 31, // July
  agu: 31, // August
  sep: 30, // September
  okt: 31, // October
  nov: 30, // November
  des: 31, // December
} as const;

/**
 * Calculate attendance score for a quarter
 * Formula: ((Working days - Absent days) / Working days) × 100%
 */
export function calculateQuarterlyScore(
  absentDays: number,
  workingDays: number
): number {
  if (workingDays === 0) return 0;
  return Math.round(((workingDays - absentDays) / workingDays) * 100);
}

/**
 * Get working days for a specific quarter
 */
export function getQuarterlyWorkingDays(quarter: 1 | 2 | 3 | 4): number {
  switch (quarter) {
    case 1: // Apr, Mei, Jun
      return WORKING_DAYS_PER_MONTH.apr + WORKING_DAYS_PER_MONTH.mei + WORKING_DAYS_PER_MONTH.jun;
    case 2: // Jul, Agu, Sep
      return WORKING_DAYS_PER_MONTH.jul + WORKING_DAYS_PER_MONTH.agu + WORKING_DAYS_PER_MONTH.sep;
    case 3: // Okt, Nov, Des
      return WORKING_DAYS_PER_MONTH.okt + WORKING_DAYS_PER_MONTH.nov + WORKING_DAYS_PER_MONTH.des;
    case 4: // Jan, Feb, Mar
      return WORKING_DAYS_PER_MONTH.jan + WORKING_DAYS_PER_MONTH.feb + WORKING_DAYS_PER_MONTH.mar;
    default:
      return 0;
  }
}

/**
 * Calculate quarterly attendance data from monthly data
 */
export function calculateQuarterlyAttendance(data: AttendanceData): QuarterlyAttendance {
  // Q1: Apr, Mei, Jun
  const q1WorkingDays = getQuarterlyWorkingDays(1);
  const q1Total = data.apr + data.mei + data.jun;
  const q1Score = calculateQuarterlyScore(q1Total, q1WorkingDays);

  // Q2: Jul, Agu, Sep
  const q2WorkingDays = getQuarterlyWorkingDays(2);
  const q2Total = data.jul + data.agu + data.sep;
  const q2Score = calculateQuarterlyScore(q2Total, q2WorkingDays);

  // Q3: Okt, Nov, Des
  const q3WorkingDays = getQuarterlyWorkingDays(3);
  const q3Total = data.okt + data.nov + data.des;
  const q3Score = calculateQuarterlyScore(q3Total, q3WorkingDays);

  // Q4: Jan, Feb, Mar
  const q4WorkingDays = getQuarterlyWorkingDays(4);
  const q4Total = data.jan + data.feb + data.mar;
  const q4Score = calculateQuarterlyScore(q4Total, q4WorkingDays);

  return {
    q1: {
      apr: data.apr,
      mei: data.mei,
      jun: data.jun,
      total: q1Total,
      score: q1Score,
    },
    q2: {
      jul: data.jul,
      agu: data.agu,
      sep: data.sep,
      total: q2Total,
      score: q2Score,
    },
    q3: {
      okt: data.okt,
      nov: data.nov,
      des: data.des,
      total: q3Total,
      score: q3Score,
    },
    q4: {
      jan: data.jan,
      feb: data.feb,
      mar: data.mar,
      total: q4Total,
      score: q4Score,
    },
  };
}

/**
 * Get attendance score color class based on score
 */
export function getAttendanceScoreColor(score: number): string {
  if (score >= 90) return 'bg-green-100 text-green-800';
  if (score >= 80) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

/**
 * Get attendance score label based on score
 */
export function getAttendanceScoreLabel(score: number): string {
  if (score >= 90) return 'Sangat Baik';
  if (score >= 80) return 'Baik';
  if (score >= 70) return 'Cukup';
  return 'Kurang';
}

/**
 * Calculate overall annual attendance score
 */
export function calculateAnnualScore(data: AttendanceData): number {
  const totalWorkingDays = Object.values(WORKING_DAYS_PER_MONTH).reduce((sum, days) => sum + days, 0);
  const totalAbsentDays = Object.values(data).reduce((sum, days) => sum + days, 0);
  
  return calculateQuarterlyScore(totalAbsentDays, totalWorkingDays);
}

/**
 * Get month name in Indonesian
 */
export function getMonthName(month: keyof typeof WORKING_DAYS_PER_MONTH): string {
  const monthNames: Record<keyof typeof WORKING_DAYS_PER_MONTH, string> = {
    jan: 'Januari',
    feb: 'Februari',
    mar: 'Maret',
    apr: 'April',
    mei: 'Mei',
    jun: 'Juni',
    jul: 'Juli',
    agu: 'Agustus',
    sep: 'September',
    okt: 'Oktober',
    nov: 'November',
    des: 'Desember',
  };
  
  return monthNames[month];
}

/**
 * Get quarter name in Indonesian
 */
export function getQuarterName(quarter: 1 | 2 | 3 | 4): string {
  const quarterNames = {
    1: 'Triwulan 1 (Apr-Jun)',
    2: 'Triwulan 2 (Jul-Sep)',
    3: 'Triwulan 3 (Okt-Des)',
    4: 'Triwulan 4 (Jan-Mar)',
  };
  
  return quarterNames[quarter];
}

/**
 * Calculate quarterly statistics (min, max, range, average) from employee data
 */
export function calculateQuarterlyStats(
  employeeData: Array<{ q1: { score: number }; q2: { score: number }; q3: { score: number }; q4: { score: number } }>
): QuarterlyStats {
  const quarters = ['q1', 'q2', 'q3', 'q4'] as const;
  const stats = {} as QuarterlyStats;
  
  quarters.forEach(q => {
    const scores = employeeData.map(emp => emp[q].score).filter(s => s !== undefined);
    if (scores.length === 0) {
      stats[q] = { min: 0, max: 0, range: 0, avg: 0 };
    } else {
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      const avg = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
      stats[q] = { min, max, range: max - min, avg };
    }
  });
  
  return stats;
}
