import Link from "next/link";
import CoverImage from "../../shared/ui/cover-image";

interface Post {
    _id: string;
    title: string;
    slug: string;
    coverImage: any;
}

interface RecentArticlesSliderProps {
    posts: Post[];
}

export default function RecentArticlesSlider({ posts }: RecentArticlesSliderProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="px-6 md:px-10 py-10" id="articulos">
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
                    {posts.map((post, index) => (
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
    );
}
