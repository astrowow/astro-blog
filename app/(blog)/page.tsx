import { Suspense } from "react";
import { type Metadata } from "next";

import { type PortableTextBlock } from "next-sanity";
import BentoHero from "./home/components/BentoHero";
import CategoryChips from "./home/components/CategoryChips";
import RecentArticlesSlider from "./home/components/RecentArticlesSlider";
import MoreStories from "./home/components/more-stories";
import Onboarding from "./home/components/onboarding";

import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery, moreStoriesQuery, allCategoriesQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "AstroWOW - Blog de Divulgación Científica",
  description: "Somos un grupo de divulgación con un gran amor por la ciencia y los telescopios. Explora artículos y novedades astronómicas.",
};

export default async function Page() {
  const [settings, heroPost, categories] = await Promise.all([
    sanityFetch({ query: settingsQuery }),
    sanityFetch({ query: heroQuery }),
    sanityFetch({ query: allCategoriesQuery }),
  ]);

  // Fetch recent articles for the slider
  const recentPosts = heroPost?._id
    ? await sanityFetch({
      query: moreStoriesQuery,
      params: { skip: heroPost._id, limit: 6 },
    })
    : [];

  const sliderPosts = [
    ...(heroPost ? [heroPost] : []),
    ...(recentPosts || []),
  ].slice(0, 6);

  return (
    <div className="bg-neutral-50">
      {/* ═══════ VIEWPORT SECTION — fits in h-screen ═══════ */}
      <section className="flex h-screen flex-col pt-6 pb-4 md:pt-10 md:pb-6">
        {heroPost ? (
          <BentoHero
            title={settings?.title}
            description={settings?.description as PortableTextBlock[] | undefined}
            heroPost={heroPost}
          />
        ) : (
          <Onboarding />
        )}

        <CategoryChips categories={categories || []} />
      </section>

      {/* ═══════ BELOW THE FOLD ═══════ */}
      <RecentArticlesSlider posts={sliderPosts} />

      {/* Masonry cards section */}
      {heroPost?._id && (
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <aside>
            <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-neutral-400">
              Más Publicaciones
            </h2>
            <Suspense>
              <MoreStories skip={heroPost._id} limit={100} />
            </Suspense>
          </aside>
        </div>
      )}
    </div>
  );
}
