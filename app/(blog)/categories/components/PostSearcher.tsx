"use client";

import { createContext, useContext, useEffect, useMemo, useCallback, useRef, useState, ReactNode, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Avatar from "../../shared/ui/avatar";
import CoverImage from "../../shared/ui/cover-image";
import DateComponent from "../../shared/ui/date";
import BadgeCategories from "./BadgeCategories";

export interface Category {
  name: string | null;
  slug: string | null;
  description?: string | null;
  postCount: number;
}

export interface Post {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  coverImage: any;
  date: string;
  authors: Array<{ name: string; picture: any; slug: string | null }> | null;
  categories: Array<{ name: string | null; slug: string | null }> | null;
}

interface PostSearcherState {
  searchTerm: string;
  localSearchTerm: string;
  selectedCategory: string;
  filteredPosts: Post[];
  validCategories: Category[];
  isTyping: boolean;
}

interface PostSearcherActions {
  handleSearchChange: (value: string) => void;
  handleCategoryChange: (category: string) => void;
  clearFilters: () => void;
}

interface PostSearcherContextValue {
  state: PostSearcherState;
  actions: PostSearcherActions;
}

const PostSearcherContext = createContext<PostSearcherContextValue | null>(null);

function usePostSearcher() {
  const context = useContext(PostSearcherContext);
  if (!context) {
    throw new Error("usePostSearcher must be used within a PostSearcher.Provider");
  }
  return context;
}

function PostSearcherProviderContent({
  categories,
  posts,
  children
}: {
  categories: Category[];
  posts: Post[];
  children: ReactNode
}) {
  /* eslint-disable-next-line */
  const searchParams = useSearchParams();
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const urlSearchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";

  const updateURL = useCallback((newSearch: string, newCategory: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newCategory) params.set("category", newCategory);

    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : window.location.pathname;
    router.push(newURL, { scroll: false });
  }, [router]);

  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const displaySearchTerm = isTyping ? localSearchTerm : urlSearchTerm;

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchTerm(value);
    setIsTyping(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateURL(value, selectedCategory);
      setIsTyping(false);
    }, 300);
  }, [updateURL, selectedCategory]);

  const handleCategoryChange = useCallback((category: string) => {
    updateURL(displaySearchTerm, category);
  }, [updateURL, displaySearchTerm]);

  const clearFilters = useCallback(() => {
    updateURL("", "");
  }, [updateURL]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post: Post) => {
      const matchesSearch = !urlSearchTerm ||
        post.title?.toLowerCase().includes(urlSearchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(urlSearchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || selectedCategory === "all" ||
        post.categories?.some(cat => cat.slug && cat.slug === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [posts, urlSearchTerm, selectedCategory]);

  const validCategories = categories.filter(category => category.name && category.slug);

  const value: PostSearcherContextValue = {
    state: {
      searchTerm: urlSearchTerm,
      localSearchTerm: displaySearchTerm,
      selectedCategory,
      filteredPosts,
      validCategories,
      isTyping
    },
    actions: {
      handleSearchChange,
      handleCategoryChange,
      clearFilters,
    }
  };

  return (
    <PostSearcherContext.Provider value={value}>
      <div className="container mx-auto px-5">{children}</div>
    </PostSearcherContext.Provider>
  );
}

export function PostSearcherProvider(props: {
  categories: Category[];
  posts: Post[];
  children: ReactNode
}) {
  return (
    <Suspense fallback={<div className="container mx-auto px-5 py-12 text-center text-gray-500">Cargando buscador...</div>}>
      <PostSearcherProviderContent {...props} />
    </Suspense>
  );
}

export function PostSearcherHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-12">
      <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="text-lg text-neutral-600 mb-8">
        {description}
      </p>
    </div>
  );
}

export function PostSearcherInput() {
  const { state: { localSearchTerm }, actions: { handleSearchChange } } = usePostSearcher();

  return (
    <div className="relative max-w-xl group">
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
  );
}

export function PostSearcherCategoryFilter() {
  const { state: { validCategories, selectedCategory }, actions: { handleCategoryChange } } = usePostSearcher();

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => handleCategoryChange("")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === ""
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
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.slug
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

export function PostSearcherSummary() {
  const { state: { filteredPosts, searchTerm, selectedCategory, validCategories } } = usePostSearcher();

  if (filteredPosts.length === 0) return null;

  return (
    <div className="mb-8">
      <p className="text-gray-600">
        {filteredPosts.length === 1 ? '1 publicación encontrada' : `${filteredPosts.length} publicaciones encontradas`}
        {searchTerm && ` para "${searchTerm}"`}
        {selectedCategory && validCategories.find(cat => cat.slug === selectedCategory) &&
          ` en la categoría "${validCategories.find(cat => cat.slug === selectedCategory)?.name}"`
        }
      </p>
    </div>
  );
}

export function PostSearcherResults() {
  const { state: { filteredPosts, searchTerm, selectedCategory }, actions: { clearFilters } } = usePostSearcher();

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          No se encontraron publicaciones
        </h3>
        <p className="text-gray-500 mb-6">
          Intenta ajustar tu búsqueda o seleccionar una categoría diferente
        </p>
        {(searchTerm || selectedCategory) && (
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    );
  }

  return (
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
  );
}



export const PostSearcher = {
  Provider: PostSearcherProvider,
  Header: PostSearcherHeader,
  Input: PostSearcherInput,
  CategoryFilter: PostSearcherCategoryFilter,
  Summary: PostSearcherSummary,
  Results: PostSearcherResults
};