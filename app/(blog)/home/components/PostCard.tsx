import Link from "next/link";

import Avatar from "../../shared/ui/avatar";
import CoverImage from "../../shared/ui/cover-image";
import DateComponent from "../../shared/ui/date";
import BadgeCategories from "../../categories/components/BadgeCategories";
import type { SanityImage } from "@/sanity/lib/queries";

interface PostCardProps {
    title: string | null;
    slug: string | null;
    excerpt: string | null;
    coverImage: SanityImage | null;
    date: string;
    authors: Array<{ name: string; picture: SanityImage | null; slug: string | null }> | null;
    categories: Array<{ name: string; slug: string }> | null;
    priority?: boolean;
}

export default function PostCard({
    title,
    slug,
    excerpt,
    coverImage,
    date,
    authors,
    categories,
    priority = false,
}: PostCardProps) {
    return (
        <article className="group flex flex-col rounded-2xl bg-neutral-100 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
            {/* Text content area */}
            <div className="flex flex-1 flex-col p-6">
                {/* Meta — φ² level: ~text-xs */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
                    <DateComponent dateString={date} />
                    {categories?.length ? (
                        <BadgeCategories categories={categories} />
                    ) : null}
                </div>

                {/* Title — base level: text-2xl (24px) */}
                <h3 className="text-balance mb-3 text-2xl font-sans font-semibold leading-snug">
                    <Link href={`/posts/${slug}`} className="hover:underline">
                        {title}
                    </Link>
                </h3>

                {/* Excerpt — φ¹ level: 24/1.618 ≈ 14.8px */}
                {excerpt && (
                    <p className="text-pretty mb-4 text-[0.925rem] leading-relaxed text-neutral-600 font-sans">
                        {excerpt}
                    </p>
                )}

                {/* Authors */}
                {authors?.length ? (
                    <div className="mt-auto flex flex-wrap gap-3 pt-3">
                        {authors.map((a) => (
                            <Avatar
                                key={(a.slug || a.name) + "-card"}
                                name={a.name}
                                picture={a.picture}
                                slug={a.slug}
                            />
                        ))}
                    </div>
                ) : null}
            </div>

            {/* Cover image at bottom */}
            <Link href={`/posts/${slug}`} className="block">
                <CoverImage
                    image={coverImage}
                    priority={priority}
                    className="overflow-hidden"
                />
            </Link>
        </article>
    );
}
