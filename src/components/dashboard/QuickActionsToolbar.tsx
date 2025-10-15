import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  RefreshCw, 
  Download, 
  Filter, 
  Search, 
  HelpCircle,
  MoreHorizontal,
  FileText,
  FileSpreadsheet,
  FileDown
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { exportToPDF, exportToExcel, exportToCSV, printDashboard } from "@/utils/exportData";
import { useDashboardStats } from "@/hooks/useDashboardStats";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
  tooltip?: string;
}

export const QuickActionsToolbar: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: stats } = useDashboardStats();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: "Data Diperbarui",
        description: "Dashboard telah diperbarui dengan data terbaru.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui data dashboard.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportPDF = async () => {
    if (!stats) {
      toast({
        title: "Error",
        description: "Tidak ada data untuk di-export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting('pdf');
    try {
      await exportToPDF(stats, {
        filename: `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`,
        title: 'Dashboard Report - BPS Kabupaten Jombang'
      });
      toast({
        title: "Export Berhasil",
        description: "Dashboard berhasil di-export ke PDF.",
      });
    } catch (error: any) {
      toast({
        title: "Export Gagal",
        description: error.message || "Gagal meng-export ke PDF.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportExcel = async () => {
    if (!stats) {
      toast({
        title: "Error",
        description: "Tidak ada data untuk di-export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting('excel');
    try {
      await exportToExcel(stats, {
        filename: `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`
      });
      toast({
        title: "Export Berhasil",
        description: "Dashboard berhasil di-export ke Excel.",
      });
    } catch (error: any) {
      toast({
        title: "Export Gagal",
        description: error.message || "Gagal meng-export ke Excel.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportCSV = () => {
    if (!stats) {
      toast({
        title: "Error",
        description: "Tidak ada data untuk di-export.",
        variant: "destructive",
      });
      return;
    }

    try {
      exportToCSV(stats, {
        filename: `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`
      });
      toast({
        title: "Export Berhasil",
        description: "Dashboard berhasil di-export ke CSV.",
      });
    } catch (error: any) {
      toast({
        title: "Export Gagal",
        description: error.message || "Gagal meng-export ke CSV.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    if (!stats) {
      toast({
        title: "Error",
        description: "Tidak ada data untuk di-print.",
        variant: "destructive",
      });
      return;
    }

    try {
      printDashboard(stats);
      toast({
        title: "Print Berhasil",
        description: "Dashboard siap untuk di-print.",
      });
    } catch (error: any) {
      toast({
        title: "Print Gagal",
        description: error.message || "Gagal membuka print dialog.",
        variant: "destructive",
      });
    }
  };

  const handleFilter = () => {
    toast({
      title: "Filter Dashboard",
      description: "Fitur filter akan segera tersedia.",
    });
  };

  const handleSearch = () => {
    toast({
      title: "Quick Search",
      description: "Fitur search akan segera tersedia.",
    });
  };

  const actions: QuickAction[] = [
    {
      id: 'refresh',
      label: 'Refresh',
      icon: <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />,
      onClick: handleRefresh,
      shortcut: 'Ctrl+R',
      tooltip: 'Perbarui data dashboard'
    },
    {
      id: 'export-pdf',
      label: 'Export PDF',
      icon: <FileText className={`h-4 w-4 ${isExporting === 'pdf' ? 'animate-pulse' : ''}`} />,
      onClick: handleExportPDF,
      shortcut: 'Ctrl+E',
      tooltip: 'Export dashboard ke PDF'
    },
    {
      id: 'export-excel',
      label: 'Export Excel',
      icon: <FileSpreadsheet className={`h-4 w-4 ${isExporting === 'excel' ? 'animate-pulse' : ''}`} />,
      onClick: handleExportExcel,
      tooltip: 'Export data ke Excel'
    },
    {
      id: 'export-csv',
      label: 'Export CSV',
      icon: <FileDown className="h-4 w-4" />,
      onClick: handleExportCSV,
      tooltip: 'Export data ke CSV'
    },
    {
      id: 'print',
      label: 'Print',
      icon: <FileText className="h-4 w-4" />,
      onClick: handlePrint,
      shortcut: 'Ctrl+P',
      tooltip: 'Print dashboard'
    },
    {
      id: 'filter',
      label: 'Filter',
      icon: <Filter className="h-4 w-4" />,
      onClick: handleFilter,
      shortcut: 'Ctrl+F',
      tooltip: 'Filter data dashboard'
    },
    {
      id: 'search',
      label: 'Search',
      icon: <Search className="h-4 w-4" />,
      onClick: handleSearch,
      shortcut: 'Ctrl+K',
      tooltip: 'Quick search'
    }
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 p-3 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center gap-1">
          {actions.map((action) => (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.id === 'refresh' && isRefreshing}
                  className="h-8 w-8 p-0"
                >
                  {action.icon}
                  <span className="sr-only">{action.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col items-center">
                  <span>{action.tooltip || action.label}</span>
                  {action.shortcut && (
                    <span className="text-xs text-muted-foreground">{action.shortcut}</span>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="h-4 w-px bg-gray-300" />

        <KeyboardShortcuts />
      </div>
    </TooltipProvider>
  );
};

export default QuickActionsToolbar;
