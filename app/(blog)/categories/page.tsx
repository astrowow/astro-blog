import { Suspense } from "react";
import CategoryFilter from "./components/CategoryFilter";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCategoriesQuery } from "@/sanity/lib/queries";

export default async function CategoriesPage() {
  const categories = await sanityFetch({ query: allCategoriesQuery });

  return (
    <div className="container mx-auto px-5">
      <Suspense fallback={<div>Cargando categorías...</div>}>
        <CategoryFilter categories={categories || []} />
      </Suspense>
    </div>
  );
}
