import { SidebarItem } from "../../hooks";

export const SidebarNavButton = ({
  item,
  activeItem,
  setActiveItem,
}: {
  item: SidebarItem;
  activeItem: string;
  setActiveItem: (id: string) => void;
}) => {
  return (
    <button
      key={item.id}
      onClick={() => setActiveItem(item.id)}
      className={`w-full px-4 py-3 rounded-full text-left flex items-center gap-4 transition-colors ${
        activeItem === item.id
          ? "bg-[#4a90e2] text-white"
          : "text-[#9aa0a6] hover:bg-[#303134] hover:text-white"
      }`}
    >
      {item.icon}
      <span className="text-sm font-medium">{item.label}</span>
    </button>
  );
};
