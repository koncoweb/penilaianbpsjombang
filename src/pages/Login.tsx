import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AppHeader from '@/components/AppHeader';

const Login = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader />
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600">Masuk ke sistem penilaian kinerja</p>
          </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
          socialLayout="horizontal"
          redirectTo={window.location.origin}
        />
        </div>
      </div>
    </div>
  );
};

export default Login;