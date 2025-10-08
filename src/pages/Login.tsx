import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate('/');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Aplikasi Penilaian Kinerja</h2>
        <p className="mb-6 text-center text-gray-600">BPS Kabupaten Jombang</p>
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
  );
};

export default Login;