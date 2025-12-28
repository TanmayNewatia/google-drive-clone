"use client";

import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  progress: number;
  isVisible: boolean;
  fileName?: string;
}

export function UploadProgress({
  progress,
  isVisible,
  fileName,
}: UploadProgressProps) {
  if (!isVisible) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-[#9aa0a6]">
        <span>{fileName ? `Uploading ${fileName}...` : "Uploading..."}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
