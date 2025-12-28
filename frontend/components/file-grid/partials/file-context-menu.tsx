"use client";

import { Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback } from "react";

export interface File {
  id: string;
  name: string;
  type: "file" | "folder";
  icon: string;
  modified: string;
  size?: string;
  owner?: string;
}

interface FileContextMenuProps {
  file: File;
  trigger: React.ReactNode;
  onAction?: (action: string, file: File) => void;
}

// CSS class constants for better maintainability
const MENU_CLASSES = {
  content: "w-48 bg-[#303134] border-[#3c4043] text-[#e8eaed]",
  separator: "bg-[#3c4043]",
  item: "text-[#e8eaed] hover:bg-[#3c4043] focus:bg-[#3c4043]",
  destructive: "text-red-400 hover:bg-red-600/10 focus:bg-red-600/10",
} as const;

export default function FileContextMenu({
  file,
  trigger,
  onAction,
}: FileContextMenuProps) {
  // Memoized action handler to prevent unnecessary re-renders
  const handleAction = useCallback(
    (action: string) => {
      onAction?.(action, file);
    },
    [onAction, file]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className={MENU_CLASSES.content} align="start">
        {/* Rename Action */}
        <DropdownMenuItem
          className={MENU_CLASSES.item}
          onClick={() => handleAction("rename")}
        >
          <Edit size={16} />
          Rename
        </DropdownMenuItem>

        <DropdownMenuSeparator className={MENU_CLASSES.separator} />

        {/* Destructive Action */}
        <DropdownMenuItem
          className={MENU_CLASSES.destructive}
          onClick={() => handleAction("delete")}
        >
          <Trash2 size={16} className="text-red-400" />
          Move to trash
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
