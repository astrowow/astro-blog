import Link from "next/link";

export default function BadgeCategories({
  categories,
}: {
  categories: { name: string | null; slug: string | null }[];
}) {
  const maxCategories = 3;
  const displayedCategories = categories.slice(0, maxCategories);
  const remainingCategoriesCount = categories.length - maxCategories;

  return (
    <div className="flex flex-wrap gap-2">
      {displayedCategories.map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="rounded-full bg-neutral-200/70 px-3 py-1 text-xs font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-900 hover:text-white"
        >
          {category.name}
        </Link>
      ))}
      {remainingCategoriesCount > 0 && (
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
          +{remainingCategoriesCount} más
        </span>
      )}
    </div>
  );
}
