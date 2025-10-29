import { Suspense } from "react";
import SearchContainer from "./components/SearchContainer";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCategoriesQuery, allPostsQuery } from "@/sanity/lib/queries";

interface SearchParams {
  search?: string;
  category?: string;
}

export default async function CategoriesPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams> 
}) {
  const resolvedSearchParams = await searchParams;
  
  const [categories, posts] = await Promise.all([
    sanityFetch({ query: allCategoriesQuery }),
    sanityFetch({ 
      query: allPostsQuery, 
      params: { limit: 100 } // Obtener hasta 100 posts para el buscador
    })
  ]);

  return (
    <Suspense fallback={<div className="container mx-auto px-5 py-12">Cargando buscador...</div>}>
      <SearchContainer 
        categories={categories || []} 
        posts={posts || []}
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  );
}
