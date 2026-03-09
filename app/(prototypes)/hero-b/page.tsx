import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery, heroQuery, moreStoriesQuery, allCategoriesQuery } from "@/sanity/lib/queries";
import * as demo from "@/sanity/lib/demo";
import PortableText from "../../(blog)/shared/ui/portable-text";
import CoverImage from "../../(blog)/shared/ui/cover-image";
import Link from "next/link";

export const metadata = {
    title: "Hero B — Bento Grid",
};

export default async function HeroBPage() {
    const [settings, heroPost, categories] = await Promise.all([
        sanityFetch({ query: settingsQuery }),
        sanityFetch({ query: heroQuery }),
        sanityFetch({ query: allCategoriesQuery }),
    ]);

    // Fetch recent articles for the slider
    const recentPosts = heroPost?._id
        ? await sanityFetch({
            query: moreStoriesQuery,
            params: { skip: heroPost._id, limit: 6 },
        })
        : [];

    const sliderPosts = [
        ...(heroPost ? [heroPost] : []),
        ...(recentPosts || []),
    ].slice(0, 6);

    const title = settings?.title || demo.title;
    const description = settings?.description?.length
        ? settings.description
        : demo.description;

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* ═══════ VIEWPORT SECTION — fits in h-screen ═══════ */}
            <section className="flex h-screen flex-col pt-6 pb-4 md:pt-10 md:pb-6">
                {/* Navigation */}

                {/* Bento Grid — takes up most of the space */}
                <div className="flex-1 min-h-0 px-6 md:px-10">
                    <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 md:grid-rows-[1fr_1fr_auto] gap-4 h-full">
                        {/* Main video cell — left 2 cols, all rows */}
                        <div className="relative md:col-span-2 md:row-span-3 rounded-3xl overflow-hidden bg-slate-900 min-h-[200px]">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 h-full w-full object-cover"
                            >
                                <source src="/header2.webm" type="video/webm" />
                                <source src="/header.webm" type="video/webm" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-5 left-5">
                                <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs text-white tracking-wider uppercase">
                                    En vivo desde el universo
                                </span>
                            </div>
                        </div>

                        {/* Title + description cell — right 2 cols, top 2 rows */}
                        <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-white p-6 md:p-8 flex flex-col justify-center">
                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold leading-none tracking-tighter mb-4"
                                aria-label={title}
                            >
                                {(title).split("").map((ch: string, i: number) => (
                                    <span
                                        key={`title-b-${ch}-${i}`}
                                        aria-hidden="true"
                                        className={[
                                            "text-[#F1C21E]",
                                            "text-[#045396]",
                                            "text-[#E83B13]",
                                            "text-[#09935F]",
                                        ][i % 4]}
                                    >
                                        {ch}
                                    </span>
                                ))}
                            </h1>
                            <div className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-md">
                                <PortableText className="prose-sm" value={description as any} />
                            </div>
                            <Link
                                href="/"
                                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm text-white transition-all duration-300 hover:bg-neutral-800 hover:scale-105"
                            >
                                Explorar artículos
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>

                        {/* Latest article cell — right 2 cols, bottom row, image background */}
                        {heroPost && (
                            <Link
                                href={`/posts/${heroPost.slug}`}
                                className="group relative md:col-span-2 rounded-3xl overflow-hidden min-h-[140px]"
                            >
                                {heroPost.coverImage && (
                                    <div className="absolute inset-0">
                                        <CoverImage
                                            image={heroPost.coverImage}
                                            priority
                                            className="h-full w-full [&_img]:h-full [&_img]:object-cover"
                                        />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/55 transition-colors duration-300 group-hover:bg-black/45" />
                                <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white">
                                    <span className="text-[10px] uppercase tracking-widest text-white/60 font-sans">Último artículo</span>
                                    <h3 className="mt-1.5 text-base font-semibold leading-snug line-clamp-2 group-hover:underline">
                                        {heroPost.title}
                                    </h3>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Category scroller — horizontal scrollable chips */}
                {categories && categories.length > 0 && (
                    <div className="flex-shrink-0 px-6 md:px-10 py-4">
                        <div className="mx-auto max-w-7xl">
                            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-neutral-400">
                                Categorías
                            </h2>
                            <div
                                className="flex gap-3 overflow-x-auto pb-1 snap-x"
                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            >
                                {categories.map((cat: any) => (
                                    <Link
                                        key={cat.slug}
                                        href={`/categories/${cat.slug}`}
                                        className="flex-shrink-0 snap-start rounded-full bg-neutral-200/70 px-5 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-900 hover:text-white"
                                    >
                                        {cat.name}
                                        {cat.postCount > 0 && (
                                            <span className="ml-1.5 text-xs text-neutral-400">
                                                {cat.postCount}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* ═══════ BELOW THE FOLD — scroll to see ═══════ */}
            {sliderPosts.length > 0 && (
                <div className="px-6 md:px-10 py-10">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
                                Artículos recientes
                            </h2>
                            <span className="text-xs text-neutral-400">Desliza →</span>
                        </div>
                        <div
                            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {sliderPosts.map((post: any, index: number) => (
                                <Link
                                    key={post._id}
                                    href={`/posts/${post.slug}`}
                                    className="group relative flex-shrink-0 w-[300px] md:w-[350px] h-[200px] md:h-[240px] rounded-2xl overflow-hidden snap-start"
                                >
                                    {post.coverImage && (
                                        <div className="absolute inset-0">
                                            <CoverImage
                                                image={post.coverImage}
                                                priority={index < 3}
                                                className="h-full w-full [&_img]:h-full [&_img]:object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 transition-colors duration-300 group-hover:from-black/60" />
                                    <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white">
                                        <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:underline">
                                            {post.title}
                                        </h3>
                                        <span className="mt-2 text-[10px] text-white/50 uppercase tracking-wider">
                                            Leer más →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
