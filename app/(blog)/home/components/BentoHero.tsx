import Link from "next/link";
import CoverImage from "../../shared/ui/cover-image";
import PortableText from "../../shared/ui/portable-text";
import * as demo from "@/sanity/lib/demo";

interface BentoHeroProps {
    title: string | null | undefined;
    description: any;
    heroPost: {
        title: string | null;
        slug: string | null;
        coverImage: any;
    } | null;
}

export default function BentoHero({ title, description, heroPost }: BentoHeroProps) {
    const displayTitle = title || demo.title;
    const displayDescription = description?.length ? description : demo.description;

    return (
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
                        aria-label={displayTitle}
                    >
                        {displayTitle.split("").map((ch: string, i: number) => (
                            <span
                                key={`title-${ch}-${i}`}
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
                        <PortableText className="prose-sm" value={displayDescription as any} />
                    </div>
                    <Link
                        href="#articulos"
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
    );
}
