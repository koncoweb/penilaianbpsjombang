import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopPerformer {
  id: string;
  name: string;
  position: string;
  avgValue: number;
  trend?: 'up' | 'down' | 'stable';
}

interface TopPerformersWidgetProps {
  performers?: TopPerformer[];
  loading?: boolean;
  title?: string;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return <Star className="h-4 w-4 text-blue-500" />;
  }
};

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">#1</Badge>;
    case 2:
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">#2</Badge>;
    case 3:
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200">#3</Badge>;
    default:
      return <Badge variant="outline">#{rank}</Badge>;
  }
};

export const TopPerformersWidget: React.FC<TopPerformersWidgetProps> = ({
  performers = [],
  loading = false,
  title = "Top Performers"
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-2">
              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (performers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Belum ada data performa</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {performers.slice(0, 5).map((performer, index) => (
          <div key={performer.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              {getRankIcon(index + 1)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {performer.name}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {performer.position}
              </p>
            </div>
            
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                {performer.avgValue.toFixed(2)}
              </span>
              {getRankBadge(index + 1)}
            </div>
          </div>
        ))}
        
        {performers.length > 5 && (
          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">
              +{performers.length - 5} pegawai lainnya
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPerformersWidget;
