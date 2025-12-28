"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, HardDrive } from "lucide-react";

export function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-[#202124] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#2d2e30] border-[#3c4043]">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-[#4a90e2] rounded-full flex items-center justify-center">
            <HardDrive className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#e8eaed]">
            Welcome to Drive Clone
          </CardTitle>
          <CardDescription className="text-[#9aa0a6]">
            Sign in to access your files and start collaborating
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={login}
            className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Sign in with Google
          </Button>

          <div className="text-center">
            <p className="text-sm text-[#9aa0a6]">
              By signing in, you agree to our terms of service and privacy
              policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
