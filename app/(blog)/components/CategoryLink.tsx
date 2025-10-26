import Link from "next/link";

export default function CategoryLink() {
  return (
    <div className="mt-8 text-center">
      <Link
        href="/categories"
        className="mx-3 mb-6 mt-6 border border-black bg-black py-3 px-16 font-bold text-white transition-colors duration-200 hover:bg-white hover:text-black lg:mb-0 lg:px-12"
      >
        Ver todas las categorías
      </Link>
    </div>
  );
}
