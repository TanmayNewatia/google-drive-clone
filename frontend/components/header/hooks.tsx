import {
  Settings,
  Grid3X3,
  Shell as Help,
  CircleDot as CircleFold,
} from "lucide-react";

export const useHeader = () => {
  const headerIcons = [
    { icon: CircleFold, size: 20 },
    { icon: Settings, size: 20 },
    { icon: Grid3X3, size: 20 },
    { icon: Help, size: 20 },
  ];

  return { headerIcons };
};
