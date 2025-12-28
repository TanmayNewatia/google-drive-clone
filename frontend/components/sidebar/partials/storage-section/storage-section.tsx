export const StorageSection = () => {
  return (
    <div className="border-t border-[#3c4043] pt-4">
      <div className="mb-3">
        <div className="w-full bg-[#3c4043] rounded-full h-2 overflow-hidden mb-2">
          <div className="bg-[#4a90e2] h-full" style={{ width: "94%" }}></div>
        </div>
        <p className="text-xs text-[#9aa0a6]">14.12GB of 15GB used</p>
      </div>
      <button className="w-full px-4 py-2 rounded-lg border border-[#3c4043] text-[#9aa0a6] hover:bg-[#303134] transition-colors text-sm">
        Get more storage
      </button>
    </div>
  );
};
