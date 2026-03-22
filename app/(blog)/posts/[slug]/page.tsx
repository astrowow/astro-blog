import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Avatar from "../../shared/ui/avatar";
import CoverImage from "../../shared/ui/cover-image";
import DateComponent from "../../shared/ui/date";
import MoreStories from "../../home/components/more-stories";
import PortableText from "../../shared/ui/portable-text";
import BadgeCategories from "../../categories/components/BadgeCategories";

import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery } from "@/sanity/lib/queries";
import type { PostAuthor } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { client } from "@/sanity/lib/client";

type Props = {
  params: Promise<{ slug: string }>;
};

const postSlugs = defineQuery(
  `*[_type == "post" && defined(slug.current)]{"slug": slug.current}`,
);

export async function generateStaticParams() {
  const data = await client.fetch(postSlugs);
  return (data ?? [])
    .map(({ slug }: { slug: string | null }) => (slug ? { slug } : null))
    .filter(Boolean) as { slug: string }[];
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [post, resolvedParent] = await Promise.all([
    sanityFetch({
      query: postQuery,
      params,
      perspective: "published",
      stega: false,
    }),
    parent
  ]);

  const previousImages = resolvedParent.openGraph?.images || [];
  const ogImage = post?.coverImage ? resolveOpenGraphImage(post.coverImage) : undefined;

  return {
    authors: Array.isArray(post?.authors)
      ? post!.authors!.filter(Boolean).map((a: PostAuthor) => ({ name: a?.name }))
      : [],
    title: post?.title ?? undefined,
    description: post?.excerpt ?? undefined,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage({ params }: Props) {
  const post = await sanityFetch({ query: postQuery, params });

  if (!post?._id) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-5">
      <article>
        <header className="mx-auto max-w-4xl py-10 text-center md:py-16">
          <h1 className="text-balance mb-6 text-4xl font-sans font-light leading-tight tracking-tight md:text-5xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <div className="text-md">
              <DateComponent dateString={post.date} format="shortMonthYear" />
            </div>
          </div>
        </header>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverImage image={post.coverImage} priority />
        </div>
        <div className="mx-auto max-w-2xl">
          {post.content?.length && (
            <PortableText
              className="mx-auto max-w-2xl prose prose-neutral text-neutral-800 prose-headings:font-medium prose-p:leading-relaxed prose-a:text-blue-600"
              value={post.content as PortableTextBlock[]}
            />
          )}

          <div className="mt-12 flex flex-col gap-6 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
            {post.authors?.length ? (
              <div className="flex flex-wrap items-center gap-3">
                {post.authors.map((a: PostAuthor) => (
                  <Avatar key={(a.slug || a.name) + "-post-bottom"} name={a.name} picture={a.picture} slug={a.slug} />
                ))}
              </div>
            ) : <div />}
            {post.categories?.length ? (
              <div className="flex justify-start sm:justify-end">
                <BadgeCategories categories={post.categories} />
              </div>
            ) : null}
          </div>
        </div>
      </article>
      <aside>
        <hr className="border-accent-2 mb-24 mt-28" />
        <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
          Recientes
        </h2>
        <Suspense>
          <MoreStories skip={post._id} limit={2} />
        </Suspense>
      </aside>
    </div>
  );
}
