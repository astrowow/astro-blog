import PostCard from "./PostCard";

import { sanityFetch } from "@/sanity/lib/fetch";
import { moreStoriesQuery } from "@/sanity/lib/queries";
import type { Post, PostAuthor } from "@/sanity/lib/queries";

export default async function MoreStories(params: {
  skip: string;
  limit: number;
  posts?: Post[];
}) {
  const data = params.posts
    ? params.posts
    : await sanityFetch({ query: moreStoriesQuery, params });

  return (
    <div className="mb-32 columns-1 gap-6 md:columns-2 lg:columns-3">
      {data?.map((post: Post, index: number) => {
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
                (a: PostAuthor) => a.name !== null && a.picture !== null
              ) ?? []}
              categories={categories?.filter(
                (c: { name: string | null; slug: string | null }) => c.name !== null && c.slug !== null
              ) as Array<{ name: string; slug: string }> ?? []}
              priority={index < 3}
            />
          </div>
        );
      })}
    </div>
  );
}
