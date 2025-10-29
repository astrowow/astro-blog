"use client";

import { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Avatar from "../../shared/ui/avatar";
import CoverImage from "../../shared/ui/cover-image";
import DateComponent from "../../shared/ui/date";
import BadgeCategories from "./BadgeCategories";

interface Category {
  name: string | null;
  slug: string | null;
  description?: string | null;
  postCount: number;
}

interface Post {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  coverImage: any;
  date: string;
  authors: Array<{ name: string; picture: any; slug: string | null }> | null;
  categories: Array<{ name: string | null; slug: string | null }> | null;
}

interface PostSearcherProps {
  categories: Category[];
  posts: Post[];
}

export default function PostSearcher({ categories, posts }: PostSearcherProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get current values from URL
  const urlSearchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";
  
  // Local state for immediate UI updates - only initialize once
  const [localSearchTerm, setLocalSearchTerm] = useState(urlSearchTerm);
  const [isTyping, setIsTyping] = useState(false);

  // Only sync from URL when not actively typing
  useEffect(() => {
    if (!isTyping) {
      setLocalSearchTerm(urlSearchTerm);
    }
  }, [urlSearchTerm, isTyping]);

  // Function to update URL params
  const updateURL = useCallback((newSearch: string, newCategory: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newCategory) params.set("category", newCategory);
    
    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : window.location.pathname;
    router.push(newURL, { scroll: false });
  }, [router]);

  // Debounced search function
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchTerm(value);
    setIsTyping(true);
    
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout
    debounceRef.current = setTimeout(() => {
      updateURL(value, selectedCategory);
      setIsTyping(false);
    }, 300);
  }, [updateURL, selectedCategory]);

  const handleCategoryChange = useCallback((category: string) => {
    updateURL(localSearchTerm, category);
  }, [updateURL, localSearchTerm]);

  // Filter posts based on search term and selected category
  const filteredPosts = useMemo(() => {
    return posts.filter((post: Post) => {
      const matchesSearch = !urlSearchTerm || 
        post.title?.toLowerCase().includes(urlSearchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(urlSearchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
        post.categories?.some(cat => cat.slug && cat.slug === selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, urlSearchTerm, selectedCategory]);

  // Filter categories to only show those with valid names and slugs
  const validCategories = categories.filter(category => category.name && category.slug);

  return (
    <div className="container mx-auto px-5">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
          Buscar Publicaciones
        </h1>
        <p className="text-lg text-neutral-600 mb-8">
          Encuentra los artículos que más te interesen usando nuestro buscador y filtros por categoría
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-12 space-y-6">
        {/* Search Input */}
        <div className="relative max-w-xl group">
          {/* Gradient Shadow */}
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#FFCD00] via-[#003087] to-[#C8102E] opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-75"></div>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por título o contenido..."
              value={localSearchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 shadow-sm bg-white relative z-10 transition-all duration-300"
            />
          </div>
        </div>

        {/* Category Filter */}
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
          {validCategories.map((category) => (
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
      </div>

      {/* Results Summary */}
      <div className="mb-8">
        <p className="text-gray-600">
          {filteredPosts.length === 0 
            ? "No se encontraron publicaciones"
            : `${filteredPosts.length} ${filteredPosts.length === 1 ? 'publicación encontrada' : 'publicaciones encontradas'}`
          }
          {urlSearchTerm && ` para "${urlSearchTerm}"`}
          {selectedCategory && validCategories.find(cat => cat.slug === selectedCategory) && 
            ` en la categoría "${validCategories.find(cat => cat.slug === selectedCategory)?.name}"`
          }
        </p>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
          {filteredPosts.map((post) => (
            <article
              key={post._id}
              className="overflow-hidden bg-white shadow-lg md:bg-transparent md:shadow-none"
            >
              <Link href={`/posts/${post.slug}`} className="group block">
                <CoverImage image={post.coverImage} priority={false} />
              </Link>
              <div className="p-5 md:p-0 md:pt-6">
                <h3 className="text-balance mb-3 text-3xl leading-snug">
                  <Link href={`/posts/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <div className="mb-4 flex flex-wrap items-center justify-between text-lg italic text-neutral-500">
                  <DateComponent dateString={post.date} />
                  {post.categories?.length ? (
                    <BadgeCategories categories={post.categories} />
                  ) : null}
                </div>
                {post.excerpt && (
                  <p className="text-pretty mb-4 text-lg leading-relaxed text-neutral-500 font-sans">
                    {post.excerpt}
                  </p>
                )}
                {post.authors?.length ? (
                  <div className="flex flex-wrap gap-3">
                    {post.authors.map((author) => (
                      <Avatar
                        key={(author.slug || author.name) + "-search"}
                        name={author.name}
                        picture={author.picture}
                        slug={author.slug}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No se encontraron publicaciones
          </h3>
          <p className="text-gray-500 mb-6">
            Intenta ajustar tu búsqueda o seleccionar una categoría diferente
          </p>
          {(urlSearchTerm || selectedCategory) && (
            <button
              onClick={() => updateURL("", "")}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}