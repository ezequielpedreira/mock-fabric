import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  accessLoading: boolean;
  isAdmin: boolean;
  onboardingCompleted: boolean;
  completeOnboarding: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessLoading, setAccessLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccessLoading(Boolean(session?.user));
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAccessLoading(Boolean(session?.user));
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setOnboardingCompleted(true);
      setAccessLoading(false);
      return;
    }

    let cancelled = false;
    setAccessLoading(true);

    Promise.all([
      supabase
        .from("profiles")
        .select("onboarding_completed_at")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase.rpc("is_admin"),
    ]).then(([profileResult, adminResult]) => {
      if (cancelled) return;
      setOnboardingCompleted(Boolean(profileResult.data?.onboarding_completed_at));
      setIsAdmin(adminResult.data === true);
      setAccessLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const completeOnboarding = useCallback(async () => {
    if (!user) return;
    const completedAt = new Date().toISOString();
    const { error } = await supabase
      .from("profiles")
      .update({ onboarding_completed_at: completedAt })
      .eq("user_id", user.id);
    if (error) throw error;
    setOnboardingCompleted(true);
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        accessLoading,
        isAdmin,
        onboardingCompleted,
        completeOnboarding,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
