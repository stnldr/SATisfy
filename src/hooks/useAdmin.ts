import { useQuery } from '@tanstack/react-query';
import { isAdmin, isUserAdmin } from '@/lib/supabase/admin';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to check if current user is admin
 */
export function useIsAdmin() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: () => isAdmin(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Hook to check if a specific user is admin
 */
export function useIsUserAdmin(userId: string | undefined) {
  return useQuery({
    queryKey: ['isUserAdmin', userId],
    queryFn: () => userId ? isUserAdmin(userId) : Promise.resolve(false),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}





