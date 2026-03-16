import { Suspense } from "react";
import {
  PostSearcherProvider,
  PostSearcherHeader,
  PostSearcherInput,
  PostSearcherCategoryFilter,
  PostSearcherSummary,
  PostSearcherResults
} from "./components/PostSearcher";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCategoriesQuery, allPostsQuery } from "@/sanity/lib/queries";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorías — Buscar Publicaciones",
  description: "Encuentra los artículos que más te interesen usando nuestro buscador y filtros por categoría",
};

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
      <PostSearcherProvider categories={categories || []} posts={posts || []}>
        <PostSearcherHeader
          title="Buscar Publicaciones"
          description="Encuentra los artículos que más te interesen usando nuestro buscador y filtros por categoría"
        />
        <div className="mb-12 space-y-6">
          <PostSearcherInput />
          <PostSearcherCategoryFilter />
        </div>
        <PostSearcherSummary />
        <PostSearcherResults />
      </PostSearcherProvider>
    </Suspense>
  );
}
