import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, FileText, CalendarX, BarChart3, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickAccessCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  stats?: {
    label: string;
    value: string | number;
  };
  loading?: boolean;
}

const cardVariants = {
  employees: "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:border-blue-300",
  kipapp: "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:border-green-300",
  absen: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 hover:border-orange-300",
  renakcan: "bg-gradient-to-br from-teal-50 to-cyan-100 border-teal-200 hover:border-teal-300",
  report: "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 hover:border-purple-300",
  default: "bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200 hover:border-gray-300"
};

const getCardVariant = (href: string) => {
  if (href.includes('employees')) return 'employees';
  if (href.includes('kipapp')) return 'kipapp';
  if (href.includes('absen')) return 'absen';
  if (href.includes('renak-can')) return 'renakcan';
  if (href.includes('quarterly-report')) return 'report';
  return 'default';
};

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  title,
  description,
  href,
  icon,
  badge,
  stats,
  loading = false
}) => {
  const variant = getCardVariant(href);
  const cardStyle = cardVariants[variant];
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className={cn("transition-all duration-200 hover:shadow-md", cardStyle)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
            </div>
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group cursor-pointer",
        cardStyle,
      )}
      role="link"
      tabIndex={0}
      onClick={() => navigate(href)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(href);
        }
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 text-gray-600 group-hover:text-gray-800 transition-colors">
              {icon}
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                {title}
              </CardTitle>
              <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-500 transition-colors">
                {description}
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          {stats && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{stats.label}</span>
              <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{stats.value}</span>
            </div>
          )}
          {badge && (
            <Badge variant={badge.variant || 'default'} className="text-xs group-hover:scale-105 transition-transform">
              {badge.text}
            </Badge>
          )}
        </div>
        <Button
          className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(href);
          }}
        >
          Akses Menu
        </Button>
      </CardContent>
    </Card>
  );
};

// Predefined cards for common use cases
export const QuickAccessCards = {
  Employees: (props: Partial<QuickAccessCardProps>) => (
    <QuickAccessCard
      title="Data Pegawai"
      description="Kelola informasi pegawai"
      href="/admin/employees"
      icon={<Users className="h-5 w-5" />}
      {...props}
    />
  ),
  Kipapp: (props: Partial<QuickAccessCardProps>) => (
    <QuickAccessCard
      title="Data KIPAPP"
      description="Kelola nilai kinerja"
      href="/admin/kipapp"
      icon={<FileText className="h-5 w-5" />}
      {...props}
    />
  ),
  Absen: (props: Partial<QuickAccessCardProps>) => (
    <QuickAccessCard
      title="Data Absen"
      description="Kelola kehadiran pegawai"
      href="/admin/absen"
      icon={<CalendarX className="h-5 w-5" />}
      {...props}
    />
  ),
  RenakCan: (props: Partial<QuickAccessCardProps>) => (
    <QuickAccessCard
      title="RENAK CAN"
      description="Kelola data RENAK CAN"
      href="/admin/renak-can"
      icon={<Target className="h-5 w-5" />}
      {...props}
    />
  ),
  Report: (props: Partial<QuickAccessCardProps>) => (
    <QuickAccessCard
      title="Laporan Triwulan"
      description="Lihat laporan performa"
      href="/admin/quarterly-report"
      icon={<BarChart3 className="h-5 w-5" />}
      {...props}
    />
  )
};

export default QuickAccessCard;
