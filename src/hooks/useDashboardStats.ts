import { useDashboardStatsQuery } from "@/entities/dashboard/hooks";

export interface DashboardStats {
  totalEmployees: number;
  currentMonthKipapp: {
    average: number;
    count: number;
  };
  currentMonthAttendance: {
    rate: number;
    totalEmployees: number;
    absentEmployees: number;
  };
  recentEntries: Array<{
    id: string;
    type: 'KIPAPP' | 'Absen';
    employeeName: string;
    value?: string;
    createdAt: string;
  }>;
  performanceTrend: Array<{
    month: number;
    year: number;
    average: number;
    monthName: string;
  }>;
  quarterlyStats?: {
    year: number;
    quarter: number;
    avgValue: number;
    totalEmployees: number;
  };
}

const getMonthName = (monthNumber: number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return months[monthNumber - 1];
};

export const useDashboardStats = () => useDashboardStatsQuery();

export default useDashboardStats;
