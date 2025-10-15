import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  ready: boolean;
  logout: () => Promise<void>;
  refetchProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  
  // Use refs to track if we've already fetched profile data
  const profileFetched = useRef<Set<string>>(new Set());
  const authTimeoutRef = useRef<NodeJS.Timeout>();

  const isEmailInAdminList = (email?: string | null): boolean => {
    if (!email) return false;
    const raw = import.meta.env.VITE_ADMIN_EMAILS as string | undefined;
    if (!raw) return false;
    const allowed = raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    return allowed.includes(email.toLowerCase());
  };

  const fetchUserProfile = useCallback(async (userId: string, userEmail?: string | null): Promise<boolean> => {
    // Prevent duplicate profile fetches for the same user
    if (profileFetched.current.has(userId)) {
      return true;
    }

    try {
      console.log("[AuthContext] Fetching profile for user:", userId);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
        
      // If not found or error 406, attempt to upsert a minimal profile row
      if (error) {
        console.warn("[AuthContext] Profile fetch error (will try upsert if missing):", error);
      }

      let resolvedRole = profile?.role as string | undefined;

      if (!resolvedRole) {
        const shouldBeAdmin = isEmailInAdminList(userEmail);
        const upsertRole = shouldBeAdmin ? 'admin' : 'user';
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({ id: userId, role: upsertRole })
          .eq('id', userId);
        if (upsertError) {
          console.error("[AuthContext] Profile upsert failed:", upsertError);
        } else {
          console.log("[AuthContext] Profile upserted with role:", upsertRole);
          resolvedRole = upsertRole;
        }
      }

      const emailOverrideAdmin = isEmailInAdminList(userEmail);
      const finalIsAdmin = (resolvedRole === 'admin') || emailOverrideAdmin;
      console.log("[AuthContext] Effective admin status:", finalIsAdmin, { resolvedRole, emailOverrideAdmin });
      setIsAdmin(finalIsAdmin);
      profileFetched.current.add(userId);
      return true;
    } catch (error) {
      console.error("[AuthContext] Profile fetch exception:", error);
      return false;
    }
  }, []);

  const clearAuthState = useCallback(() => {
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    profileFetched.current.clear();
  }, []);

  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      setReady(false);
      
      // Clear any existing timeout
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }

      // Set a timeout for auth initialization
      authTimeoutRef.current = setTimeout(() => {
        console.warn("[AuthContext] Auth initialization timeout");
        setLoading(false);
        setReady(true);
      }, 15000); // 15 second timeout

      console.log("[AuthContext] Checking session...");
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("[AuthContext] Session check error:", error);
        throw error;
      }
      
      console.log("[AuthContext] Session found:", !!currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Fire-and-forget fetch profile; don't block readiness
        fetchUserProfile(currentSession.user.id, currentSession.user.email)
          .catch((e) => console.warn("[AuthContext] fetchUserProfile error (non-blocking):", e));
      } else {
        clearAuthState();
      }
      
      // Clear timeout and mark as ready immediately after session check
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = undefined;
      }
      setLoading(false);
      setReady(true);
      
    } catch (error) {
      console.error("[AuthContext] Init error:", error);
      clearAuthState();
      setLoading(false);
      setReady(true);
    }
  }, [fetchUserProfile, clearAuthState]);

  useEffect(() => {
    initAuth();

    // Listen for auth changes - but don't refetch profile automatically
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[AuthContext] Auth state change:", event);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // On any healthy auth event, eagerly fetch profile and clear timeout
          const userId = session.user.id;
          const shouldResolveNow = (
            event === 'SIGNED_IN' ||
            event === 'INITIAL_SESSION' ||
            event === 'TOKEN_REFRESHED' ||
            event === 'USER_UPDATED'
          );

          if (shouldResolveNow) {
            fetchUserProfile(userId, session.user.email)
              .catch((e) => console.warn("[AuthContext] fetchUserProfile error (non-blocking):", e));
            if (authTimeoutRef.current) {
              clearTimeout(authTimeoutRef.current);
              authTimeoutRef.current = undefined;
            }
            setLoading(false);
            setReady(true);
          } else if (!profileFetched.current.has(userId)) {
            fetchUserProfile(userId, session.user.email).catch(() => {});
          }
        } else {
          clearAuthState();
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, [initAuth, fetchUserProfile, clearAuthState]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      clearAuthState();
    } catch (error) {
      console.error("[AuthContext] Logout error:", error);
    }
  }, [clearAuthState]);

  const refetchProfile = useCallback(async () => {
    if (user?.id) {
      // Clear the cache and refetch
      profileFetched.current.delete(user.id);
      await fetchUserProfile(user.id);
    }
  }, [user?.id, fetchUserProfile]);

  const value = {
    user,
    session,
    isAdmin,
    loading,
    ready,
    logout,
    refetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};