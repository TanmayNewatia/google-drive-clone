import { ChevronDown } from "lucide-react";

export const FilterBar = () => {
  return (
    <div className="flex items-start gap-3 flex-col justify-center">
      <div className="flex items-center gap-2">
        <p className="text-gray-300 font-medium flex items-center gap-2 text-xl">
          My Drive
        </p>
        <ChevronDown size={16} />
      </div>

      <div className="flex gap-2">
        {["Type", "People", "Modified"].map((filter) => (
          <button
            key={filter}
            className="px-3 py-1 rounded border border-[#3c4043] text-[#9aa0a6] hover:bg-[#303134] text-sm transition-colors flex items-center gap-2"
          >
            {filter}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="opacity-60"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};
