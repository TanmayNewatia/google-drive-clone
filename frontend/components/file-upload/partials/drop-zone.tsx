"use client";

import { useState, DragEvent } from "react";
import { Upload, FileText } from "lucide-react";

interface DropZoneProps {
  onFilesDrop: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export function DropZone({
  onFilesDrop,
  accept = "*",
  multiple = false,
  disabled = false,
  className = "",
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFilesDrop(files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center transition-colors
        ${
          isDragOver
            ? "border-[#4a90e2] bg-[#4a90e2]/10"
            : "border-[#3c4043] hover:border-[#5f6368]"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      <div className="flex flex-col items-center gap-3">
        {isDragOver ? (
          <Upload size={32} className="text-[#4a90e2]" />
        ) : (
          <FileText size={32} className="text-[#9aa0a6]" />
        )}

        <div className="text-sm">
          {isDragOver ? (
            <p className="text-[#4a90e2] font-medium">Drop files here</p>
          ) : (
            <>
              <p className="text-[#e8eaed]">Drag and drop files here</p>
              <p className="text-[#9aa0a6] mt-1">or click the button above</p>
            </>
          )}
        </div>

        {accept !== "*" && (
          <p className="text-xs text-[#9aa0a6]">Supported files: {accept}</p>
        )}
      </div>
    </div>
  );
}
