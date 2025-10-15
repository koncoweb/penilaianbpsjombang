import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatDecimal } from "@/lib/utils";
import { useEmployees } from "@/entities/employees/hooks";
import { useComputeQuarterlyKipapp, useCreateKipapp, useDeleteKipapp, useKipapp, useUpdateKipapp, kipappSchema } from "@/entities/kipapp/hooks";

const kipappSchema = z.object({
  employee_id: z.string().min(1, "Pegawai harus dipilih"),
  month: z.coerce.number().min(1, "Bulan harus diisi").max(12),
  year: z.coerce.number().min(2000, "Tahun tidak valid"),
  kipapp_value: z.coerce.number().min(0, "Nilai KIPAPP tidak boleh negatif"),
});

type Employee = { id: string; name: string };
type KipappData = {
  id: string;
  month: number;
  year: number;
  kipapp_value: number;
  employees: { name: string };
};

const getMonthName = (monthNumber: number) => {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return months[monthNumber - 1];
};

const Kipapp = () => {
  const [editingKipapp, setEditingKipapp] = useState<KipappData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  // Tambahan state untuk perhitungan triwulan
  const [computeYear, setComputeYear] = useState<number>(new Date().getFullYear());
  const [isComputing, setIsComputing] = useState(false);

  const addForm = useForm<z.infer<typeof kipappSchema>>({
    resolver: zodResolver(kipappSchema),
    defaultValues: {
      employee_id: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      kipapp_value: 0,
    },
  });

  const editForm = useForm<z.infer<typeof kipappSchema>>({
    resolver: zodResolver(kipappSchema),
  });

  // Fetch employees using React Query
  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useEmployees();

  // Fetch KIPAPP data using React Query
  const { data: kipappData = [], isLoading: kipappLoading, error: kipappError } = useKipapp();

  // Show error toasts if queries fail
  if (employeesError) {
    toast({ 
      title: "Error", 
      description: `Gagal memuat data pegawai: ${employeesError.message}`, 
      variant: "destructive" 
    });
  }

  if (kipappError) {
    toast({ 
      title: "Error", 
      description: `Gagal memuat data KIPAPP: ${kipappError.message}`, 
      variant: "destructive" 
    });
  }

  const isLoading = employeesLoading || kipappLoading;
  
  // Reset edit form when editing kipapp changes
  if (editingKipapp) {
    editForm.reset({
      month: editingKipapp.month,
      year: editingKipapp.year,
      kipapp_value: editingKipapp.kipapp_value,
    });
  }

  // Compute quarterly mutation
  const computeQuarterlyMutation = useComputeQuarterlyKipapp();

  const handleComputeQuarterly = () => {
    computeQuarterlyMutation.mutate(computeYear);
  };

  // Add KIPAPP mutation
  const addKipappMutation = useCreateKipapp();

  // Edit KIPAPP mutation
  const editKipappMutation = useUpdateKipapp();

  // Delete KIPAPP mutation
  const deleteKipappMutation = useDeleteKipapp();

  const onAddSubmit = (values: z.infer<typeof kipappSchema>) => {
    addKipappMutation.mutate(values, {
      onSuccess: () => {
        toast({ title: "Sukses", description: "Data KIPAPP berhasil ditambahkan." });
        addForm.reset({
          employee_id: "",
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          kipapp_value: 0,
        });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message || "Terjadi kesalahan saat memproses data.", variant: "destructive" });
      },
    });
  };

  const onEditSubmit = (values: z.infer<typeof kipappSchema>) => {
    if (!editingKipapp) return;
    editKipappMutation.mutate({ id: editingKipapp.id, values }, {
      onSuccess: () => {
        toast({ title: "Sukses", description: "Data KIPAPP berhasil diperbarui." });
        setIsEditDialogOpen(false);
        setEditingKipapp(null);
      },
      onError: (error: any) => {
        toast({ title: "Error", description: `Gagal memperbarui data: ${error.message}`, variant: "destructive" });
      },
    });
  };

  const handleDelete = (kipappId: string) => {
    deleteKipappMutation.mutate(kipappId, {
      onSuccess: () => {
        toast({ title: "Sukses", description: "Data KIPAPP berhasil dihapus." });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: `Gagal menghapus data: ${error.message}`, variant: "destructive" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Manajemen Data KIPAPP</h1>
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
      <h1 className="mb-4 text-2xl font-bold">Manajemen Data KIPAPP</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader><CardTitle>Tambah Data KIPAPP</CardTitle></CardHeader>
          <CardContent>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                <FormField control={addForm.control} name="employee_id" render={({ field }) => (<FormItem><FormLabel>Pegawai</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih pegawai" /></SelectTrigger></FormControl><SelectContent>{employees.map(emp => (<SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={addForm.control} name="month" render={({ field }) => (<FormItem><FormLabel>Bulan</FormLabel><Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent className="max-h-[200px]">{Array.from({ length: 12 }, (_, i) => (<SelectItem key={i + 1} value={String(i + 1)}>{getMonthName(i + 1)}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={addForm.control} name="year" render={({ field }) => (<FormItem><FormLabel>Tahun</FormLabel><FormControl><Input type="number" placeholder="Contoh: 2024" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addForm.control} name="kipapp_value" render={({ field }) => (<FormItem><FormLabel>Nilai KIPAPP</FormLabel><FormControl><Input type="number" step="0.01" placeholder="Masukkan nilai" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <Button variant="gradient" type="submit" className="w-full" disabled={addKipappMutation.isPending}>
                  {addKipappMutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Kartu baru untuk perhitungan rata-rata triwulan */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Hitung Rata-rata Triwulan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Tahun</label>
                <Input
                  type="number"
                  value={computeYear}
                  onChange={(e) => {
                    const val = parseInt(e.target.value || "");
                    setComputeYear(Number.isNaN(val) ? new Date().getFullYear() : val);
                  }}
                  placeholder="Contoh: 2025"
                />
              </div>
              <Button
                variant="gradient"
                className="w-full"
                onClick={handleComputeQuarterly}
                disabled={computeQuarterlyMutation.isPending}
              >
                {computeQuarterlyMutation.isPending ? "Menghitung..." : "Hitung Rata-rata Triwulan"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Menghitung rata-rata per triwulan untuk tahun yang dipilih dan menyimpan hasilnya ke tabel kipapp_quarterly.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Daftar Data KIPAPP</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pegawai</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Nilai</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kipappData.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.employees.name}</TableCell>
                    <TableCell>{getMonthName(data.month)} {data.year}</TableCell>
                    <TableCell>{formatDecimal(data.kipapp_value)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog open={isEditDialogOpen && editingKipapp?.id === data.id} onOpenChange={(open) => { if (!open) { setEditingKipapp(null); setIsEditDialogOpen(false); } else { setEditingKipapp(data); setIsEditDialogOpen(true); }}}>
                          <DialogTrigger asChild><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Edit Nilai KIPAPP</DialogTitle></DialogHeader>
                            <p className="text-sm text-muted-foreground">Pegawai: {data.employees.name}<br/>Periode: {getMonthName(data.month)} {data.year}</p>
                            <Form {...editForm}>
                              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 pt-4">
                                <FormField control={editForm.control} name="kipapp_value" render={({ field }) => (<FormItem><FormLabel>Nilai KIPAPP</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <DialogFooter>
                                  <Button type="submit" disabled={editKipappMutation.isPending}>
                                    {editKipappMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data KIPAPP untuk {data.employees.name} periode {getMonthName(data.month)} {data.year} secara permanen.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={deleteKipappMutation.isPending}>Batal</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(data.id)}
                                disabled={deleteKipappMutation.isPending}
                              >
                                {deleteKipappMutation.isPending ? "Menghapus..." : "Hapus"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Kipapp;