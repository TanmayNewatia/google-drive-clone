"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useFiles } from "@/contexts/files-context";
import { FileData } from "@/lib/file-api";

export const HeaderSearchInput = () => {
  const { searchFiles } = useFiles();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FileData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchFiles(searchQuery.trim());
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="flex-1 max-w-2xl relative">
      <div className="flex items-center gap-3 bg-[#303134] rounded-full px-4 py-2">
        <Search size={20} className="text-[#9aa0a6]" />
        <input
          type="text"
          placeholder="Search in Drive"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-[#9aa0a6] outline-none text-sm"
          onFocus={() => query && setShowResults(true)}
          onBlur={() => {
            // Delay hiding to allow clicking on results
            setTimeout(() => setShowResults(false), 200);
          }}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="p-1 hover:bg-[#4a5051] rounded transition-colors"
          >
            <X size={16} className="text-[#9aa0a6]" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#2d2e30] border border-[#3c4043] rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
          {isSearching ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4a90e2]"></div>
              <span className="ml-2 text-[#9aa0a6] text-sm">Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-[#3c4043] cursor-pointer"
                  onClick={() => {
                    // You can add navigation to the file here
                    setShowResults(false);
                  }}
                >
                  <div className="text-lg">
                    {file.mime_type.startsWith("image/")
                      ? "🖼️"
                      : file.mime_type.includes("pdf")
                      ? "📄"
                      : file.mime_type.includes("document")
                      ? "📝"
                      : "📄"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#e8eaed] text-sm font-medium truncate">
                      {file.filename}
                    </p>
                    <p className="text-[#9aa0a6] text-xs">
                      Modified {new Date(file.modified_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : query && !isSearching ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-[#9aa0a6] text-sm">No files found</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
