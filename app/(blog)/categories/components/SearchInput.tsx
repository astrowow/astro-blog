"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

interface SearchInputProps {
  initialValue: string;
  selectedCategory: string;
}

export default function SearchInput({ initialValue, selectedCategory }: SearchInputProps) {
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Function to update URL params
  const updateURL = useCallback((newSearch: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (selectedCategory) params.set("category", selectedCategory);
    
    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : window.location.pathname;
    router.push(newURL, { scroll: false });
  }, [router, selectedCategory]);

  // Debounced search function - directly updates URL without local state
  const handleSearchChange = useCallback((value: string) => {
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout
    debounceRef.current = setTimeout(() => {
      updateURL(value);
    }, 300);
  }, [updateURL]);

  return (
    <div className="relative max-w-xl group">
      {/* Gradient Shadow */}
      <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#FFCD00] via-[#003087] to-[#C8102E] opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-75"></div>
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por título o contenido..."
          defaultValue={initialValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 shadow-sm bg-white relative z-10 transition-all duration-300"
        />
      </div>
    </div>
  );
}