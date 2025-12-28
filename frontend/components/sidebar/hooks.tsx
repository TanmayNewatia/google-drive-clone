import { useState } from "react";
import {
  Home,
  FileText,
  Users,
  Clock,
  Star,
  AlertCircle,
  Trash2,
  HardDrive,
} from "lucide-react";

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

export const useSidebar = () => {
  const items: SidebarItem[] = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    {
      id: "mydrive",
      label: "MyDrive",
      icon: <FileText size={20} />,
      active: true,
    },
    { id: "computers", label: "Computers", icon: <HardDrive size={20} /> },
    { id: "shared", label: "Shared with me", icon: <Users size={20} /> },
    { id: "recent", label: "Recent", icon: <Clock size={20} /> },
    { id: "starred", label: "Starred", icon: <Star size={20} /> },
    { id: "spam", label: "Spam", icon: <AlertCircle size={20} /> },
    { id: "trash", label: "Trash", icon: <Trash2 size={20} /> },
  ];
  const [activeItem, setActiveItem] = useState("mydrive");

  return {
    activeItem,
    setActiveItem,
    items,
  };
};
