// Configuration file to manage environment variables
export const config = {
  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
  },
  file: {
    maxSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "104857600"), // 100MB default
    allowedTypes: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || "*",
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Google Drive Clone",
    company: process.env.NEXT_PUBLIC_COMPANY_NAME || "Your Company",
  },
} as const;

// Helper functions for configuration
export const getApiUrl = (endpoint: string) => {
  return `${config.api.baseUrl}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const isFileSizeValid = (fileSize: number): boolean => {
  return fileSize <= config.file.maxSize;
};
