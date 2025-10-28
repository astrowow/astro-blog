"use client";

import Link from "next/link";
import { useState } from "react";

interface Category {
  name: string | null;
  slug: string | null;
  description?: string | null;
  postCount: number;
}

interface CategoryFilterProps {
  categories: Category[];
  currentCategory?: string;
}

export default function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter out categories with null names or slugs, and apply search filter
  const filteredCategories = categories
    .filter(category => category.name && category.slug) // Remove categories with null name or slug
    .filter(category =>
      category.name!.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="mb-12">
      <div className="mb-8">
        <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
          Explorar Categorías
        </h2>
        <p className="text-lg text-neutral-600 mb-6">
          Descubre todos los temas que cubrimos en nuestro blog
        </p>
        
        {/* Search input */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Link
            key={category.slug!}
            href={`/categories/${category.slug!}`}
            className={`group block p-6 rounded-lg border transition-all duration-200 ${
              currentCategory === category.slug
                ? 'border-gray-400'
                : 'hover:border-gray-950'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold transition-colors">
                {category.name!}
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
              </span>
            </div>
            
            {category.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {category.description}
              </p>
            )}
            
            <div className="mt-4 flex items-center font-medium">
              Ver posts
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {filteredCategories.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron categorías que coincidan con &quot;{searchTerm}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
