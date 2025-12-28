"use client";

import { AlertCircle, X } from "lucide-react";
import { ApiError } from "@/lib/file-api";

interface UploadErrorProps {
  error: ApiError | Error | null;
  onDismiss?: () => void;
}

export function UploadError({ error, onDismiss }: UploadErrorProps) {
  if (!error) return null;

  return (
    <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertCircle size={16} className="text-red-400" />
        <span className="text-red-300 text-sm">
          {error instanceof ApiError ? error.message : "Upload failed"}
        </span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
