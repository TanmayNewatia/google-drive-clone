"use client";

import { RefObject } from "react";

interface FileInputProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
}

export function FileInput({
  fileInputRef,
  onFileSelect,
  accept = "*",
  multiple = false,
}: FileInputProps) {
  return (
    <input
      ref={fileInputRef}
      type="file"
      onChange={onFileSelect}
      accept={accept}
      multiple={multiple}
      className="hidden"
    />
  );
}
