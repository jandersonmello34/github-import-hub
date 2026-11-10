import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<{ user: User | null; isLoading: boolean }>({ user: null, isLoading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    let active = true;
    let revision = 0;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) return;
      revision++;
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (event === 'SIGNED_OUT') queryClient.clear();
      else void queryClient.invalidateQueries();
      void router.invalidate();
    });
    const initialRevision = revision;
    void supabase.auth.getUser().then(({ data }) => {
      if (!active || revision !== initialRevision) return;
      setUser(data.user);
      setIsLoading(false);
    }).catch(() => { if (active) setIsLoading(false); });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [queryClient, router]);
  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }