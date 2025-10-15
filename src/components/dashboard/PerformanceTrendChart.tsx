import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendDataPoint {
  month: number;
  year: number;
  average: number;
  monthName: string;
}

interface PerformanceTrendChartProps {
  data: TrendDataPoint[];
  loading?: boolean;
  title?: string;
  height?: number;
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({
  data,
  loading = false,
  title = "Trend Performa KIPAPP",
  height = 200
}) => {
  const formatTooltipValue = (value: number) => {
    return `${value.toFixed(2)}`;
  };

  const formatXAxisLabel = (tickItem: any) => {
    return tickItem;
  };

  const getTrendIcon = () => {
    if (data.length < 2) return <Minus className="h-4 w-4 text-gray-500" />;
    
    const first = data[0]?.average || 0;
    const last = data[data.length - 1]?.average || 0;
    
    if (last > first) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (last < first) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendText = () => {
    if (data.length < 2) return "Tidak ada data";
    
    const first = data[0]?.average || 0;
    const last = data[data.length - 1]?.average || 0;
    const diff = last - first;
    
    if (diff > 0) {
      return `+${diff.toFixed(2)} dari bulan lalu`;
    } else if (diff < 0) {
      return `${diff.toFixed(2)} dari bulan lalu`;
    } else {
      return "Sama dengan bulan lalu";
    }
  };

  const getTrendColor = () => {
    if (data.length < 2) return "text-gray-500";
    
    const first = data[0]?.average || 0;
    const last = data[data.length - 1]?.average || 0;
    
    if (last > first) return "text-green-600";
    if (last < first) return "text-red-600";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-48"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-gray-100 rounded animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">Memuat chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Belum ada data trend</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for the chart
  const chartData = data.map(item => ({
    month: item.monthName,
    average: Number(item.average.toFixed(2)),
    fullMonth: `${item.monthName} ${item.year}`
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {title}
          </div>
          <div className="flex items-center gap-1 text-sm">
            {getTrendIcon()}
            <span className={cn("text-xs", getTrendColor())}>
              {getTrendText()}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
                tickFormatter={formatXAxisLabel}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                domain={['dataMin - 5', 'dataMax + 5']}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number, name: string) => [
                  formatTooltipValue(value),
                  'Rata-rata KIPAPP'
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.fullMonth;
                  }
                  return label;
                }}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">Tertinggi</p>
            <p className="text-sm font-semibold text-green-600">
              {Math.max(...data.map(d => d.average)).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Rata-rata</p>
            <p className="text-sm font-semibold text-blue-600">
              {(data.reduce((sum, d) => sum + d.average, 0) / data.length).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Terendah</p>
            <p className="text-sm font-semibold text-red-600">
              {Math.min(...data.map(d => d.average)).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceTrendChart;
