import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

import Avatar from "../../shared/ui/avatar";
import CoverImage from "../../shared/ui/cover-image";
import DateComponent from "../../shared/ui/date";
import MoreStories from "../../home/components/more-stories";
import PortableText from "../../shared/ui/portable-text";
import BadgeCategories from "../../categories/components/BadgeCategories";

import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery } from "@/sanity/lib/queries";
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
  const post = await sanityFetch({
    query: postQuery,
    params,
    perspective: "published",
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors: Array.isArray(post?.authors)
      ? post!.authors!.filter(Boolean).map((a: any) => ({ name: a?.name }))
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
    <div className="container mx-auto px-5">
      <article>
        <h1 className="text-balance mb-12 text-6xl leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
          {post.title}
        </h1>
        <div className="hidden md:mb-12 md:block">
          {post.authors?.length ? (
            <div className="flex flex-wrap gap-3">
              {post.authors.map((a: any) => (
                <Avatar key={(a.slug || a.name) + "-post-top"} name={a.name} picture={a.picture} slug={a.slug} />
              ))}
            </div>
          ) : null}
          {post.categories?.length ? (
            <div className="mt-4">
              <BadgeCategories categories={post.categories} />
            </div>
          ) : null}
        </div>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverImage image={post.coverImage} priority />
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 block md:hidden">
            {post.authors?.length ? (
              <div className="flex flex-wrap gap-3">
                {post.authors.map((a: any) => (
                  <Avatar key={(a.slug || a.name) + "-post-mobile"} name={a.name} picture={a.picture} slug={a.slug} />
                ))}
              </div>
            ) : null}
            {post.categories?.length ? (
              <div className="mt-4">
                <BadgeCategories categories={post.categories} />
              </div>
            ) : null}
          </div>
          <div className="mb-6 text-lg">
            <div className="mb-4 text-lg text-neutral-500 italic">
              <DateComponent dateString={post.date} />
            </div>
          </div>
        </div>
        {post.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={post.content as PortableTextBlock[]}
          />
        )}
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
