import { useState, useRef } from "react";
import { useUploadFile } from "./use-file-queries";

export function useFileUpload() {
  const uploadFileMutation = useUploadFile();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [localError, setLocalError] = useState<Error | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadFile(file);
  };

  const handleFilesDrop = async (files: FileList) => {
    if (files.length === 0) return;

    const file = files[0]; // For now, just take the first file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setSelectedFileName(file.name);
    setUploadProgress(0);
    setLocalError(null);

    try {
      // Simulate progress (since we don't have real progress from API)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      await uploadFileMutation.mutateAsync(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setUploadProgress(0);
        setSelectedFileName("");
      }, 1000);
    } catch (error) {
      setUploadProgress(0);
      setLocalError(
        error instanceof Error ? error : new Error("Upload failed")
      );
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

  const clearError = () => {
    setLocalError(null);
  };

  return {
    uploadProgress,
    selectedFileName,
    isUploading: uploadFileMutation.isPending,
    fileInputRef,
    handleFileSelect,
    handleFilesDrop,
    triggerFileSelect,
    error: localError || uploadFileMutation.error,
    clearError,
  };
}
