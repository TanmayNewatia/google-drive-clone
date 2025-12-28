"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function AuthCallback() {
  const router = useRouter();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Add a small delay to ensure session is established
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check authentication status after OAuth callback
        await checkAuth();

        // Redirect to home page
        router.push("/");
      } catch (error) {
        console.error("Auth callback error:", error);
        // Redirect to home page even on error (will show login page)
        router.push("/");
      }
    };

    handleCallback();
  }, [checkAuth, router]);
  return (
    <div className="min-h-screen bg-[#202124] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a90e2] mx-auto"></div>
        <p className="text-[#e8eaed]">Signing you in...</p>
      </div>
    </div>
  );
}
