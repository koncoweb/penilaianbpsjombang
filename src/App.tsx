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
import QuarterlyReport from "./pages/admin/QuarterlyReport";
import Absen from "./pages/admin/Absen";
import RenakCan from "./pages/admin/RenakCan";
import LoadingDebugger from "./components/LoadingDebugger";
import React from "react";

// Configure React Query with proper defaults to prevent infinite loading and improve caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data fresh for 5 minutes to prevent unnecessary refetches
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache for 10 minutes after component unmount
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Don't refetch on window focus to prevent infinite loading
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect to prevent infinite loading
      refetchOnReconnect: false,
      // Retry failed requests with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors (auth issues)
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

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

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, session, isAdmin } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
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
        <Route path="/admin/employees" element={<AdminRoute><Employees /></AdminRoute>} />
        <Route path="/admin/kipapp" element={<AdminRoute><Kipapp /></AdminRoute>} />
        <Route path="/admin/quarterly-report" element={<AdminRoute><QuarterlyReport /></AdminRoute>} />
        <Route path="/admin/absen" element={<AdminRoute><Absen /></AdminRoute>} />
        <Route path="/admin/renak-can" element={<AdminRoute><RenakCan /></AdminRoute>} />
      </Route>

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("Unhandled app error:", error);
  }
  render() {
    if (this.state.hasError) {
      return <div className="flex h-screen items-center justify-center">Terjadi kesalahan. Silakan muat ulang halaman.</div>;
    }
    return this.props.children as any;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <LoadingDebugger />
            <AppRoutes />
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;