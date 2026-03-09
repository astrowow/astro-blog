import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import * as demo from "@/sanity/lib/demo";
import PortableText from "../../(blog)/shared/ui/portable-text";
import Link from "next/link";

export const metadata = {
    title: "Hero C — Typography Video Clip",
};

export default async function HeroCPage() {
    const settings = await sanityFetch({ query: settingsQuery });
    const title = settings?.title || demo.title;
    const description = settings?.description?.length
        ? settings.description
        : demo.description;

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Navigation */}
            <nav className="relative z-20 flex items-center justify-between p-6 md:p-10">
                <Link href="/" className="text-white/50 text-sm hover:text-white transition-colors">
                    ← Volver al inicio
                </Link>
                <span className="text-white/30 text-xs tracking-widest uppercase">Prototipo C</span>
            </nav>

            {/* Hero content */}
            <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6">
                {/* Video element (hidden, used as source for clip) */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-0 pointer-events-none"
                    id="hero-video"
                >
                    <source src="/header2.webm" type="video/webm" />
                    <source src="/header.webm" type="video/webm" />
                </video>

                {/* Giant title with video filling the text */}
                <div className="relative z-10 flex flex-col items-center">
                    <h1
                        className="text-[5rem] md:text-[10rem] lg:text-[14rem] xl:text-[18rem] font-sans font-black leading-[0.85] tracking-tighter text-center"
                        aria-label={title}
                        style={{
                            backgroundImage: "url('/header2.webm')",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        {/* We use an inline video overlay approach instead */}
                        {title}
                    </h1>

                    {/* Overlay: video playing inside text via SVG clipPath */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid meet">
                            <defs>
                                <clipPath id="text-clip">
                                    <text
                                        x="50%"
                                        y="55%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize="280"
                                        fontWeight="900"
                                        fontFamily="var(--font-instrument-sans), system-ui, sans-serif"
                                    >
                                        {title}
                                    </text>
                                </clipPath>
                            </defs>
                            <foreignObject
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                clipPath="url(#text-clip)"
                            >
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="h-full w-full object-cover"
                                >
                                    <source src="/header2.webm" type="video/webm" />
                                    <source src="/header.webm" type="video/webm" />
                                </video>
                            </foreignObject>
                        </svg>
                    </div>
                </div>

                {/* Subtle animated glow behind the text */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
                    style={{
                        background: "conic-gradient(from 0deg, #F1C21E, #045396, #E83B13, #09935F, #F1C21E)",
                        animation: "spin 20s linear infinite",
                    }}
                />

                {/* Subtitle + CTA */}
                <div className="relative z-10 mt-12 flex flex-col items-center text-center max-w-2xl">
                    <div className="text-white/60 text-base md:text-lg leading-relaxed">
                        <PortableText
                            className="prose-base prose-invert"
                            value={description}
                        />
                    </div>
                    <Link
                        href="/"
                        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/40 hover:scale-105"
                    >
                        Explorar artículos
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Bottom decorative elements */}
            <div className="relative z-10 flex justify-center gap-6 pb-10 mt-auto">
                {["#F1C21E", "#045396", "#E83B13", "#09935F"].map((color, i) => (
                    <div
                        key={color}
                        className="h-1 w-12 rounded-full opacity-60"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>

            {/* CSS animation keyframes */}
            <style>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
