import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthAPI, authKeys, User } from "@/lib/auth-api";

// Hook for checking authentication status
export function useAuthQuery() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: AuthAPI.checkAuth,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth failures
  });
}

// Hook for logout mutation
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthAPI.logout,
    onSuccess: () => {
      // Clear all queries and reset auth state
      queryClient.clear();
      queryClient.setQueryData(authKeys.user, { user: null });
    },
  });
}

// Hook to get current user from cache
export function useCurrentUser(): User | null {
  const queryClient = useQueryClient();
  const authData = queryClient.getQueryData<{ user: User | null }>(
    authKeys.user
  );
  return authData?.user || null;
}

// Hook to invalidate auth queries (useful after login callback)
export function useRefreshAuth() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: authKeys.user });
  };
}
