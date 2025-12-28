"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { FileAPI, FileData } from "@/lib/file-api";
import { useAuth } from "./auth-context";

interface FilesContextType {
  files: FileData[];
  loading: boolean;
  error: string | null;
  refreshFiles: () => Promise<void>;
  uploadFile: (file: File) => Promise<void>;
  renameFile: (id: number, newName: string) => Promise<void>;
  deleteFile: (id: number) => Promise<void>;
  searchFiles: (query: string) => Promise<FileData[]>;
  clearError: () => void;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export function FilesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const refreshFiles = async () => {
    if (!user) {
      setFiles([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userFiles = await FileAPI.getFiles();
      setFiles(userFiles);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch files";
      setError(errorMessage);
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    setError(null);

    try {
      const uploadedFile = await FileAPI.uploadFile(file);
      setFiles((prev) => [uploadedFile, ...prev]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload file";
      setError(errorMessage);
      throw err;
    }
  };

  const renameFile = async (id: number, newName: string) => {
    setError(null);

    try {
      const renamedFile = await FileAPI.renameFile(id, newName);
      setFiles((prev) =>
        prev.map((file) => (file.id === id ? renamedFile : file))
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to rename file";
      setError(errorMessage);
      throw err;
    }
  };

  const deleteFile = async (id: number) => {
    setError(null);

    try {
      await FileAPI.deleteFile(id);
      setFiles((prev) => prev.filter((file) => file.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete file";
      setError(errorMessage);
      throw err;
    }
  };

  const searchFiles = async (query: string): Promise<FileData[]> => {
    if (!user) return [];

    setError(null);

    try {
      const searchResults = await FileAPI.searchFiles(query);
      return searchResults;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search files";
      setError(errorMessage);
      return [];
    }
  };

  // Load files when user authentication changes
  useEffect(() => {
    refreshFiles();
  }, [user]);

  const value: FilesContextType = {
    files,
    loading,
    error,
    refreshFiles,
    uploadFile,
    renameFile,
    deleteFile,
    searchFiles,
    clearError,
  };

  return (
    <FilesContext.Provider value={value}>{children}</FilesContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
}
