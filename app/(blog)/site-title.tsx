import Link from "next/link";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

export default async function SiteTitle({ className }: { className?: string }) {
  const settings = await sanityFetch({ query: settingsQuery, stega: false });
  return (
    <h2
      className={[
        "mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link href="/" className="hover:underline">
        {settings?.title || demo.title}
      </Link>
    </h2>
  );
}