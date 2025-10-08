import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Atau komponen skeleton/spinner
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminLayout;