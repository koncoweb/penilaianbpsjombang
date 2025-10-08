import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import AdminLayout from "./components/layouts/AdminLayout";
import Employees from "./pages/admin/Employees";
import Kipapp from "./pages/admin/Kipapp";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      
      {/* Rute Khusus Admin */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/employees" element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        } />
        <Route path="/admin/kipapp" element={
          <ProtectedRoute>
            <Kipapp />
          </ProtectedRoute>
        } />
      </Route>

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;