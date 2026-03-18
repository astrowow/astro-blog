import Link from "next/link";
import { Category } from "../../../../sanity/lib/queries";

interface CategoryChipsProps {
  categories: Category[];
}

export default function CategoryChips({ categories }: CategoryChipsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="shrink-0 px-6 md:px-10 py-4">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Categorías
        </h2>
        <div
          className="flex gap-3 overflow-x-auto pb-1 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="shrink-0 snap-start rounded-full bg-neutral-200/70 px-5 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-900 hover:text-white"
            >
              {cat.name}
              {cat.postCount && cat.postCount > 0 && (
                <span className="ml-1.5 text-xs text-neutral-400">
                  {cat.postCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
