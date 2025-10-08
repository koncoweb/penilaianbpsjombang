import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [kipappData, setKipappData] = useState<KipappData[]>([]);
  const [editingKipapp, setEditingKipapp] = useState<KipappData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from("employees").select("id, name");
    if (error) {
      toast({ title: "Error", description: "Gagal memuat data pegawai.", variant: "destructive" });
    } else {
      setEmployees(data);
    }
  };

  const fetchKipappData = async () => {
    const { data, error } = await supabase.from("kipapp").select("*, employees(name)").order('year, month', { ascending: false });
    if (error) {
      toast({ title: "Error", description: "Gagal memuat data KIPAPP.", variant: "destructive" });
    } else {
      setKipappData(data as KipappData[]);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchKipappData();
  }, []);
  
  useEffect(() => {
    if (editingKipapp) {
      editForm.reset({
          employee_id: kipappData.find(k => k.id === editingKipapp.id)?.employees.name, // This is tricky, we need employee_id
          month: editingKipapp.month,
          year: editingKipapp.year,
          kipapp_value: editingKipapp.kipapp_value,
      });
    }
  }, [editingKipapp, editForm, kipappData]);


  const onAddSubmit = async (values: z.infer<typeof kipappSchema>) => {
    const { error } = await supabase.from("kipapp").insert([values]);
    if (error) {
      let errorMessage = `Gagal menambahkan data: ${error.message}`;
      if (error.code === '23505') {
        errorMessage = 'Data KIPAPP untuk pegawai ini pada bulan dan tahun yang sama sudah ada.';
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } else {
      toast({ title: "Sukses", description: "Data KIPAPP berhasil ditambahkan." });
      addForm.reset({
        employee_id: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        kipapp_value: 0,
      });
      fetchKipappData();
    }
  };

  const onEditSubmit = async (values: z.infer<typeof kipappSchema>) => {
    if (!editingKipapp) return;
    // We only update value, not the identifiers
    const { error } = await supabase.from("kipapp").update({ kipapp_value: values.kipapp_value }).eq("id", editingKipapp.id);
    if (error) {
      toast({ title: "Error", description: `Gagal memperbarui data: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Sukses", description: "Data KIPAPP berhasil diperbarui." });
      setIsEditDialogOpen(false);
      setEditingKipapp(null);
      fetchKipappData();
    }
  };

  const handleDelete = async (kipappId: string) => {
    const { error } = await supabase.from("kipapp").delete().eq("id", kipappId);
    if (error) {
      toast({ title: "Error", description: `Gagal menghapus data: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Sukses", description: "Data KIPAPP berhasil dihapus." });
      fetchKipappData();
    }
  };

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
                <FormField control={addForm.control} name="month" render={({ field }) => (<FormItem><FormLabel>Bulan</FormLabel><Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{Array.from({ length: 12 }, (_, i) => (<SelectItem key={i + 1} value={String(i + 1)}>{getMonthName(i + 1)}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={addForm.control} name="year" render={({ field }) => (<FormItem><FormLabel>Tahun</FormLabel><FormControl><Input type="number" placeholder="Contoh: 2024" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addForm.control} name="kipapp_value" render={({ field }) => (<FormItem><FormLabel>Nilai KIPAPP</FormLabel><FormControl><Input type="number" step="0.01" placeholder="Masukkan nilai" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <Button type="submit" className="w-full">Simpan</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Daftar Data KIPAPP</CardTitle></CardHeader>
          <CardContent>
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
                    <TableCell>{data.kipapp_value}</TableCell>
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
                                <DialogFooter><Button type="submit">Simpan Perubahan</Button></DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data KIPAPP untuk {data.employees.name} periode {getMonthName(data.month)} {data.year} secara permanen.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(data.id)}>Hapus</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Kipapp;