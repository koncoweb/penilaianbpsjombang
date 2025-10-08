import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Aplikasi Penilaian Kinerja</h1>
        <Button onClick={logout} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isAdmin && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Pegawai</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link to="/admin/employees">
                  <Button className="w-full">Kelola Pegawai</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data KIPAPP</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link to="/admin/kipapp">
                  <Button className="w-full">Kelola KIPAPP</Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profil</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <p>Email: {user?.email}</p>
              <p>Role: {isAdmin ? "Admin" : "User"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;