import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
  loading?: boolean;
  href?: string;
}

const variantStyles = {
  default: {
    card: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200",
    icon: "text-slate-600",
    value: "text-slate-900",
    subtitle: "text-slate-600"
  },
  success: {
    card: "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200",
    icon: "text-green-600",
    value: "text-green-900",
    subtitle: "text-green-700"
  },
  warning: {
    card: "bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200",
    icon: "text-yellow-600",
    value: "text-yellow-900",
    subtitle: "text-yellow-700"
  },
  danger: {
    card: "bg-gradient-to-br from-red-50 to-rose-100 border-red-200",
    icon: "text-red-600",
    value: "text-red-900",
    subtitle: "text-red-700"
  },
  info: {
    card: "bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200",
    icon: "text-blue-600",
    value: "text-blue-900",
    subtitle: "text-blue-700"
  }
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  variant = 'default',
  icon,
  loading = false,
  href
}) => {
  const styles = variantStyles[variant];
  const isClickable = Boolean(href);

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return <TrendingUp className="h-3 w-3 text-green-600" />;
    } else if (trend.value < 0) {
      return <TrendingDown className="h-3 w-3 text-red-600" />;
    } else {
      return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "text-gray-500";
    
    if (trend.value > 0) return "text-green-600";
    if (trend.value < 0) return "text-red-600";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <Card className={cn("transition-all duration-200 hover:shadow-md", styles.card)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </CardTitle>
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        styles.card,
        isClickable && "cursor-pointer hover:scale-[1.01]",
      )}
      role={isClickable ? "link" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={() => {
        if (href) window.location.href = href;
      }}
      onKeyDown={(e) => {
        if (!href) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.location.href = href;
        }
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn("text-sm font-medium", styles.subtitle)}>
          {title}
        </CardTitle>
        {icon && (
          <div className={cn("h-4 w-4", styles.icon)}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", styles.value)}>
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-1 mt-1">
            {subtitle && (
              <p className={cn("text-xs", styles.subtitle)}>
                {subtitle}
              </p>
            )}
            {trend && (
              <div className={cn("flex items-center gap-1 text-xs", getTrendColor())}>
                {getTrendIcon()}
                <span>{trend.label}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
