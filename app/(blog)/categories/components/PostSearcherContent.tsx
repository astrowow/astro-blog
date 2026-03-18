"use client";

import { useMemo, useCallback, useRef, useState, ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Category, Post } from "../../../../sanity/lib/queries";
import { PostSearcherContext, PostSearcherContextValue } from "./PostSearcher";

export function PostSearcherProviderContent({
  categories,
  posts,
  children,
  searchParams
}: {
  categories: Category[];
  posts: Post[];
  children: ReactNode;
  searchParams: any;
}) {
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

export function PostSearcherLoader(props: {
  categories: Category[];
  posts: Post[];
  children: ReactNode
}) {
  const searchParams = useSearchParams();
  return <PostSearcherProviderContent {...props} searchParams={searchParams} />;
}
