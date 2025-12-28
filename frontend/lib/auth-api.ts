import { getApiUrl } from "./config";

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
}

export interface AuthResponse {
  user: User | null;
  isAuthenticated?: boolean;
}

export class AuthAPI {
  // Check current authentication status
  static async checkAuth(): Promise<AuthResponse> {
    const response = await fetch(getApiUrl("/auth/user"), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { user: null };
    }

    return response.json();
  }

  // Logout user
  static async logout(): Promise<void> {
    await fetch(getApiUrl("/auth/logout"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Get login URL for Google OAuth
  static getLoginUrl(): string {
    return getApiUrl("/auth/google");
  }
}

// Query keys for auth
export const authKeys = {
  user: ["auth", "user"] as const,
} as const;
