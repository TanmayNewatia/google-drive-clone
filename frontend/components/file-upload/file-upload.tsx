"use client";

import { useFileUpload } from "@/hooks/use-file-upload";
import {
  FileInput,
  UploadButton,
  UploadProgress,
  UploadError,
  DropZone,
} from "./partials";

export function FileUpload() {
  const {
    uploadProgress,
    selectedFileName,
    isUploading,
    fileInputRef,
    handleFileSelect,
    triggerFileSelect,
    error,
    clearError,
  } = useFileUpload();

  return (
    <div className="space-y-4">
      <FileInput
        fileInputRef={fileInputRef}
        onFileSelect={handleFileSelect}
        multiple={false}
      />

      <div className="flex flex-col gap-4">
        <UploadButton
          isUploading={isUploading}
          onTriggerSelect={triggerFileSelect}
        />
      </div>

      <UploadProgress
        progress={uploadProgress}
        isVisible={isUploading}
        fileName={selectedFileName}
      />

      <UploadError error={error} onDismiss={clearError} />
    </div>
  );
}
