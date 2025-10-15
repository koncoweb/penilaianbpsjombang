import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, CalendarX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface RecentActivityItem {
  id: string;
  type: 'KIPAPP' | 'Absen';
  employeeName: string;
  value?: string;
  createdAt: string;
}

interface RecentActivityListProps {
  activities: RecentActivityItem[];
  loading?: boolean;
  maxItems?: number;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'KIPAPP':
      return <FileText className="h-4 w-4 text-green-600" />;
    case 'Absen':
      return <CalendarX className="h-4 w-4 text-orange-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getActivityBadgeVariant = (type: string) => {
  switch (type) {
    case 'KIPAPP':
      return 'default' as const;
    case 'Absen':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
};

const getActivityDescription = (activity: RecentActivityItem) => {
  switch (activity.type) {
    case 'KIPAPP':
      return `Nilai KIPAPP: ${activity.value}`;
    case 'Absen':
      return `Absen ${activity.value}`;
    default:
      return 'Aktivitas terbaru';
  }
};

export const RecentActivityList: React.FC<RecentActivityListProps> = ({
  activities,
  loading = false,
  maxItems = 5
}) => {
  const displayActivities = activities.slice(0, maxItems);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (displayActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Belum ada aktivitas terbaru</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayActivities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-colors",
              "hover:bg-gray-50",
              index === 0 && "bg-blue-50 border-blue-200"
            )}
          >
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.employeeName}
              </p>
              <p className="text-xs text-gray-600">
                {getActivityDescription(activity)}
              </p>
            </div>
            
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <Badge 
                variant={getActivityBadgeVariant(activity.type)}
                className="text-xs"
              >
                {activity.type}
              </Badge>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(activity.createdAt), {
                  addSuffix: true,
                  locale: id
                })}
              </span>
            </div>
          </div>
        ))}
        
        {activities.length > maxItems && (
          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">
              +{activities.length - maxItems} aktivitas lainnya
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityList;
