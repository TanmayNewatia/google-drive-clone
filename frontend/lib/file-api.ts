interface FileData {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  owner_id: number;
  created_at: string;
  modified_at: string;
  uploaded_at: string;
  is_deleted: number;
}

interface ApiResponse<T> {
  message?: string;
  files?: T[];
  file?: T;
  query?: string;
  error?: string;
}

const API_BASE_URL = "http://localhost:3001/api";

export class FileAPI {
  private static async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Get all files for the authenticated user
  static async getFiles(): Promise<FileData[]> {
    const response: ApiResponse<FileData> = await this.fetchWithAuth(
      `${API_BASE_URL}/files`
    );
    return response.files || [];
  }

  // Get a specific file by ID
  static async getFile(id: number): Promise<FileData> {
    const response: ApiResponse<FileData> = await this.fetchWithAuth(
      `${API_BASE_URL}/files/${id}`
    );
    return response.file!;
  }

  // Upload a new file
  static async uploadFile(file: File): Promise<FileData> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Upload failed! status: ${response.status}`
      );
    }

    const result: ApiResponse<FileData> = await response.json();
    return result.file!;
  }

  // Rename a file
  static async renameFile(id: number, newName: string): Promise<FileData> {
    const response: ApiResponse<FileData> = await this.fetchWithAuth(
      `${API_BASE_URL}/files/${id}/rename`,
      {
        method: "PUT",
        body: JSON.stringify({ newName }),
      }
    );
    return response.file!;
  }

  // Delete a file (soft delete)
  static async deleteFile(id: number): Promise<void> {
    await this.fetchWithAuth(`${API_BASE_URL}/files/${id}`, {
      method: "DELETE",
    });
  }

  // Search files
  static async searchFiles(query: string): Promise<FileData[]> {
    const response: ApiResponse<FileData> = await this.fetchWithAuth(
      `${API_BASE_URL}/files/search?q=${encodeURIComponent(query)}`
    );
    return response.files || [];
  }

  // Download a file
  static getDownloadUrl(id: number): string {
    return `${API_BASE_URL}/files/${id}/download`;
  }

  // Format file size for display
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Get file icon based on mime type
  static getFileIcon(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("video/")) return "🎥";
    if (mimeType.startsWith("audio/")) return "🎵";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("document") || mimeType.includes("doc")) return "📝";
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
      return "📊";
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
      return "📈";
    if (mimeType.includes("zip") || mimeType.includes("archive")) return "📦";
    return "📄";
  }
}

export type { FileData, ApiResponse };
