"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/sidebar";
import Header from "@/components/header/header";
import FileGrid from "@/components/file-grid/file-grid";
import { LoginPage } from "@/components/login-page";
import { useAuth } from "@/contexts/auth-context";

interface File {
  id: string;
  name: string;
  type: "file" | "folder";
  icon: string;
  modified: string;
  size?: string;
  owner?: string;
}

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

  const files: File[] = [
    {
      id: "1",
      name: "File1.txt",
      type: "file",
      icon: "📄",
      modified: "2023-12-26T10:30:00Z",
      size: "2.5 KB",
      owner: "john.doe@example.com",
    },
    {
      id: "2",
      name: "Project Proposal.docx",
      type: "file",
      icon: "📊",
      modified: "2023-12-20T14:15:00Z",
      size: "1.2 MB",
      owner: "jane.smith@example.com",
    },
    {
      id: "3",
      name: "Budget 2025.xlsx",
      type: "file",
      icon: "📈",
      modified: "2023-12-24T09:45:00Z",
      size: "856 KB",
      owner: "bob.wilson@example.com",
    },
    {
      id: "4",
      name: "Video Presentation.mp4",
      type: "file",
      icon: "🎬",
      modified: "2023-12-22T16:20:00Z",
      size: "125 MB",
      owner: "alice.brown@example.com",
    },
    {
      id: "5",
      name: "Documents",
      type: "folder",
      icon: "📁",
      modified: "2023-12-25T11:00:00Z",
      owner: "john.doe@example.com",
    },
  ];

  const handleFileClick = (fileId: string) => {
    setSelectedFile(fileId);
  };

  const handleFileAction = (action: string, file: File) => {
    console.log(`Action "${action}" performed on file:`, file);

    // Handle different actions
    switch (action) {
      case "rename":
        console.log(`Renaming ${file.name}`);
        break;
      case "delete":
        console.log(`Moving ${file.name} to trash`);
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  return (
    <div className="flex h-screen bg-[#202124] text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <FileGrid
          files={files}
          selectedFile={selectedFile}
          onFileClick={handleFileClick}
          onFileAction={handleFileAction}
        />
      </div>
    </div>
  );
}
