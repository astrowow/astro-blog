import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";
import PortableText from "./portable-text";
import BadgeCategories from "./components/BadgeCategories";

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
    <header className="relative mb-16 h-screen overflow-hidden">
      <div className="flex h-full">
        <div className="relative w-1/2">
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
        <div className="flex w-1/2 items-center justify-center bg-white p-5 text-center text-black">
          <div>
            <h1 className="text-balance text-6xl font-sans font-bold leading-tight tracking-tighter lg:text-8xl">
              {(title || demo.title).split("").map((ch, idx) => (
                <span
                  key={idx}
                  className={["text-[#F1C21E]", "text-[#045396]", "text-[#E83B13]", "text-[#09935F]"][idx % 4]}
                >
                  {ch}
                </span>
              ))}
            </h1>
            <h2 className="text-pretty mt-5 text-center text-lg lg:pl-8">
              <PortableText
                className="prose-lg"
                value={description?.length ? description : demo.description}
              />
            </h2>
          </div>
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
    <article>
      <Link className="group mb-8 block md:mb-16" href={`/posts/${slug}`}>
        <CoverImage image={coverImage} priority />
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
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
            authors={heroPost.authors?.filter(Boolean) ?? null}
            categories={heroPost.categories?.filter(Boolean) ?? null}
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
