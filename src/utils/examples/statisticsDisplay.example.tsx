/**
 * CONTOH: Cara Menampilkan Statistik dengan Format 2 Desimal
 * 
 * File ini berisi contoh-contoh penggunaan formatDecimal untuk menampilkan
 * statistik MIN, MAX, RANGE dari kipapp_quarterly_stats
 */

import { formatDecimal } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// ============================================
// CONTOH 1: Query dan Display Stats dari Cache
// ============================================
export async function getQuarterlyStatsFromCache(year: number, quarter: number) {
  const { data, error } = await supabase
    .from('kipapp_quarterly_stats')
    .select('*')
    .eq('year', year)
    .eq('quarter', quarter)
    .single();

  if (error) {
    console.error('Error fetching stats:', error);
    return null;
  }

  // Format semua nilai untuk display
  return {
    year: data.year,
    quarter: data.quarter,
    min: formatDecimal(data.min_value),          // "93.93"
    max: formatDecimal(data.max_value),          // "95.00"
    range: formatDecimal(data.range_value),      // "1.07"
    avg: formatDecimal(data.avg_value),          // "94.46"
    totalEmployees: data.total_employees,
  };
}

// ============================================
// CONTOH 2: Query Real-time Stats
// ============================================
export async function getQuarterlyStatsRealtime(year: number, quarter: number) {
  const { data, error } = await supabase
    .from('kipapp_quarterly_stats_realtime')
    .select('*')
    .eq('year', year)
    .eq('quarter', quarter)
    .single();

  if (error) {
    console.error('Error fetching real-time stats:', error);
    return null;
  }

  // Format untuk display
  return {
    min: formatDecimal(data.min_value),
    max: formatDecimal(data.max_value),
    range: formatDecimal(data.range_value),
    avg: formatDecimal(data.avg_value),
  };
}

// ============================================
// CONTOH 3: Component untuk Display Stats Card
// ============================================
/*
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuarterlyStatsCard({ stats }: { stats: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Q{stats.quarter} {stats.year}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Nilai Terendah (MIN):</span>
          <span className="font-semibold">{stats.min}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Nilai Tertinggi (MAX):</span>
          <span className="font-semibold">{stats.max}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Range:</span>
          <span className="font-semibold">{stats.range}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Rata-rata:</span>
          <span className="font-semibold">{stats.avg}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Total Pegawai:</span>
          <span className="font-semibold">{stats.totalEmployees}</span>
        </div>
      </CardContent>
    </Card>
  );
}
*/

// ============================================
// CONTOH 4: Query All Stats untuk Dashboard
// ============================================
export async function getAllQuarterlyStats() {
  const { data, error } = await supabase
    .from('kipapp_quarterly_stats')
    .select('*')
    .order('year', { ascending: false })
    .order('quarter', { ascending: false });

  if (error) {
    console.error('Error fetching all stats:', error);
    return [];
  }

  // Format semua nilai
  return data.map(stat => ({
    year: stat.year,
    quarter: stat.quarter,
    min: formatDecimal(stat.min_value),
    max: formatDecimal(stat.max_value),
    range: formatDecimal(stat.range_value),
    avg: formatDecimal(stat.avg_value),
    totalEmployees: stat.total_employees,
  }));
}

// ============================================
// CONTOH 5: Perbandingan Performa Pegawai
// ============================================
export async function getEmployeePerformanceComparison(year: number, quarter: number) {
  const { data, error } = await supabase.rpc('get_employee_performance_comparison', {
    p_year: year,
    p_quarter: quarter,
  });

  if (error) {
    console.error('Error:', error);
    return [];
  }

  // Format nilai untuk display
  return data.map((item: any) => ({
    employeeName: item.employee_name,
    score: formatDecimal(item.avg_value),           // Nilai pegawai
    minScore: formatDecimal(item.min_value),        // Min dari semua pegawai
    maxScore: formatDecimal(item.max_value),        // Max dari semua pegawai
    avgScore: formatDecimal(item.avg_value_all),    // Avg dari semua pegawai
    category: item.category,                        // TOP PERFORMER / AVERAGE / NEED IMPROVEMENT
  }));
}

