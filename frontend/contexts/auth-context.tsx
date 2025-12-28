"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthAPI, User, authKeys } from "@/lib/auth-api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refetchAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Use React Query for auth state
  const {
    data: authData,
    isLoading: loading,
    refetch: refetchAuth,
  } = useQuery({
    queryKey: authKeys.user,
    queryFn: AuthAPI.checkAuth,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth failures
  });

  const user = authData?.user || null;

  const login = () => {
    // Redirect to Google OAuth
    window.location.href = AuthAPI.getLoginUrl();
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
      // Clear all queries and reset auth state
      queryClient.clear();
      queryClient.setQueryData(authKeys.user, { user: null });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refetchAuth: () => refetchAuth(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
