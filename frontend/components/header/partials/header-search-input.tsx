import { Search } from "lucide-react";

export const HeaderSearchInput = () => {
  return (
    <div className="flex-1 max-w-2xl">
      <div className="flex items-center gap-3 bg-[#303134] rounded-full px-4 py-2">
        <Search size={20} className="text-[#9aa0a6]" />
        <input
          type="text"
          placeholder="Search in Drive"
          className="flex-1 bg-transparent text-white placeholder-[#9aa0a6] outline-none text-sm"
        />
      </div>
    </div>
  );
};
