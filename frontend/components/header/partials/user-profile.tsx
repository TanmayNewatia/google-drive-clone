"use client";

import { useAuth } from "@/contexts/auth-context";
import { LogIn, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserProfile() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-[#3c4043] animate-pulse" />;
  }

  if (!user) {
    return (
      <Button
        onClick={login}
        variant="ghost"
        size="sm"
        className="text-[#9aa0a6] hover:text-white hover:bg-[#3c4043] gap-2"
      >
        <LogIn size={16} />
        Sign In
      </Button>
    );
  }

  const userInitials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-[#4a90e2] text-white text-sm font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-[#2d2e30] border-[#3c4043] text-[#e8eaed]"
      >
        <DropdownMenuItem className="focus:bg-[#3c4043] focus:text-white">
          <User className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-sm text-[#9aa0a6]">{user.email}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#3c4043]" />
        <DropdownMenuItem
          onClick={logout}
          className="focus:bg-[#3c4043] focus:text-white cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
