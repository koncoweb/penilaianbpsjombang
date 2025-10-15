import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickAccessCards } from "@/components/dashboard/QuickAccessCard";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { PerformanceTrendChart } from "@/components/dashboard/PerformanceTrendChart";
import { QuickActionsToolbar } from "@/components/dashboard/QuickActionsToolbar";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { TopPerformersWidget } from "@/components/dashboard/widgets/TopPerformersWidget";
import { AttendanceAlertWidget } from "@/components/dashboard/widgets/AttendanceAlertWidget";
import { UserRoleManager } from "@/components/dashboard/UserRoleManager";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useQuarterlyReport } from "@/entities/stats/hooks";
import { useAbsen } from "@/entities/absen/hooks";
import { useEmployees } from "@/entities/employees/hooks";
import { useDashboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useRenakStats } from "@/hooks/useRenakStats";
import { formatDecimal } from "@/lib/utils";
import { 
  Users, 
  FileText, 
  CalendarX, 
  TrendingUp,
  Activity,
  Target,
  Award,
  BarChart3,
  HelpCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const { isAdmin } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentQuarter = Math.ceil(((currentMonth + 9) % 12 + 1) / 3); // Q1=Jan-Mar
  const { data: quarterlyReport } = useQuarterlyReport(currentYear, currentQuarter);
  const { data: absenData = [] } = useAbsen();
  const { data: employees = [] } = useEmployees();
  const { data: renakStats, isLoading: renakLoading } = useRenakStats();
  
  // Initialize keyboard shortcuts
  useDashboardShortcuts();

  if (isAdmin) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        {/* Welcome Header */}
        <WelcomeHeader />

        {/* Quick Actions Toolbar */}
        <QuickActionsToolbar />

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Pegawai"
            value={stats?.totalEmployees || 0}
            subtitle="Karyawan terdaftar"
            icon={<Users className="h-4 w-4" />}
            variant="info"
            loading={isLoading}
          />
          <StatCard
            title="Rata-rata KIPAPP"
            value={stats?.currentMonthKipapp.average ? formatDecimal(stats.currentMonthKipapp.average) : "0.00"}
            subtitle={`${stats?.currentMonthKipapp.count || 0} entri bulan ini`}
            icon={<Target className="h-4 w-4" />}
            variant="success"
            loading={isLoading}
          />
          <StatCard
            title="Tingkat Kehadiran"
            value={stats?.currentMonthAttendance.rate ? `${stats.currentMonthAttendance.rate.toFixed(1)}%` : "0%"}
            subtitle={`${stats?.currentMonthAttendance.absentEmployees || 0} pegawai absen`}
            icon={<Activity className="h-4 w-4" />}
            variant={stats?.currentMonthAttendance.rate && stats.currentMonthAttendance.rate >= 90 ? "success" : "warning"}
            loading={isLoading}
          />
          <StatCard
            title="Performa Terbaik"
            value={stats?.quarterlyStats?.avgValue ? formatDecimal(stats.quarterlyStats.avgValue) : "0.00"}
            subtitle={`Q${stats?.quarterlyStats?.quarter || 0} ${stats?.quarterlyStats?.year || new Date().getFullYear()}`}
            icon={<Award className="h-4 w-4" />}
            variant="default"
            loading={isLoading}
          />
        </div>

        {/* Quick Access Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Akses Cepat</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <QuickAccessCards.Employees
              stats={{
                label: "Total",
                value: stats?.totalEmployees || 0
              }}
              loading={isLoading}
            />
            <QuickAccessCards.Kipapp
              stats={{
                label: "Bulan ini",
                value: `${stats?.currentMonthKipapp.count || 0} entri`
              }}
              loading={isLoading}
            />
            <QuickAccessCards.Absen
              stats={{
                label: "Kehadiran",
                value: stats?.currentMonthAttendance.rate ? `${stats.currentMonthAttendance.rate.toFixed(1)}%` : "0%"
              }}
              loading={isLoading}
            />
            <QuickAccessCards.RenakCan
              stats={{
                label: "Target",
                value: renakStats ? `${renakStats.targetAchievement}%` : "0%"
              }}
              badge={{
                text: renakStats ? `${renakStats.currentMonthEntries} entri` : "0 entri",
                variant: renakStats && renakStats.targetAchievement >= 80 ? "default" : "outline"
              }}
              loading={renakLoading}
            />
            <QuickAccessCards.Report
              badge={{
                text: stats?.quarterlyStats ? `Q${stats.quarterlyStats.quarter} ${stats.quarterlyStats.year}` : "Belum ada data",
                variant: stats?.quarterlyStats ? "default" : "outline"
              }}
              loading={isLoading}
            />
          </div>
        </div>


        {/* Dashboard Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <RecentActivityList
            activities={stats?.recentEntries || []}
            loading={isLoading}
          />

          {/* Performance Trend */}
          <PerformanceTrendChart
            data={stats?.performanceTrend || []}
            loading={isLoading}
          />
        </div>

        {/* Widgets Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Performers */}
          <TopPerformersWidget
            performers={(quarterlyReport?.employees || []).map((e) => ({ id: e.id, name: e.name, position: e.position, avgValue: e.avg_value }))}
            loading={isLoading}
            title="Top Performers Triwulan Ini"
          />

          {/* Attendance Alerts */}
          <AttendanceAlertWidget
            alerts={(absenData || [])
              .filter((a: any) => a.month === currentMonth)
              .map((a: any) => {
                const emp = employees.find((e: any) => e.id === a.employee_id);
                const totalDays = 22;
                const attendanceRate = totalDays > 0 ? ((totalDays - a.absent_days) / totalDays) * 100 : 100;
                const status = attendanceRate < 70 ? 'critical' : attendanceRate < 85 ? 'warning' : 'good';
                return { id: a.id, name: emp?.name || 'Unknown', position: emp?.position || '-', absentDays: a.absent_days, totalDays, attendanceRate, status };
              })}
            loading={isLoading}
            title="Alert Kehadiran"
          />
        </div>

        {/* Command Palette */}
        <CommandPalette />
      </div>
    );
  }

  // User Dashboard (Non-Admin)
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* Quick Actions Toolbar for Users */}
      <QuickActionsToolbar />

      {/* User-specific content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Performa Personal"
          value="Belum tersedia"
          subtitle="Fitur dalam pengembangan"
          icon={<TrendingUp className="h-4 w-4" />}
          variant="info"
        />
        <StatCard
          title="Kehadiran Personal"
          value="Belum tersedia"
          subtitle="Fitur dalam pengembangan"
          icon={<CalendarX className="h-4 w-4" />}
          variant="info"
        />
        <StatCard
          title="Target Kinerja"
          value="Belum tersedia"
          subtitle="Fitur dalam pengembangan"
          icon={<Target className="h-4 w-4" />}
          variant="info"
        />
      </div>
      
      {/* User Menu Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Menu Tersedia</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Profil Saya</h3>
                <p className="text-sm text-gray-600">Lihat dan edit profil</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Akses informasi pribadi dan pengaturan akun
            </p>
            <Link to="/" className="w-full inline-block">
              <span className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">Akses Profil</span>
            </Link>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Riwayat KIPAPP</h3>
                <p className="text-sm text-gray-600">Lihat nilai kinerja</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Lihat riwayat penilaian kinerja pegawai
            </p>
            <Link to="/admin/kipapp" className="w-full inline-block">
              <span className="block w-full text-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">Lihat Riwayat</span>
            </Link>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CalendarX className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Riwayat Absen</h3>
                <p className="text-sm text-gray-600">Lihat kehadiran</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Lihat riwayat kehadiran dan absensi
            </p>
            <Link to="/admin/absen" className="w-full inline-block">
              <span className="block w-full text-center py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm">Lihat Kehadiran</span>
            </Link>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Laporan Personal</h3>
                <p className="text-sm text-gray-600">Download laporan</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Download laporan kinerja personal
            </p>
            <Link to="/admin/quarterly-report" className="w-full inline-block">
              <span className="block w-full text-center py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">Download Laporan</span>
            </Link>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pencapaian</h3>
                <p className="text-sm text-gray-600">Lihat achievements</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Lihat pencapaian dan penghargaan
            </p>
            <Link to="/" className="w-full inline-block">
              <span className="block w-full text-center py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">Lihat Pencapaian</span>
            </Link>
          </div>

          <div className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Bantuan</h3>
                <p className="text-sm text-gray-600">FAQ & Support</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Panduan penggunaan dan bantuan teknis
            </p>
            <Link to="/" className="w-full inline-block">
              <span className="block w-full text-center py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm">Buka Bantuan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Tips & Informasi
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <div>
              <p className="font-medium text-blue-900">Keyboard Shortcuts</p>
              <p className="text-sm text-blue-700">Gunakan Ctrl+K untuk quick search, Ctrl+R untuk refresh</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <div>
              <p className="font-medium text-blue-900">Export Data</p>
              <p className="text-sm text-blue-700">Gunakan toolbar di atas untuk export data ke PDF/Excel</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
            <div>
              <p className="font-medium text-blue-900">Fitur Baru</p>
              <p className="text-sm text-blue-700">Dashboard sedang dikembangkan, fitur akan ditambahkan secara bertahap</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
            <div>
              <p className="font-medium text-blue-900">Dukungan</p>
              <p className="text-sm text-blue-700">Hubungi admin jika mengalami kendala teknis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Development Tools - User Role Manager */}
      {process.env.NODE_ENV === 'development' && (
        <UserRoleManager />
      )}

      {/* Command Palette for Users */}
      <CommandPalette />
    </div>
  );
};

export default Index;