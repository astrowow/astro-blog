"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface Category {
  name: string | null;
  slug: string | null;
  postCount: number;
}

interface CategoryButtonsProps {
  categories: Category[];
  selectedCategory: string;
  searchTerm: string;
}

export default function CategoryButtons({ categories, selectedCategory, searchTerm }: CategoryButtonsProps) {
  const router = useRouter();

  // Function to update URL params
  const updateURL = useCallback((newCategory: string) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (newCategory) params.set("category", newCategory);
    
    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : window.location.pathname;
    router.push(newURL, { scroll: false });
  }, [router, searchTerm]);

  const handleCategoryChange = useCallback((category: string) => {
    updateURL(category);
  }, [updateURL]);

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => handleCategoryChange("")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          selectedCategory === ""
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Todas las categorías
      </button>
      {categories.map((category) => (
        <button
          key={category.slug!}
          onClick={() => handleCategoryChange(category.slug!)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === category.slug
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.name} ({category.postCount})
        </button>
      ))}
    </div>
  );
}