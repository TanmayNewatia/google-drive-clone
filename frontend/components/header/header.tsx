"use client";

import { useHeader } from "./hooks";
import { HeaderIconButton } from "./partials/header-icon-button";
import { HeaderSearchInput } from "./partials/header-search-input";

export default function Header() {
  const { headerIcons } = useHeader();
  return (
    <div className="border-b border-[#3c4043] bg-[#202124] py-4">
      <div className="flex items-center justify-between mx-2">
        <HeaderSearchInput />

        <div className="flex items-center gap-4 text-[#9aa0a6]">
          {headerIcons.map((item, index) => (
            <HeaderIconButton key={index} item={item} />
          ))}
          <div className="w-8 h-8 rounded-full bg-[#4a90e2] flex items-center justify-center text-sm font-bold">
            A
          </div>
        </div>
      </div>
    </div>
  );
}
