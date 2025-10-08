import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { session, isAdmin, profile } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="text-4xl font-bold">Selamat Datang!</h1>
        <p className="mt-2 text-xl text-gray-600">
          Anda login sebagai {profile?.full_name || session.user.email}
        </p>
        <p className="text-md mt-1 font-semibold text-blue-600">
          Peran: {isAdmin ? "Admin" : "User"}
        </p>

        <div className="mt-8 space-y-4">
          {isAdmin && (
            <Button asChild size="lg">
              <Link to="/admin/employees">Kelola Data Pegawai</Link>
            </Button>
          )}
          <div className="mt-4">
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;