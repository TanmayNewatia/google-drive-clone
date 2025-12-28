"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/sidebar";
import Header from "@/components/header/header";
import FileGrid from "@/components/file-grid/file-grid";
import { LoginPage } from "@/components/login-page";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const { user, loading } = useAuth();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#202124] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a90e2]"></div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Main authenticated app
  return (
    <div className="flex h-screen bg-[#202124] text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <FileGrid selectedFile={selectedFile} onFileClick={setSelectedFile} />
      </div>
    </div>
  );
}
