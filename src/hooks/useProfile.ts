import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { isProTier } from '@/lib/profile';

export function useProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const query = useQuery({
    queryKey: ['profile', user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) throw error;
      return data;
    },
  });
  return { ...query, profile: query.data, isPro: isProTier(query.data?.tier), ai_credits: query.data?.ai_credits, isLoading: authLoading || (!!user && query.isPending) };
}