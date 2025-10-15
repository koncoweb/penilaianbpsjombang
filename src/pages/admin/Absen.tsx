import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateQuarterlyAttendance, calculateQuarterlyStats } from "@/utils/attendanceUtils";
import { AttendanceScore } from "@/components/ui/attendance-score";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, CalendarX } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatDecimal } from "@/lib/utils";
import { useEmployees } from "@/entities/employees/hooks";
import { absenSchema, useAbsen, useAbsenYears, useCreateAbsen, useDeleteAbsen, useUpdateAbsen } from "@/entities/absen/hooks";

const absenSchema = z.object({
  employee_id: z.string().min(1, "Pegawai harus dipilih"),
  month: z.coerce.number().min(1, "Bulan harus diisi").max(12),
  year: z.coerce.number().min(2000, "Tahun tidak valid"),
  absent_days: z.coerce.number().min(0, "Jumlah hari tidak boleh negatif").max(31, "Maksimal 31 hari"),
});

type Employee = { id: string; name: string };
type AbsenData = {
  id: string;
  month: number;
  year: number;
  absent_days: number;
  employees: { name: string };
};

type QuarterlyAbsenData = {
  employeeId: string;
  employeeName: string;
  q1: { apr: number; mei: number; jun: number; total: number; score: number };
  q2: { jul: number; agu: number; sep: number; total: number; score: number };
  q3: { okt: number; nov: number; des: number; total: number; score: number };
  q4: { jan: number; feb: number; mar: number; total: number; score: number };
};

const getMonthName = (monthNumber: number) => {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return months[monthNumber - 1];
};

const Absen = () => {
  const [editingAbsen, setEditingAbsen] = useState<AbsenData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingAbsenId, setDeletingAbsenId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [filteredEmployeeId, setFilteredEmployeeId] = useState<string>("__all__");
  const [filteredYear, setFilteredYear] = useState<string>("__all__");
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();

  // quarterlyData moved below queries to avoid referencing variables before initialization

  // filteredAbsenData moved below after queries are initialized to avoid TDZ

  const addForm = useForm<z.infer<typeof absenSchema>>({
    resolver: zodResolver(absenSchema),
    defaultValues: {
      employee_id: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      absent_days: 0,
    },
  });

  const editForm = useForm<z.infer<typeof absenSchema>>({
    resolver: zodResolver(absenSchema),
  });

  // Fetch employees using React Query
  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useEmployees();

  // Fetch absen data using React Query
  const { data: absenData = [], isLoading: absenLoading, error: absenError } = useAbsen();

  // Fetch available years using React Query
  const { data: availableYears = [], error: yearsError } = useAbsenYears();
  if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
    setSelectedYear(availableYears[0]);
  }

  // Show error toasts if queries fail
  if (employeesError) {
    toast({ 
      title: "Error", 
      description: `Gagal memuat data pegawai: ${employeesError.message}`, 
      variant: "destructive" 
    });
  }

  if (absenError) {
    toast({ 
      title: "Error", 
      description: `Gagal memuat data absen: ${absenError.message}`, 
      variant: "destructive" 
    });
  }

  if (yearsError) {
    toast({ 
      title: "Error", 
      description: `Gagal memuat data tahun: ${yearsError.message}`, 
      variant: "destructive" 
    });
  }

  const isLoading = employeesLoading || absenLoading;

  // Calculate quarterly attendance data (placed after queries are initialized)
  const quarterlyData = useMemo(() => {
    if (!employees || employees.length === 0 || !absenData || absenData.length === 0) return [];

    const quarterlyAbsen: QuarterlyAbsenData[] = [];

    employees.forEach(employee => {
      const qData: QuarterlyAbsenData = {
        employeeId: employee.id,
        employeeName: employee.name,
        q1: { apr: 0, mei: 0, jun: 0, total: 0, score: 0 },
        q2: { jul: 0, agu: 0, sep: 0, total: 0, score: 0 },
        q3: { okt: 0, nov: 0, des: 0, total: 0, score: 0 },
        q4: { jan: 0, feb: 0, mar: 0, total: 0, score: 0 }
      };

      const employeeAbsen = absenData.filter(data => 
        data.employees.name === employee.name && data.year === selectedYear
      );

      employeeAbsen.forEach(data => {
        const absentDays = data.absent_days;
        switch (data.month) {
          case 4: qData.q1.apr = absentDays; break;
          case 5: qData.q1.mei = absentDays; break;
          case 6: qData.q1.jun = absentDays; break;
          case 7: qData.q2.jul = absentDays; break;
          case 8: qData.q2.agu = absentDays; break;
          case 9: qData.q2.sep = absentDays; break;
          case 10: qData.q3.okt = absentDays; break;
          case 11: qData.q3.nov = absentDays; break;
          case 12: qData.q3.des = absentDays; break;
          case 1: qData.q4.jan = absentDays; break;
          case 2: qData.q4.feb = absentDays; break;
          case 3: qData.q4.mar = absentDays; break;
        }
      });

      // Calculate quarterly attendance using utility function
      const quarterlyData = calculateQuarterlyAttendance({
        apr: qData.q1.apr,
        mei: qData.q1.mei,
        jun: qData.q1.jun,
        jul: qData.q2.jul,
        agu: qData.q2.agu,
        sep: qData.q2.sep,
        okt: qData.q3.okt,
        nov: qData.q3.nov,
        des: qData.q3.des,
        jan: qData.q4.jan,
        feb: qData.q4.feb,
        mar: qData.q4.mar,
      });

      // Update qData with calculated values
      qData.q1 = quarterlyData.q1;
      qData.q2 = quarterlyData.q2;
      qData.q3 = quarterlyData.q3;
      qData.q4 = quarterlyData.q4;

      quarterlyAbsen.push(qData);
    });

    return quarterlyAbsen;
  }, [employees, absenData, selectedYear]);

  // Calculate quarterly statistics
  const quarterlyStats = useMemo(() => {
    if (quarterlyData.length === 0) return null;
    return calculateQuarterlyStats(quarterlyData);
  }, [quarterlyData]);

  // Filter monthly attendance data based on selected filters (placed after queries are initialized)
  const filteredAbsenData = useMemo(() => {
    const base = Array.isArray(absenData) ? absenData : [];
    let filtered = base;
    if (filteredEmployeeId && filteredEmployeeId !== "__all__") {
      filtered = filtered.filter(data => data.employee_id === filteredEmployeeId);
    }
    if (filteredYear && filteredYear !== "__all__") {
      filtered = filtered.filter(data => data.year === parseInt(filteredYear));
    }
    return filtered;
  }, [absenData, filteredEmployeeId, filteredYear]);

  const clearFilters = () => {
    setFilteredEmployeeId("__all__");
    setFilteredYear("__all__");
  };

  // Reset edit form when editing absen changes
  if (editingAbsen) {
    editForm.reset({
      month: editingAbsen.month,
      year: editingAbsen.year,
      absent_days: editingAbsen.absent_days,
    });
  }

  // Add absen mutation
  const addAbsenMutation = useCreateAbsen();

  // Edit absen mutation
  const editAbsenMutation = useUpdateAbsen();

  // Delete absen mutation
  const deleteAbsenMutation = useDeleteAbsen();

  const onAddSubmit = (values: z.infer<typeof absenSchema>) => {
    addAbsenMutation.mutate(values, {
      onSuccess: () => {
        toast({ title: "Sukses", description: "Data absen berhasil ditambahkan." });
        addForm.reset({
          employee_id: "",
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          absent_days: 0,
        });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message || "Terjadi kesalahan saat memproses data.", variant: "destructive" });
      },
    });
  };

  const onEditSubmit = (values: z.infer<typeof absenSchema>) => {
    if (!editingAbsen) return;
    editAbsenMutation.mutate({ id: editingAbsen.id, values }, {
      onSuccess: () => {
        toast({ title: "Sukses", description: "Data absen berhasil diperbarui." });
        setIsEditDialogOpen(false);
        setEditingAbsen(null);
      },
      onError: (error: any) => {
        toast({ title: "Error", description: `Gagal memperbarui data: ${error.message}`, variant: "destructive" });
      },
    });
  };

  const handleDelete = (absenId: string) => {
    deleteAbsenMutation.mutate(absenId, {
      onSuccess: () => {
        toast({ title: "Sukses", description: "Data absen berhasil dihapus." });
        setDeletingAbsenId(null);
      },
      onError: (error: any) => {
        toast({ title: "Error", description: `Gagal menghapus data: ${error.message}`, variant: "destructive" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-2 mb-4">
          <CalendarX className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Manajemen Data Absen</h1>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <CalendarX className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Manajemen Data Absen</h1>
        {isSubmitting && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Memproses...</span>
          </div>
        )}
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tambah Data Absen</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                <fieldset disabled={isSubmitting}>
                <FormField 
                  control={addForm.control} 
                  name="employee_id" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pegawai</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih pegawai" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                <FormField 
                  control={addForm.control} 
                  name="month" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bulan</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={String(field.value)}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              {getMonthName(i + 1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                <FormField 
                  control={addForm.control} 
                  name="year" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahun</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Contoh: 2024" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                <FormField 
                  control={addForm.control} 
                  name="absent_days" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Hari Tidak Masuk</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Contoh: 0, 1, 2, dst" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">
                        Jumlah hari ijin atau tidak berangkat kerja dalam bulan ini
                      </p>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                <Button variant="gradient" type="submit" className="w-full" disabled={addAbsenMutation.isPending}>
                  {addAbsenMutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Daftar Data Absen
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  disabled={(!filteredEmployeeId && !filteredYear) || isSubmitting}
                >
                  Clear Filter
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg" style={{ opacity: isSubmitting ? 0.6 : 1 }}>
              <div className="flex items-center gap-2">
                <label htmlFor="employee-filter" className="text-sm font-medium whitespace-nowrap">
                  Filter Pegawai:
                </label>
                <Select 
                  value={filteredEmployeeId} 
                  onValueChange={setFilteredEmployeeId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Semua pegawai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Semua pegawai</SelectItem>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label htmlFor="year-filter-monthly" className="text-sm font-medium whitespace-nowrap">
                  Filter Tahun:
                </label>
                <Select 
                  value={filteredYear} 
                  onValueChange={setFilteredYear}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Semua tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Semua tahun</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pegawai</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Hari Tidak Masuk</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAbsenData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {absenData.length === 0 
                        ? "Belum ada data absen" 
                        : "Tidak ada data absen yang sesuai dengan filter"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAbsenData.map((data) => (
                    <TableRow key={data.id}>
                      <TableCell>{data.employees.name}</TableCell>
                      <TableCell>{getMonthName(data.month)} {data.year}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${data.absent_days === 0 ? 'text-green-600' : data.absent_days > 3 ? 'text-red-600' : 'text-yellow-600'}`}>
                          {data.absent_days} hari
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog 
                            open={isEditDialogOpen && editingAbsen?.id === data.id} 
                            onOpenChange={(open) => { 
                              if (!open && !isSubmitting) { 
                                setEditingAbsen(null); 
                                setIsEditDialogOpen(false); 
                              } else if (open && !isSubmitting) { 
                                setEditingAbsen(data); 
                                setIsEditDialogOpen(true); 
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                disabled={isSubmitting}
                                onClick={() => {
                                  if (!isSubmitting) {
                                    setEditingAbsen(data);
                                    setIsEditDialogOpen(true);
                                  }
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                              <DialogHeader>
                                <DialogTitle>Edit Data Absen</DialogTitle>
                              </DialogHeader>
                              <p className="text-sm text-muted-foreground">
                                Pegawai: {data.employees.name}<br/>
                                Periode: {getMonthName(data.month)} {data.year}
                              </p>
                              <Form {...editForm}>
                                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 pt-4">
                                  <fieldset disabled={isSubmitting}>
                                  <FormField 
                                    control={editForm.control} 
                                    name="absent_days" 
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Jumlah Hari Tidak Masuk</FormLabel>
                                        <FormControl>
                                          <Input type="number" {...field} disabled={isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )} 
                                  />
                                  <DialogFooter>
                                    <Button type="submit" disabled={editAbsenMutation.isPending}>
                                      {editAbsenMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                                    </Button>
                                  </DialogFooter>
                                  </fieldset>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog 
                            open={deletingAbsenId === data.id}
                            onOpenChange={(open) => {
                              if (!open && !isSubmitting) {
                                setDeletingAbsenId(null);
                              }
                            }}
                          >
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive" 
                                disabled={isSubmitting}
                                onClick={() => setDeletingAbsenId(data.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini akan menghapus data absen untuk {data.employees.name} periode {getMonthName(data.month)} {data.year} secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel 
                                  disabled={isSubmitting}
                                  onClick={() => setDeletingAbsenId(null)}
                                >
                                  Batal
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(data.id)}
                                  disabled={deleteAbsenMutation.isPending}
                                >
                                  {deleteAbsenMutation.isPending ? "Menghapus..." : "Hapus"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quarterly Attendance Summary Table */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarX className="h-5 w-5" />
                Rekapitulasi Absensi Triwulan {selectedYear}
              </CardTitle>
              <div className="flex items-center gap-2">
                <label htmlFor="year-filter" className="text-sm font-medium">
                  Filter Tahun:
                </label>
                <Select 
                  value={String(selectedYear)} 
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Quarterly Stats Summary */}
            {quarterlyStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {(['q1', 'q2', 'q3', 'q4'] as const).map((quarter, idx) => {
                  const qNum = idx + 1;
                  const qName = ['Apr-Jun', 'Jul-Sep', 'Okt-Des', 'Jan-Mar'][idx];
                  const stats = quarterlyStats[quarter];
                  
                  return (
                    <Card key={quarter}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          Triwulan {qNum} ({qName})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Min:</span>
                          <AttendanceScore score={stats.min} />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Max:</span>
                          <AttendanceScore score={stats.max} />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Range:</span>
                          <span className="font-semibold">{stats.range}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rata-rata:</span>
                          <AttendanceScore score={stats.avg} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={2} className="text-center align-middle">Pegawai</TableHead>
                    <TableHead colSpan={4} className="text-center">Triwulan 1 (Apr-Jun)</TableHead>
                    <TableHead colSpan={4} className="text-center">Triwulan 2 (Jul-Sep)</TableHead>
                    <TableHead colSpan={4} className="text-center">Triwulan 3 (Okt-Des)</TableHead>
                    <TableHead colSpan={4} className="text-center">Triwulan 4 (Jan-Mar)</TableHead>
                  </TableRow>
                  <TableRow>
                    {/* Q1 Headers */}
                    <TableHead className="text-center">Apr</TableHead>
                    <TableHead className="text-center">Mei</TableHead>
                    <TableHead className="text-center">Jun</TableHead>
                    <TableHead className="text-center bg-blue-50">Skor Absen</TableHead>
                    
                    {/* Q2 Headers */}
                    <TableHead className="text-center">Jul</TableHead>
                    <TableHead className="text-center">Agu</TableHead>
                    <TableHead className="text-center">Sep</TableHead>
                    <TableHead className="text-center bg-blue-50">Skor Absen</TableHead>
                    
                    {/* Q3 Headers */}
                    <TableHead className="text-center">Okt</TableHead>
                    <TableHead className="text-center">Nov</TableHead>
                    <TableHead className="text-center">Des</TableHead>
                    <TableHead className="text-center bg-blue-50">Skor Absen</TableHead>
                    
                    {/* Q4 Headers */}
                    <TableHead className="text-center">Jan</TableHead>
                    <TableHead className="text-center">Feb</TableHead>
                    <TableHead className="text-center">Mar</TableHead>
                    <TableHead className="text-center bg-blue-50">Skor Absen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quarterlyData.map((data) => (
                    <TableRow key={data.employeeId}>
                      <TableCell className="font-medium">{data.employeeName}</TableCell>
                      
                      {/* Q1 Data */}
                      <TableCell className="text-center">{data.q1.apr}</TableCell>
                      <TableCell className="text-center">{data.q1.mei}</TableCell>
                      <TableCell className="text-center">{data.q1.jun}</TableCell>
                      <TableCell className="text-center bg-blue-50 font-semibold">
                        <AttendanceScore score={data.q1.score} />
                      </TableCell>
                      
                      {/* Q2 Data */}
                      <TableCell className="text-center">{data.q2.jul}</TableCell>
                      <TableCell className="text-center">{data.q2.agu}</TableCell>
                      <TableCell className="text-center">{data.q2.sep}</TableCell>
                      <TableCell className="text-center bg-blue-50 font-semibold">
                        <AttendanceScore score={data.q2.score} />
                      </TableCell>
                      
                      {/* Q3 Data */}
                      <TableCell className="text-center">{data.q3.okt}</TableCell>
                      <TableCell className="text-center">{data.q3.nov}</TableCell>
                      <TableCell className="text-center">{data.q3.des}</TableCell>
                      <TableCell className="text-center bg-blue-50 font-semibold">
                        <AttendanceScore score={data.q3.score} />
                      </TableCell>
                      
                      {/* Q4 Data */}
                      <TableCell className="text-center">{data.q4.jan}</TableCell>
                      <TableCell className="text-center">{data.q4.feb}</TableCell>
                      <TableCell className="text-center">{data.q4.mar}</TableCell>
                      <TableCell className="text-center bg-blue-50 font-semibold">
                        <AttendanceScore score={data.q4.score} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Legend */}
            <div className="mt-4 text-sm text-muted-foreground">
              <p><strong>Keterangan:</strong></p>
              <p>• Angka menunjukkan jumlah hari tidak masuk per bulan</p>
              <p>• Skor Absen = persentase kehadiran dalam triwulan (Hijau: ≥90%, Kuning: 80-89%, Merah: &lt;80%)</p>
              <p>• Jika tidak pernah absen = 100% (kehadiran sempurna)</p>
              <p>• Perhitungan: ((Hari kerja - Hari absen) / Hari kerja) × 100%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Absen;

