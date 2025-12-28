import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileAPI, FileData, ApiError } from "@/lib/file-api";
import { toast } from "@/hooks/use-toast";

// Query keys
export const fileKeys = {
  all: ["files"] as const,
  lists: () => [...fileKeys.all, "list"] as const,
  list: () => [...fileKeys.lists()] as const,
  details: () => [...fileKeys.all, "detail"] as const,
  detail: (id: number) => [...fileKeys.details(), id] as const,
  search: (query: string) => [...fileKeys.all, "search", query] as const,
} as const;

// Custom hooks for file operations
export function useFiles() {
  return useQuery({
    queryKey: fileKeys.list(),
    queryFn: () => FileAPI.getFiles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useFile(id: number) {
  return useQuery({
    queryKey: fileKeys.detail(id),
    queryFn: () => FileAPI.getFile(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSearchFiles(query: string) {
  return useQuery({
    queryKey: fileKeys.search(query),
    queryFn: () => FileAPI.searchFiles(query),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => FileAPI.uploadFile(file),
    onSuccess: (newFile) => {
      // Invalidate and refetch files list
      queryClient.invalidateQueries({ queryKey: fileKeys.list() });

      // Add the new file to the cache
      queryClient.setQueryData<FileData[]>(fileKeys.list(), (oldFiles) => {
        return oldFiles ? [newFile, ...oldFiles] : [newFile];
      });

      toast({
        title: "Success",
        description: `File "${newFile.original_name}" uploaded successfully!`,
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Upload Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRenameFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newName }: { id: number; newName: string }) =>
      FileAPI.renameFile(id, newName),
    onSuccess: (updatedFile, { id }) => {
      // Update the specific file in the cache
      queryClient.setQueryData<FileData>(fileKeys.detail(id), updatedFile);

      // Update the file in the files list
      queryClient.setQueryData<FileData[]>(fileKeys.list(), (oldFiles) => {
        return oldFiles?.map((file) => (file.id === id ? updatedFile : file));
      });

      toast({
        title: "Success",
        description: `File renamed to "${updatedFile.original_name}"`,
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Rename Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => FileAPI.deleteFile(id),
    onSuccess: (_, deletedId) => {
      // Remove the file from the cache
      queryClient.setQueryData<FileData[]>(fileKeys.list(), (oldFiles) => {
        return oldFiles?.filter((file) => file.id !== deletedId);
      });

      // Remove the individual file query
      queryClient.removeQueries({ queryKey: fileKeys.detail(deletedId) });

      toast({
        title: "Success",
        description: "File deleted successfully!",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Delete Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook for getting download URL
export function useDownloadUrl(id: number) {
  return FileAPI.getDownloadUrl(id);
}
