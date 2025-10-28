import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import MoreStories from "../../home/components/more-stories";
import BadgeCategories from "../components/BadgeCategories";
import CategoryFilter from "../components/CategoryFilter";

import { sanityFetch } from "@/sanity/lib/fetch";
import { postsByCategoryQuery, allCategoriesQuery, categoryBySlugQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

const categorySlugs = defineQuery(
  `*[_type == "category" && defined(slug.current)]{"slug": slug.current}`,
);

export async function generateStaticParams() {
  const data = await client.fetch(categorySlugs);
  return (data ?? [])
    .map(({ slug }: { slug: string | null }) => (slug ? { slug } : null))
    .filter(Boolean) as { slug: string }[];
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const [posts, categories, currentCategory] = await Promise.all([
    sanityFetch({ query: postsByCategoryQuery, params: resolvedParams }),
    sanityFetch({ query: allCategoriesQuery }),
    sanityFetch({ query: categoryBySlugQuery, params: resolvedParams })
  ]);

  if (!posts || posts.length === 0 || !currentCategory) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-5">
      {/* Current category header */}
      <div className="mb-12">
        <h1 className="mb-4 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
          {currentCategory.name}
        </h1>
        {currentCategory.description && (
          <p className="text-lg text-neutral-600 mb-6 max-w-3xl">
            {currentCategory.description}
          </p>
        )}
        <div className="flex items-center text-sm text-gray-500">
          <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'} en esta categoría</span>
        </div>
      </div>

      {/* Posts in current category */}
      <div className="mb-16">
        <h2 className="mb-8 text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
          Publicaciones
        </h2>
        <Suspense fallback={<div>Cargando posts...</div>}>
          <MoreStories skip="" limit={100} posts={posts} />
        </Suspense>
      </div>

      {/* Category filter */}
      <div className="border-t pt-12">
        <h2 className="mb-8 text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
          Otras Categorías
        </h2>
        <Suspense fallback={<div>Cargando categorías...</div>}>
          <CategoryFilter 
            categories={(categories || []).filter(cat => cat.name && cat.slug)} 
            currentCategory={resolvedParams.slug} 
          />
        </Suspense>
      </div>
    </div>
  );
}