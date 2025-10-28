import Link from "next/link";

import Avatar from "../../shared/ui/avatar";
import CoverImage from "../../shared/ui/cover-image";
import DateComponent from "../../shared/ui/date";
import BadgeCategories from "../../categories/components/BadgeCategories";

import { sanityFetch } from "@/sanity/lib/fetch";
import { moreStoriesQuery } from "@/sanity/lib/queries";

export default async function MoreStories(params: {
  skip: string;
  limit: number;
  posts?: any[];
}) {
  const data = params.posts
    ? params.posts
    : await sanityFetch({ query: moreStoriesQuery, params });

  return (
    <>
      <div className="mb-32 grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
        {data?.map((post: any) => {
          const { _id, title, slug, coverImage, excerpt, authors, categories } = post;
          return (
            <article
              key={_id}
              className="overflow-hidden bg-white shadow-lg md:bg-transparent md:shadow-none"
            >
              <Link href={`/posts/${slug}`} className="group block">
                <CoverImage image={coverImage} priority={false} />
              </Link>
              <div className="p-5">
                <h3 className="text-balance mb-3 text-3xl leading-snug">
                  <Link href={`/posts/${slug}`} className="hover:underline">
                    {title}
                  </Link>
                </h3>
                <div className="mb-4 flex flex-wrap items-center justify-between text-lg italic text-neutral-500">
                  <DateComponent dateString={post.date} />
                  {categories?.length ? (
                    <BadgeCategories categories={categories} />
                  ) : null}
                </div>
                {excerpt && (
                  <p className="text-pretty mb-4 text-lg leading-relaxed text-neutral-500 font-sans">
                    {excerpt}
                  </p>
                )}
                {authors?.length ? (
                  <div className="flex flex-wrap gap-3">
                    {authors.map((a: any) => (
                      <Avatar
                        key={(a.slug || a.name) + "-list"}
                        name={a.name}
                        picture={a.picture}
                        slug={a.slug}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
