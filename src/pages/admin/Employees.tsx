import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee, employeeSchema } from "@/entities/employees/hooks";
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

type Employee = z.infer<typeof employeeSchema> & { id: string };

const Employees = () => {
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const addForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { name: "", nip: "", position: "" },
  });

  const editForm = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
  });

  const { data: employees = [], isLoading, error } = useEmployees();

  // Show error toast if query fails
  if (error) {
    toast({ 
      title: "Error", 
      description: "Gagal memuat data pegawai.", 
      variant: "destructive" 
    });
  }

  // Reset edit form when editing employee changes
  if (editingEmployee) {
    editForm.reset(editingEmployee);
  }

  // Add employee mutation
  const addEmployeeMutation = createEmployee;

  // Edit employee mutation
  const editEmployeeMutation = updateEmployee;

  // Delete employee mutation
  const deleteEmployeeMutation = deleteEmployee;

  const onAddSubmit = (values: z.infer<typeof employeeSchema>) => {
    addEmployeeMutation.mutate(values, {
      onSuccess: () => {
        toast({ title: "Sukses", description: "Pegawai berhasil ditambahkan." });
        addForm.reset();
      },
      onError: (error: any) => {
        let errorMessage = `Gagal menambahkan pegawai: ${error.message}`;
        if (error.code === '23505' && error.details?.includes('nip')) {
          errorMessage = 'NIP ini sudah digunakan oleh pegawai lain. Harap cek kembali dan gunakan NIP yang berbeda.';
        }
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
      },
    });
  };

  const onEditSubmit = (values: z.infer<typeof employeeSchema>) => {
    if (!editingEmployee) return;
    editEmployeeMutation.mutate({ id: editingEmployee.id, values }, {
      onSuccess: () => {
        toast({ title: "Sukses", description: "Data pegawai berhasil diperbarui." });
        setIsEditDialogOpen(false);
        setEditingEmployee(null);
      },
      onError: (error: any) => {
        let errorMessage = `Gagal memperbarui pegawai: ${error.message}`;
        if (error.code === '23505' && error.details?.includes('nip')) {
          errorMessage = 'NIP ini sudah digunakan oleh pegawai lain. Harap cek kembali dan gunakan NIP yang berbeda.';
        }
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
      },
    });
  };

  const handleDelete = (employeeId: string) => {
    deleteEmployeeMutation.mutate(employeeId, {
      onSuccess: () => {
        toast({ title: "Sukses", description: "Pegawai berhasil dihapus." });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: `Gagal menghapus pegawai: ${error.message}`, variant: "destructive" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Manajemen Data Pegawai</h1>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data pegawai...</p>
          </div>
        </div>
      </div>
    );
  }

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
                <Button variant="gradient" type="submit" className="w-full" disabled={addEmployeeMutation.isPending}>
                  {addEmployeeMutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Daftar Pegawai</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                                  <Button type="submit" disabled={editEmployeeMutation.isPending}>
                                    {editEmployeeMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                                  </Button>
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
                              <AlertDialogCancel disabled={deleteEmployeeMutation.isPending}>Batal</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(employee.id)}
                                disabled={deleteEmployeeMutation.isPending}
                              >
                                {deleteEmployeeMutation.isPending ? "Menghapus..." : "Hapus"}
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

export default Employees;