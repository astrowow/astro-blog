import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";

import Avatar from "./shared/ui/avatar";
import CoverImage from "./shared/ui/cover-image";
import DateComponent from "./shared/ui/date";
import MoreStories from "./home/components/more-stories";
import Onboarding from "./home/components/onboarding";
import PortableText from "./shared/ui/portable-text";
import BadgeCategories from "./categories/components/BadgeCategories";
import CategoryLink from "./categories/components/CategoryLink";

// import type { HeroQueryResult } from "@/sanity.types"; // legacy type no longer needed
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery } from "@/sanity/lib/queries";

function Intro(props: { title: string | null | undefined; description: any }) {
  const title = props.title || demo.title;
  const description = props.description?.length
    ? props.description
    : demo.description;
  return (
    <header className="relative mb-16 flex h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex-col overflow-hidden md:flex-row">
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
          <div className="w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/header2.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/40"></div> {/* Overlay for video */}
          </div>
        </div>
        <div className="flex w-full md:w-1/2 items-center justify-center bg-white p-5 text-center text-black h-1/2 md:h-full">
          <div>
            <h1 className="text-balance text-4xl md:text-6xl font-sans font-bold leading-tight tracking-tighter lg:text-8xl">
              {(title || demo.title).split("").map((ch, idx) => (
                <span
                  key={idx}
                  className={["text-[#F1C21E]", "text-[#045396]", "text-[#E83B13]", "text-[#09935F]"][idx % 4]}
                >
                  {ch}
                </span>
              ))}
            </h1>
            <h2 className="text-pretty mt-5 text-center text-base md:text-lg lg:pl-8">
              <PortableText
                className="prose-lg"
                value={description?.length ? description : demo.description}
              />
            </h2>
          </div>
        </div>
    </header>
  );
}

function HeroPost({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  authors,
  categories,
}: {
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  coverImage: any;
  date: string;
  authors: Array<{ name: string; picture: any; slug: string | null }> | null;
  categories: Array<{ name: string; slug: string }> | null;
}) {
  return (
    <article className="overflow-hidden bg-white shadow-lg md:grid md:bg-transparent md:shadow-none mb-20 md:mb-28">
      <Link
        className="group mb-8 block md:mb-16 md:row-start-1"
        href={`/posts/${slug}`}
      >
        <CoverImage image={coverImage} priority />
      </Link>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 md:row-start-2 p-5 md:p-0">
        <div>
          <h3 className="text-pretty mb-4 text-4xl leading-tight lg:text-6xl">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 text-neutral-500 italic text-lg md:mb-0">
            <DateComponent dateString={date} />
          </div>
          {categories?.length ? (
            <div className="mt-4">
              <BadgeCategories categories={categories} />
            </div>
          ) : null}
        </div>
        <div>
          {excerpt && (
            <p className="text-pretty font-sans text-neutral-500 mb-4 text-lg leading-relaxed">
              {excerpt}
            </p>
          )}
          {authors?.length ? (
            <div className="flex flex-wrap gap-3">
              {authors.map((a) => (
                <Avatar key={(a.slug || a.name) + "-hero"} name={a.name} picture={a.picture} slug={a.slug} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default async function Page() {
  const [settings, heroPost] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
    }),
    sanityFetch({ query: heroQuery }),
  ]);

  return (
    <>
      <Intro title={settings?.title} description={settings?.description} />
      <div className="container mx-auto px-5">
        {heroPost ? (
          <HeroPost
            title={heroPost.title}
            slug={heroPost.slug}
            coverImage={heroPost.coverImage}
            excerpt={heroPost.excerpt}
            date={heroPost.date}
            authors={(heroPost.authors?.filter((author): author is { name: string; picture: any; slug: string } => author.name !== null && author.slug !== null && author.picture !== null) ?? [])}
            categories={(heroPost.categories?.filter((category): category is { name: string; slug: string } => category.name !== null && category.slug !== null) ?? [])}
           />
        ) : (
          <Onboarding />
        )}
        {heroPost?._id && (
          <aside>
            <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
              Más Publicaciones
            </h2>
            <Suspense>
              <MoreStories skip={heroPost._id} limit={100} />
            </Suspense>
          </aside>
        )}
      </div>
    </>
  );
}
