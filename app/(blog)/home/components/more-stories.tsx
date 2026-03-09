import PostCard from "./PostCard";

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
    <div className="mb-32 columns-1 gap-6 md:columns-2 lg:columns-3">
      {data?.map((post: any, index: number) => {
        const { _id, title, slug, coverImage, excerpt, authors, categories } = post;
        return (
          <div key={_id} className="mb-6 break-inside-avoid">
            <PostCard
              title={title}
              slug={slug}
              coverImage={coverImage}
              excerpt={excerpt}
              date={post.date}
              authors={authors?.filter(
                (a: any) => a.name !== null && a.picture !== null
              ) ?? []}
              categories={categories?.filter(
                (c: any) => c.name !== null && c.slug !== null
              ) ?? []}
              priority={index < 3}
            />
          </div>
        );
      })}
    </div>
  );
}
