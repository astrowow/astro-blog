import Link from "next/link";

export default function BadgeCategories({ categories }: { categories: { name: string | null; slug: string | null }[] }) {
  const maxCategories = 3;
  const displayedCategories = categories.slice(0, maxCategories);
  const remainingCategoriesCount = categories.length - maxCategories;

  return (
    <div className="flex flex-wrap gap-2">
      {displayedCategories.map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="text-lg hover:underline"
        >
          #{category.name}
        </Link>
      ))}
      {remainingCategoriesCount > 0 && (
        <span className="text-lg text-gray-500">
          +{remainingCategoriesCount} más
        </span>
      )}
    </div>
  );
}