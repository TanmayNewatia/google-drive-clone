"use client";

import { Edit, Trash2, MoreVertical, Download } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useRenameFile,
  useDeleteFile,
  useDownloadUrl,
} from "@/hooks/use-file-queries";
import { FileData } from "@/lib/file-api";

interface FileContextMenuProps {
  file: FileData;
}

export default function FileContextMenu({ file }: FileContextMenuProps) {
  const renameFileMutation = useRenameFile();
  const deleteFileMutation = useDeleteFile();
  const downloadUrl = useDownloadUrl(file.id);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newName, setNewName] = useState(file.original_name);

  const handleRename = async () => {
    if (!newName.trim() || newName === file.original_name) {
      setIsRenaming(false);
      return;
    }

    try {
      await renameFileMutation.mutateAsync({
        id: file.id,
        newName: newName.trim(),
      });
      setIsRenaming(false);
    } catch (error) {
      console.error("Rename failed:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFileMutation.mutateAsync(file.id);
      setIsDeleting(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleDownload = () => {
    window.open(downloadUrl, "_blank");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1 hover:bg-[#4a5051] rounded transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical size={16} className="text-[#9aa0a6]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 bg-[#2d2e30] border-[#3c4043] text-[#e8eaed]"
          align="end"
        >
          <DropdownMenuItem
            onClick={handleDownload}
            className="flex items-center gap-2 hover:bg-[#3c4043] focus:bg-[#3c4043] cursor-pointer"
          >
            <Download size={16} />
            Download
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#3c4043]" />
          <DropdownMenuItem
            onClick={() => setIsRenaming(true)}
            className="flex items-center gap-2 hover:bg-[#3c4043] focus:bg-[#3c4043] cursor-pointer"
          >
            <Edit size={16} />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleting(true)}
            className="flex items-center gap-2 hover:bg-[#3c4043] focus:bg-[#3c4043] cursor-pointer text-red-400"
          >
            <Trash2 size={16} />
            Move to trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="bg-[#2d2e30] border-[#3c4043] text-[#e8eaed]">
          <DialogHeader>
            <DialogTitle>Rename file</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="bg-[#3c4043] border-[#5f6368] text-[#e8eaed]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRename();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenaming(false)}
              className="bg-transparent border-[#5f6368] text-[#e8eaed] hover:bg-[#3c4043]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={renameFileMutation.isPending || !newName.trim()}
              className="bg-[#4a90e2] hover:bg-[#357abd] text-white"
            >
              {renameFileMutation.isPending ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="bg-[#2d2e30] border-[#3c4043] text-[#e8eaed]">
          <DialogHeader>
            <DialogTitle>Move to trash?</DialogTitle>
          </DialogHeader>
          <p className="text-[#9aa0a6]">
            "{file.filename}" will be moved to trash.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleting(false)}
              className="bg-transparent border-[#5f6368] text-[#e8eaed] hover:bg-[#3c4043]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteFileMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteFileMutation.isPending ? "Moving..." : "Move to trash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
