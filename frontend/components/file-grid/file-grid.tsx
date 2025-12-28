"use client";

import { FilterBar } from "./partials/filter-bar";
import { File, FileCard } from "./partials/file-card";

interface FileGridProps {
  files: File[];
  selectedFile: string | null;
  onFileClick: (id: string) => void;
  onFileAction?: (action: string, file: File) => void;
}

export default function FileGrid({
  files,
  selectedFile,
  onFileClick,
  onFileAction,
}: FileGridProps) {
  return (
    <div className="flex flex-col flex-1 overflow-auto p-6 gap-4">
      <FilterBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            selectedFile={selectedFile}
            onFileClick={onFileClick}
            onFileAction={onFileAction}
          />
        ))}
      </div>
    </div>
  );
}
