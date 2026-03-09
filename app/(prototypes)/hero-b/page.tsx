import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery, heroQuery } from "@/sanity/lib/queries";
import * as demo from "@/sanity/lib/demo";
import PortableText from "../../(blog)/shared/ui/portable-text";
import CoverImage from "../../(blog)/shared/ui/cover-image";
import Link from "next/link";

export const metadata = {
    title: "Hero B — Bento Grid",
};

export default async function HeroBPage() {
    const [settings, heroPost] = await Promise.all([
        sanityFetch({ query: settingsQuery }),
        sanityFetch({ query: heroQuery }),
    ]);
    const title = settings?.title || demo.title;
    const description = settings?.description?.length
        ? settings.description
        : demo.description;

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Navigation */}
            <nav className="flex items-center justify-between p-6 md:p-10">
                <Link href="/" className="text-neutral-500 text-sm hover:text-black transition-colors">
                    ← Volver al inicio
                </Link>
                <span className="text-neutral-400 text-xs tracking-widest uppercase">Prototipo B</span>
            </nav>

            {/* Bento Grid */}
            <div className="px-6 md:px-10 pb-10">
                <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 md:grid-rows-[1fr_1fr_auto] gap-4 md:min-h-[calc(100vh-10rem)]">

                    {/* Main video cell — spans 2 cols, 3 rows */}
                    <div className="relative md:col-span-2 md:row-span-3 rounded-3xl overflow-hidden bg-slate-900 min-h-[300px]">
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
                        {/* Floating badge */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs text-white tracking-wider uppercase">
                                En vivo desde el universo
                            </span>
                        </div>
                    </div>

                    {/* Title + description cell — spans 2 cols, 2 rows */}
                    <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-white p-8 md:p-10 flex flex-col justify-center">
                        <h1
                            className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold leading-none tracking-tighter mb-6"
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
                        <div className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-lg">
                            <PortableText
                                className="prose-base"
                                value={description}
                            />
                        </div>
                        <Link
                            href="/"
                            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3 text-sm text-white transition-all duration-300 hover:bg-neutral-800 hover:scale-105"
                        >
                            Explorar artículos
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Latest post cell — image as background */}
                    {heroPost && (
                        <div className="relative rounded-3xl overflow-hidden group transition-shadow duration-300 hover:shadow-lg min-h-[160px]">
                            {/* Background image */}
                            {heroPost.coverImage && (
                                <div className="absolute inset-0">
                                    <CoverImage image={heroPost.coverImage} priority={false} className="h-full w-full [&_img]:h-full [&_img]:object-cover" />
                                </div>
                            )}
                            {/* Dark translucent overlay */}
                            <div className="absolute inset-0 bg-black/55 transition-colors duration-300 group-hover:bg-black/45" />
                            {/* Text content */}
                            <Link href={`/posts/${heroPost.slug}`} className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
                                <span className="text-[10px] uppercase tracking-widest text-white/60 font-sans">Último artículo</span>
                                <h3 className="mt-2 text-base font-semibold leading-snug line-clamp-3 group-hover:underline">
                                    {heroPost.title}
                                </h3>
                                <span className="mt-3 text-xs text-white/50 flex items-center gap-1">
                                    Leer más
                                    <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </span>
                            </Link>
                        </div>
                    )}

                    {/* Quick links cell */}
                    <div className="h-full rounded-3xl bg-neutral-100 p-6 flex flex-col justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-sans">Categorías</span>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {["Astrofotografía", "Investigaciones", "Cápsulas"].map((cat) => (
                                <span
                                    key={cat}
                                    className="rounded-full bg-white px-3 py-1.5 text-xs text-neutral-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                        <Link href="/categories" className="mt-4 text-xs text-neutral-400 hover:text-black transition-colors flex items-center gap-1">
                            Ver todas
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
