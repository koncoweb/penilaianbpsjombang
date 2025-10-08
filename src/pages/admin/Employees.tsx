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

const employeeSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  nip: z.string().min(1, "NIP harus diisi"),
  position: z.string().min(1, "Jabatan harus diisi"),
});

type Employee = z.infer<typeof employeeSchema> & { id: string };

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const addForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { name: "", nip: "", position: "" },
  });

  const editForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    if (editingEmployee) {
      editForm.reset(editingEmployee);
    }
  }, [editingEmployee, editForm]);

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from("employees").select("*").order('created_at', { ascending: false });
    if (error) {
      toast({ title: "Error", description: "Gagal memuat data pegawai.", variant: "destructive" });
    } else {
      setEmployees(data as Employee[]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onAddSubmit = async (values: z.infer<typeof employeeSchema>) => {
    const { error } = await supabase.from("employees").insert([values]);
    if (error) {
      toast({ title: "Error", description: `Gagal menambahkan pegawai: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Sukses", description: "Pegawai berhasil ditambahkan." });
      addForm.reset();
      fetchEmployees();
    }
  };

  const onEditSubmit = async (values: z.infer<typeof employeeSchema>) => {
    if (!editingEmployee) return;
    const { error } = await supabase.from("employees").update(values).eq("id", editingEmployee.id);
    if (error) {
      toast({ title: "Error", description: `Gagal memperbarui pegawai: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Sukses", description: "Data pegawai berhasil diperbarui." });
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    }
  };

  const handleDelete = async (employeeId: string) => {
    const { error } = await supabase.from("employees").delete().eq("id", employeeId);
    if (error) {
      toast({ title: "Error", description: `Gagal menghapus pegawai: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Sukses", description: "Pegawai berhasil dihapus." });
      fetchEmployees();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Manajemen Data Pegawai</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader><CardTitle>Tambah Pegawai Baru</CardTitle></CardHeader>
          <CardContent>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                <FormField control={addForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input placeholder="Masukkan nama pegawai" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addForm.control} name="nip" render={({ field }) => (<FormItem><FormLabel>NIP</FormLabel><FormControl><Input placeholder="Masukkan NIP" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addForm.control} name="position" render={({ field }) => (<FormItem><FormLabel>Jabatan</FormLabel><FormControl><Input placeholder="Masukkan jabatan" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <Button type="submit" className="w-full">Simpan</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Daftar Pegawai</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.nip}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog open={isEditDialogOpen && editingEmployee?.id === employee.id} onOpenChange={(open) => { if (!open) { setEditingEmployee(null); setIsEditDialogOpen(false); } else { setEditingEmployee(employee); setIsEditDialogOpen(true); }}}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Edit Data Pegawai</DialogTitle></DialogHeader>
                            <Form {...editForm}>
                              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                                <FormField control={editForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={editForm.control} name="nip" render={({ field }) => (<FormItem><FormLabel>NIP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={editForm.control} name="position" render={({ field }) => (<FormItem><FormLabel>Jabatan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <DialogFooter>
                                  <Button type="submit">Simpan Perubahan</Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data pegawai secara permanen.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(employee.id)}>Hapus</AlertDialogAction>
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

export default Employees;