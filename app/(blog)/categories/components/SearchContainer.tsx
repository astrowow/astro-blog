import { Suspense } from "react";
import SearchInput from "@/app/(blog)/categories/components/SearchInput";
import CategoryButtons from "@/app/(blog)/categories/components/CategoryButtons";
import PostsGrid from "@/app/(blog)/categories/components/PostsGrid";

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

interface SearchContainerProps {
  categories: Category[];
  posts: Post[];
  searchParams: { search?: string; category?: string };
}

export default function SearchContainer({ categories, posts, searchParams }: SearchContainerProps) {
  const searchTerm = searchParams.search || "";
  const selectedCategory = searchParams.category || "";

  // Filter posts based on search term and selected category
  const filteredPosts = posts.filter((post: Post) => {
    const matchesSearch = !searchTerm || 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || selectedCategory === 'all' ||
      post.categories?.some(cat => cat.slug && cat.slug === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

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
        {/* Search Input - Client Component */}
        <Suspense fallback={<div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>}>
          <SearchInput 
            initialValue={searchTerm} 
            selectedCategory={selectedCategory}
          />
        </Suspense>

        {/* Category Filter - Client Component */}
        <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>}>
          <CategoryButtons 
            categories={validCategories}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
          />
        </Suspense>
      </div>

      {/* Results Summary */}
      <div className="mb-8">
        <p className="text-gray-600">
          {filteredPosts.length === 0 
            ? "No se encontraron publicaciones"
            : `${filteredPosts.length} ${filteredPosts.length === 1 ? 'publicación encontrada' : 'publicaciones encontradas'}`
          }
          {searchTerm && ` para "${searchTerm}"`}
          {selectedCategory && validCategories.find(cat => cat.slug === selectedCategory) && 
            ` en la categoría "${validCategories.find(cat => cat.slug === selectedCategory)?.name}"`
          }
        </p>
      </div>

      {/* Posts Grid */}
      <PostsGrid 
        posts={filteredPosts}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        validCategories={validCategories}
      />
    </div>
  );
}