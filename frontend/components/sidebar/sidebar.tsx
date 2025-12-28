"use client";
import { LogoWrapper } from "./partials/logo-wrapper";
import { useSidebar } from "./hooks";
import { SidebarNavButton } from "./partials/sidebar-nav-button/sidebar-nav-button";
import { StorageSection } from "./partials/storage-section/storage-section";

export default function Sidebar() {
  const { activeItem, setActiveItem, items } = useSidebar();

  return (
    <div className="w-64 bg-[#1f1f1f] border-r border-[#3c4043] p-4 flex flex-col gap-8">
      <LogoWrapper />
      {/* New Button */}
      <button className="w-full px-4 py-3 rounded-full bg-[#303134] hover:bg-[#3c4043] text-white font-medium flex items-center gap-3 transition-colors">
        <span className="text-xl">+</span>
        New
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {items.map((item) => (
          <SidebarNavButton
            key={item.id}
            item={item}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
        ))}
      </nav>

      <StorageSection />
    </div>
  );
}
