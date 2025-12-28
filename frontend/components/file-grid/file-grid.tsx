"use client";

import { X } from "lucide-react";
import { FilterBar } from "./partials/filter-bar";
import { FileCard } from "./partials/file-card";
import { FileUpload } from "@/components/file-upload";
import { useFiles } from "@/contexts/files-context";
import { FileAPI, FileData } from "@/lib/file-api";
import { useState } from "react";

interface FileGridProps {
  selectedFile: string | null;
  onFileClick: (id: string) => void;
}

export default function FileGrid({ selectedFile, onFileClick }: FileGridProps) {
  const { files, loading, error, clearError } = useFiles();

  if (loading) {
    return (
      <div className="flex flex-col flex-1 overflow-auto p-6 gap-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a90e2] mx-auto mb-4"></div>
            <p className="text-[#9aa0a6]">Loading files...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 overflow-auto p-6 gap-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-2">Error loading files</p>
            <p className="text-[#9aa0a6] text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1 overflow-auto p-6 gap-4">
      <div className="flex items-center justify-between">
        <FilterBar />
        <FileUpload />
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {files.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-[#e8eaed] mb-2">No files yet</p>
            <p className="text-[#9aa0a6] text-sm">
              Upload your first file to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              selectedFile={selectedFile}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
