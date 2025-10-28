import Link from "next/link";
import { notFound } from "next/navigation";

import Avatar from "../../shared/ui/avatar";
import CoverImage from "../../shared/ui/cover-image";
import DateComponent from "../../shared/ui/date";
import PortableText from "../../shared/ui/portable-text";

import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { authorBySlugQuery, authorSlugsQuery, postsByAuthorQuery } from "@/sanity/lib/queries";

export async function generateStaticParams() {
  const data = await client.fetch(authorSlugsQuery);
  return (data ?? [])
    .map(({ slug }: { slug: string | null }) => (slug ? { slug } : null))
    .filter(Boolean) as { slug: string }[];
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const author = await sanityFetch({ query: authorBySlugQuery, params: { slug } });
  if (!author) return notFound();

  const posts = await sanityFetch({ query: postsByAuthorQuery, params: { slug } });

  return (
    <div className="container mx-auto px-5">
      <header className="mb-12">
        <div className="mt-6">
          <Avatar name={author.name ?? "Anónimo"} picture={author.picture} slug={(author as any)?.slug ?? null} />
        </div>
        {author.bio?.length ? (
          <div className="mt-8">
            <PortableText className="prose" value={author.bio as any} />
          </div>
        ) : null}
      </header>

      <section>
        <h2 className="mb-8 text-3xl font-semibold">Publicaciones de {author.name}</h2>
        {!posts?.length ? (
          <p className="text-neutral-500">Este autor aún no tiene publicaciones.</p>
        ) : (
          <div className="grid grid-cols-1 mb-32 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
            {posts.map((post: any) => {
              const { _id, title, slug: postSlug, coverImage, excerpt, authors, date } = post;
              return (
                <article key={_id}>
                  <Link href={`/posts/${postSlug}`} className="group mb-5 block">
                    <CoverImage image={coverImage} priority={false} />
                  </Link>
                  <h3 className="text-balance font-sans font-semibold mb-3 text-3xl leading-snug">
                    <Link href={`/posts/${postSlug}`} className="hover:underline">
                      {title}
                    </Link>
                  </h3>
                  <div className="mb-4 text-lg italic text-neutral-500">
                    <DateComponent dateString={date} />
                  </div>
                  {excerpt && (
                    <p className="text-pretty mb-4 text-lg leading-relaxed text-neutral-500 font-sans">
                      {excerpt}
                    </p>
                  )}
                  {authors?.length ? (
                    <div className="flex flex-wrap gap-3">
                      {authors.map((a: any) => (
                        <Avatar key={(a.slug || a.name) + "-author-list"} name={a.name ?? "Anónimo"} picture={a.picture} slug={a.slug ?? null} />
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}