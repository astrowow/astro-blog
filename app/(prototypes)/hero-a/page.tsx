import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import * as demo from "@/sanity/lib/demo";
import PortableText from "../../(blog)/shared/ui/portable-text";
import ColoredTitle from "../../(blog)/shared/ui/ColoredTitle";
import Link from "next/link";

export const metadata = {
    title: "Hero A — Full-Screen Inmersivo",
};

export default async function HeroAPage() {
    const settings = await sanityFetch({ query: settingsQuery });
    const title = settings?.title || demo.title;
    const description = settings?.description?.length
        ? settings.description
        : demo.description;

    return (
        <div className="relative min-h-screen bg-black">
            {/* Full-screen video background */}
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

            {/* Gradient overlay — dark from bottom for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            {/* Navigation hint */}
            <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 md:p-10">
                <Link href="/" className="text-white/70 text-sm hover:text-white transition-colors">
                    ← Volver al inicio
                </Link>
                <span className="text-white/40 text-xs tracking-widest uppercase">Prototipo A</span>
            </nav>

            {/* Centered content */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
                {/* Title with colorful letters */}
                <h1
                    className="text-6xl md:text-8xl lg:text-[10rem] font-sans font-bold leading-none tracking-tighter"
                    aria-label={title}
                >
                    <ColoredTitle
                        title={title}
                        style={{ textShadow: "0 2px 40px rgba(0,0,0,0.5)" }}
                    />
                </h1>

                {/* Subtitle */}
                <div className="mt-6 max-w-2xl text-white/80 text-lg md:text-xl leading-relaxed">
                    <PortableText
                        className="prose-lg prose-invert"
                        value={description as any}
                    />
                </div>

                {/* CTA Button */}
                <Link
                    href="/"
                    className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105"
                >
                    Explorar artículos
                    <svg className="h-4 w-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </Link>
            </div>

            {/* Bottom gradient fade for scroll transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </div>
    );
}
