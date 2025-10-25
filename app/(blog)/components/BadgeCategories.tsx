import Link from "next/link";

export default function BadgeCategories({ categories }: { categories: { name: string | null; slug: string | null }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="text-lg hover:underline"
        >
        #{category.name}
        </Link>
      ))}
    </div>
  );
}