import type { QueryParams } from "next-sanity";

import { client } from "@/sanity/lib/client";

/**
 * Used to fetch data in Client Components, it doesn't support Draft Mode.
 * Always uses the "published" perspective and doesn't use authentication tokens.
 */
export async function sanityFetchClient<const QueryString extends string>({
  query,
  params = {},
  stega = false,
}: {
  query: QueryString;
  params?: QueryParams;
  stega?: boolean;
}) {
  return client.fetch(query, params, {
    stega,
    perspective: "published",
    useCdn: true,
    // No token for client components - only public data
  });
}