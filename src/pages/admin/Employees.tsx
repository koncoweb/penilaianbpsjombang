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

const employeeSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  nip: z.string().min(1, "NIP harus diisi"),
  position: z.string().min(1, "Jabatan harus diisi"),
});

const Employees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      nip: "",
      position: "",
    },
  });

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from("employees").select("*").order('created_at', { ascending: false });
    if (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data pegawai.",
        variant: "destructive",
      });
    } else {
      setEmployees(data);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onSubmit = async (values: z.infer<typeof employeeSchema>) => {
    const { error } = await supabase.from("employees").insert([values]);
    if (error) {
      toast({
        title: "Error",
        description: `Gagal menambahkan pegawai: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sukses",
        description: "Pegawai berhasil ditambahkan.",
      });
      form.reset();
      fetchEmployees();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Manajemen Data Pegawai</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tambah Pegawai Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama pegawai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIP</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan NIP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jabatan</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan jabatan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Simpan
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Daftar Pegawai</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Jabatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.nip}</TableCell>
                    <TableCell>{employee.position}</TableCell>
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