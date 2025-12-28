"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFiles } from "@/contexts/files-context";
import { Progress } from "@/components/ui/progress";

export function FileUpload() {
  const { uploadFile } = useFiles();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress (since we don't have real progress from API)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      await uploadFile(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 1000);
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      console.error("Upload failed:", error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        multiple={false}
      />

      <Button
        onClick={triggerFileSelect}
        disabled={uploading}
        className="bg-[#4a90e2] hover:bg-[#357abd] text-white gap-2"
      >
        <Upload size={16} />
        {uploading ? "Uploading..." : "Upload File"}
      </Button>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-[#9aa0a6]">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  );
}
