"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadButtonProps {
  isUploading: boolean;
  onTriggerSelect: () => void;
}

export function UploadButton({
  isUploading,
  onTriggerSelect,
}: UploadButtonProps) {
  return (
    <Button
      onClick={onTriggerSelect}
      disabled={isUploading}
      className="bg-[#4a90e2] hover:bg-[#357abd] text-white gap-2"
    >
      <Upload size={16} />
      {isUploading ? "Uploading..." : "Upload File"}
    </Button>
  );
}
