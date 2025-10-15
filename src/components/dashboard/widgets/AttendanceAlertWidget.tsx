import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Users, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceAlert {
  id: string;
  name: string;
  position: string;
  absentDays: number;
  totalDays: number;
  attendanceRate: number;
  status: 'critical' | 'warning' | 'good';
}

interface AttendanceAlertWidgetProps {
  alerts?: AttendanceAlert[];
  loading?: boolean;
  title?: string;
}

const getStatusIcon = (status: AttendanceAlert['status']) => {
  switch (status) {
    case 'critical':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'good':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
};

const getStatusBadge = (status: AttendanceAlert['status']) => {
  switch (status) {
    case 'critical':
      return <Badge variant="destructive">Kritis</Badge>;
    case 'warning':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Perhatian</Badge>;
    case 'good':
      return <Badge variant="outline" className="border-green-500 text-green-700">Baik</Badge>;
  }
};

const getStatusColor = (status: AttendanceAlert['status']) => {
  switch (status) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'good':
      return 'text-green-600 bg-green-50 border-green-200';
  }
};

export const AttendanceAlertWidget: React.FC<AttendanceAlertWidgetProps> = ({
  alerts = [],
  loading = false,
  title = "Alert Kehadiran"
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-3">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Filter alerts to show only critical and warning
  const criticalAlerts = alerts.filter(alert => alert.status === 'critical');
  const warningAlerts = alerts.filter(alert => alert.status === 'warning');
  const displayAlerts = [...criticalAlerts, ...warningAlerts].slice(0, 5);

  if (displayAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" />
            <p className="text-green-600 text-sm font-medium">Semua pegawai hadir dengan baik</p>
            <p className="text-gray-500 text-xs mt-1">Tidak ada alert kehadiran</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const criticalCount = criticalAlerts.length;
  const warningCount = warningAlerts.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </div>
          <div className="flex items-center gap-1">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalCount} Kritis
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700">
                {warningCount} Perhatian
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-colors",
              getStatusColor(alert.status)
            )}
          >
            <div className="flex-shrink-0">
              {getStatusIcon(alert.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {alert.name}
              </p>
              <p className="text-xs opacity-75 truncate">
                {alert.position}
              </p>
              <p className="text-xs opacity-75">
                {alert.absentDays} hari absen dari {alert.totalDays} hari kerja
              </p>
            </div>
            
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <span className="text-sm font-semibold">
                {alert.attendanceRate.toFixed(1)}%
              </span>
              {getStatusBadge(alert.status)}
            </div>
          </div>
        ))}
        
        {alerts.length > 5 && (
          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">
              +{alerts.length - 5} pegawai lainnya
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceAlertWidget;
