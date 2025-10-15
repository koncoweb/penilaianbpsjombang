import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, FileText, BarChart3, CalendarX } from "lucide-react";

const navItems = [
  { href: "/admin/employees", label: "Data Pegawai", icon: Users },
  { href: "/admin/kipapp", label: "Data KIPAPP", icon: FileText },
  { href: "/admin/absen", label: "Data Absen", icon: CalendarX },
  { href: "/admin/quarterly-report", label: "Laporan Triwulan", icon: BarChart3 },
  { href: "/admin/renak-can", label: "RENAK CAN", icon: FileText },
];

const AdminLayout = () => {
  const { isAdmin, user, logout } = useAuth();
  const location = useLocation();

  // AdminLayout no longer needs to check loading or auth
  // ProtectedRoute already handles auth loading and redirects
  // This component only needs to check admin status
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/" className="text-lg font-semibold">
          Admin Panel
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              location.pathname === item.href && "bg-muted text-primary",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t p-4">
        <div className="text-sm">
          <div className="font-semibold">{user?.email}</div>
          <div className="text-xs text-muted-foreground">Admin</div>
        </div>
        <Button variant="ghost" onClick={logout} className="mt-2 w-full justify-start">
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <SidebarContent />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Bisa ditambahkan search bar atau elemen header lain di sini */}
          </div>
        </header>
        <main className="flex-1 bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;