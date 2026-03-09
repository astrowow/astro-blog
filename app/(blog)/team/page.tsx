import Link from "next/link";
import { Image } from "next-sanity/image";
import { type Metadata } from "next";

import { sanityFetch } from "@/sanity/lib/fetch";
import { allAuthorsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/utils";

export const metadata: Metadata = {
    title: "Nuestro Equipo",
    description:
        "Conoce a los miembros del equipo detrás de AstroWOW!, un grupo de divulgación con un gran amor por la ciencia y los telescopios.",
};

export default async function TeamPage() {
    const authors = await sanityFetch({ query: allAuthorsQuery });

    return (
        <div className="container mx-auto px-5">
            <header className="mb-16">
                <h1 className="text-balance text-6xl font-sans font-bold leading-tight tracking-tighter md:text-7xl lg:text-8xl">
                    Nuestro Equipo
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-neutral-500 font-sans">
                    Las personas detrás de AstroWOW! que hacen posible la divulgación
                    científica.
                </p>
            </header>

            {!authors?.length ? (
                <p className="text-neutral-500">
                    Aún no hay miembros del equipo registrados.
                </p>
            ) : (
                <div className="mb-32 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {authors.map((author: any) => (
                        <Link
                            key={author.slug || author.name}
                            href={`/authors/${author.slug}`}
                            className="group relative flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-8 text-center transition-all duration-300 hover:border-neutral-400 hover:shadow-lg"
                        >
                            {/* Avatar */}
                            {author.picture?.asset?._ref ? (
                                <div className="mb-6 h-32 w-32 overflow-hidden rounded-full ring-4 ring-neutral-100 transition-all duration-300 group-hover:ring-neutral-300">
                                    <Image
                                        alt={author.picture?.alt || author.name || ""}
                                        className="h-full w-full object-cover"
                                        height={256}
                                        width={256}
                                        src={
                                            urlForImage(author.picture)
                                                ?.height(512)
                                                .width(512)
                                                .fit("crop")
                                                .url() as string
                                        }
                                    />
                                </div>
                            ) : (
                                <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-neutral-100 text-4xl font-bold text-neutral-400">
                                    {(author.name || "?").charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Name */}
                            <h2 className="text-xl font-sans font-bold tracking-tight group-hover:underline">
                                {author.name}
                            </h2>

                            {/* Bio excerpt */}
                            {author.bio?.length ? (
                                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-500 font-sans">
                                    {author.bio
                                        .filter((block: any) => block._type === "block")
                                        .map((block: any) =>
                                            block.children
                                                ?.map((child: any) => child.text)
                                                .join("")
                                        )
                                        .join(" ")}
                                </p>
                            ) : null}

                            {/* Hover indicator */}
                            <span className="mt-5 text-xs font-sans font-semibold uppercase tracking-widest text-neutral-400 transition-colors duration-300 group-hover:text-black">
                                Ver perfil →
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
