import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, BarChart3, Download } from "lucide-react";

import { useQuarterlyReportComplete, useQuarterlyYears } from "@/entities/stats/hooks";
import { formatIndonesianDecimal } from "@/utils/quarterlyReportUtils";
import type { EmployeeCalculatedData } from "@/utils/quarterlyReportUtils";
import { exportQuarterlyReportToPDF, exportQuarterlyReportToExcel } from "@/utils/quarterlyReportExport";

const QuarterlyReport = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Fetch available years using React Query
  const { data: availableYears = [], error: yearsError } = useQuarterlyYears();
  if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
    setSelectedYear(availableYears[0]);
  }

  // Show error toast if years query fails
  if (yearsError) {
    toast({ 
      title: "Error", 
      description: `Gagal memuat data tahun: ${yearsError.message}`, 
      variant: "destructive" 
    });
  }

  // Fetch complete report data using React Query
  const { data: reportData, isLoading, error: reportError } = useQuarterlyReportComplete(selectedYear, selectedQuarter);

  // Show error toast if report query fails
  if (reportError) {
    toast({
      title: "Error",
      description: `Gagal memuat data: ${reportError.message}`,
      variant: "destructive",
    });
  }

  const employees: EmployeeCalculatedData[] = reportData?.employees || [];
  const stats = reportData?.stats || null;

  const getQuarterLabel = (quarter: number) => {
    const labels: Record<number, string> = {
      1: "Triwulan 1 (Januari - Maret)",
      2: "Triwulan 2 (April - Juni)",
      3: "Triwulan 3 (Juli - September)",
      4: "Triwulan 4 (Oktober - Desember)",
    };
    return labels[quarter];
  };

  const getMonthLabels = (quarter: number) => {
    const labels: Record<number, string[]> = {
      1: ["Jan", "Feb", "Mar"],
      2: ["Apr", "Mei", "Jun"],
      3: ["Jul", "Agu", "Sep"],
      4: ["Okt", "Nov", "Des"],
    };
    return labels[quarter] || ["", "", ""];
  };

  const getRankingBadgeVariant = (peringkat: number, totalEmployees: number) => {
    if (peringkat === 1) return "default" as const; // Gold for #1
    if (peringkat <= Math.ceil(totalEmployees * 0.25)) return "secondary" as const; // Green for top 25%
    if (peringkat >= Math.floor(totalEmployees * 0.75)) return "destructive" as const; // Red for bottom 25%
    return "outline" as const; // Default for middle
  };

  const handleExportPDF = async () => {
    if (employees.length === 0) {
      toast({
        title: "Error",
        description: "Tidak ada data untuk diekspor",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExporting(true);
      const exportData = {
        employees,
        selectedYear,
        selectedQuarter,
        monthLabels: getMonthLabels(selectedQuarter)
      };
      await exportQuarterlyReportToPDF(exportData);
      
      toast({
        title: "Sukses",
        description: "Laporan berhasil diekspor ke PDF",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengekspor laporan ke PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (employees.length === 0) {
      toast({
        title: "Error",
        description: "Tidak ada data untuk diekspor",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExporting(true);
      const exportData = {
        employees,
        selectedYear,
        selectedQuarter,
        monthLabels: getMonthLabels(selectedQuarter)
      };
      exportQuarterlyReportToExcel(exportData);
      
      toast({
        title: "Sukses",
        description: "Laporan berhasil diekspor ke Excel",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengekspor laporan ke Excel",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Laporan Triwulan KIPAPP</h1>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Periode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Tahun</label>
              <Select
                value={String(selectedYear)}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.length === 0 ? (
                    <SelectItem value="2025">2025</SelectItem>
                  ) : (
                    availableYears.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Triwulan</label>
              <Select
                value={String(selectedQuarter)}
                onValueChange={(value) => setSelectedQuarter(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Triwulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Q1 - Januari s/d Maret</SelectItem>
                  <SelectItem value="2">Q2 - April s/d Juni</SelectItem>
                  <SelectItem value="3">Q3 - Juli s/d September</SelectItem>
                  <SelectItem value="4">Q4 - Oktober s/d Desember</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              disabled={isLoading}
              className="min-w-[150px]"
            >
              {isLoading ? "Memuat..." : "Data Akan Dimuat Otomatis"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ekspor Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <p className="text-sm text-muted-foreground flex-1">
              Ekspor laporan triwulan ke format PDF atau Excel dengan semua 18 kolom data
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleExportPDF}
                disabled={isExporting || employees.length === 0}
                variant="outline"
                className="min-w-[120px]"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Mengekspor..." : "Export PDF"}
              </Button>
              <Button
                onClick={handleExportExcel}
                disabled={isExporting || employees.length === 0}
                variant="outline"
                className="min-w-[120px]"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Mengekspor..." : "Export Excel"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {stats && (
        <>
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Statistik {getQuarterLabel(selectedQuarter)} - {selectedYear}
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Rata Kipapp Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Rata Kipapp
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold mb-2">
                    Min: {formatIndonesianDecimal(stats.rataKipapp.min, 2)}
                  </div>
                  <div className="text-lg font-bold mb-2">
                    Max: {formatIndonesianDecimal(stats.rataKipapp.max, 2)}
                  </div>
                  <div className="text-lg font-bold">
                    Range: {formatIndonesianDecimal(stats.rataKipapp.range, 2)}
                  </div>
                </CardContent>
              </Card>

              {/* ABSENSI Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    ABSENSI
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold mb-2">
                    Min: {formatIndonesianDecimal(stats.absensi.min, 2)}%
                  </div>
                  <div className="text-lg font-bold mb-2">
                    Max: {formatIndonesianDecimal(stats.absensi.max, 2)}%
                  </div>
                  <div className="text-lg font-bold">
                    Range: {formatIndonesianDecimal(stats.absensi.range, 2)}
                  </div>
                </CardContent>
              </Card>

              {/* TOTAL ABSEN RENAK Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    TOTAL ABSEN RENAK
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold mb-2">
                    Min: {stats.totalAbsenRenak.min}
                  </div>
                  <div className="text-lg font-bold mb-2">
                    Max: {stats.totalAbsenRenak.max}
                  </div>
                  <div className="text-lg font-bold">
                    Range: {stats.totalAbsenRenak.range}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Employee Performance Table - Excel Format */}
          <Card>
            <CardHeader>
              <CardTitle>
                Laporan Triwulan Excel Format ({employees.length} Pegawai)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {employees.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada data pegawai untuk periode ini
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-[1400px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px] text-center">No</TableHead>
                        <TableHead className="w-[200px]">Nama</TableHead>
                        <TableHead className="w-[100px] text-center">Kipapp {getMonthLabels(selectedQuarter)[0]}</TableHead>
                        <TableHead className="w-[100px] text-center">Kipapp {getMonthLabels(selectedQuarter)[1]}</TableHead>
                        <TableHead className="w-[100px] text-center">Kipapp {getMonthLabels(selectedQuarter)[2]}</TableHead>
                        <TableHead className="w-[100px] text-center">Rata Kipapp</TableHead>
                        <TableHead className="w-[140px] text-center">Rata2 Tertimbang (Kipapp)</TableHead>
                        <TableHead className="w-[100px] text-center">Absen {getMonthLabels(selectedQuarter)[0]}</TableHead>
                        <TableHead className="w-[100px] text-center">Absen {getMonthLabels(selectedQuarter)[1]}</TableHead>
                        <TableHead className="w-[100px] text-center">Absen {getMonthLabels(selectedQuarter)[2]}</TableHead>
                        <TableHead className="w-[100px] text-center">ABSENSI</TableHead>
                        <TableHead className="w-[120px] text-center">ABSEN RENAK CAN {getMonthLabels(selectedQuarter)[0]}</TableHead>
                        <TableHead className="w-[120px] text-center">ABSEN RENAK CAN {getMonthLabels(selectedQuarter)[1]}</TableHead>
                        <TableHead className="w-[120px] text-center">ABSEN RENAK CAN {getMonthLabels(selectedQuarter)[2]}</TableHead>
                        <TableHead className="w-[120px] text-center">TOTAL ABSEN RENAK</TableHead>
                        <TableHead className="w-[140px] text-center">Rata2 Tertimbang (Renak Can)</TableHead>
                        <TableHead className="w-[100px] text-center">Final</TableHead>
                        <TableHead className="w-[80px] text-center">Peringkat</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="text-center font-medium">
                            {employees.indexOf(employee) + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {employee.name}
                          </TableCell>
                          <TableCell className="text-center">
                            {formatIndonesianDecimal(employee.kipappMonth1, 2)}
                          </TableCell>
                          <TableCell className="text-center">
                            {formatIndonesianDecimal(employee.kipappMonth2, 2)}
                          </TableCell>
                          <TableCell className="text-center">
                            {formatIndonesianDecimal(employee.kipappMonth3, 2)}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {formatIndonesianDecimal(employee.rataKipapp, 2)}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {formatIndonesianDecimal(employee.rataTertimbangKipapp, 2)}
                          </TableCell>
                          <TableCell className="text-center">
                            {employee.absenMonth1}
                          </TableCell>
                          <TableCell className="text-center">
                            {employee.absenMonth2}
                          </TableCell>
                          <TableCell className="text-center">
                            {employee.absenMonth3}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {formatIndonesianDecimal(employee.absensi, 2)}
                          </TableCell>
                          <TableCell className="text-center">
                            {employee.renakMonth1}
                          </TableCell>
                          <TableCell className="text-center">
                            {employee.renakMonth2}
                          </TableCell>
                          <TableCell className="text-center">
                            {employee.renakMonth3}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {employee.totalAbsenRenak}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {formatIndonesianDecimal(employee.rataTertimbangRenakCan, 2)}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {formatIndonesianDecimal(employee.final, 2)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={getRankingBadgeVariant(employee.peringkat, employees.length)}>
                              #{employee.peringkat}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty State */}
      {!stats && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Data</h3>
              <p className="text-muted-foreground mb-4">
                Pilih tahun dan triwulan, lalu klik "Tampilkan Data" untuk melihat laporan
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuarterlyReport;

