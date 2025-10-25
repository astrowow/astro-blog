import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import MoreStories from "../../more-stories";
import BadgeCategories from "../../components/BadgeCategories";

import { sanityFetch } from "@/sanity/lib/fetch";
import { postsByCategoryQuery } from "@/sanity/lib/queries";
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

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const posts = await sanityFetch({ query: postsByCategoryQuery, params });

  if (!posts || posts.length === 0) {
    return notFound();
  }

  const categoryName = posts[0].categories?.find((cat: any) => cat.slug === params.slug)?.name || "Categoría";

  return (
    <div className="container mx-auto px-5">
      <h1 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Posts en {categoryName}
      </h1>
      <Suspense>
        <MoreStories skip="" limit={100} posts={posts} />
      </Suspense>
    </div>
  );
}