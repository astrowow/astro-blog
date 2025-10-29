import { Suspense } from "react";
import PostSearcher from "./components/PostSearcher";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCategoriesQuery, allPostsQuery } from "@/sanity/lib/queries";

export default async function CategoriesPage() {
  const [categories, posts] = await Promise.all([
    sanityFetch({ query: allCategoriesQuery }),
    sanityFetch({ 
      query: allPostsQuery, 
      params: { limit: 100 } // Obtener hasta 100 posts para el buscador
    })
  ]);

  return (
    <Suspense fallback={<div className="container mx-auto px-5 py-12">Cargando buscador...</div>}>
      <PostSearcher 
        categories={categories || []} 
        posts={posts || []}
      />
    </Suspense>
  );
}
