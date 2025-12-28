"use client";

import { X } from "lucide-react";
import { FilterBar } from "./partials/filter-bar";
import { FileCard } from "./partials/file-card";
import { FileUpload } from "@/components/file-upload";
import { useFiles } from "@/hooks/use-file-queries";

interface FileGridProps {
  selectedFile: string | null;
  onFileClick: (id: string) => void;
}

export default function FileGrid({ selectedFile, onFileClick }: FileGridProps) {
  const { data: files = [], isLoading, error, refetch } = useFiles();
  if (isLoading) {
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
            <p className="text-[#9aa0a6] text-sm">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-[#4a90e2] text-white rounded-lg hover:bg-[#357abd] transition-colors"
            >
              Try Again
            </button>
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
