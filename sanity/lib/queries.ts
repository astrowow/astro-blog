import { defineQuery } from "next-sanity";
import type {
  SanityImageAssetReference,
  SanityImageHotspot,
  SanityImageCrop,
} from "@/sanity.types";

/** Reusable Sanity image object — matches the shape returned by GROQ projections. */
export interface SanityImage {
  asset?: SanityImageAssetReference;
  media?: unknown;
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  alt?: string;
  _type: "image";
}

/** Author shape returned by postFields GROQ projection. */
export interface PostAuthor {
  name: string;
  picture: SanityImage | null;
  slug: string | null;
}

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

export const aboutmeQuery = defineQuery(`
  *[_type == "page" && slug.current == "about-me"][0]
`);

// Category and Post types for global use
export interface Category {
  name: string | null;
  slug: string | null;
  description?: string | null;
  postCount?: number;
}

export interface Post {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  coverImage: SanityImage | null;
  date: string;
  authors: PostAuthor[] | null;
  categories: Array<{ name: string | null; slug: string | null }> | null;
}

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "authors": select(
    count(authors) > 0 => authors[]->{"name": coalesce(name, "Anonymous"), picture, "slug": slug.current},
    defined(author) => [author->{"name": coalesce(name, "Anonymous"), picture, "slug": slug.current}],
    []
  ),
  "categories": categories[]->{name, "slug": slug.current},
`;

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    content,
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content,
    ${postFields}
  }
`);

// Author profile queries
export const authorBySlugQuery = defineQuery(`
  *[_type == "author" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    picture,
    bio
  }
`);

export const authorSlugsQuery = defineQuery(`*[_type == "author" && defined(slug.current)]{"slug": slug.current}`);

export const postsByAuthorQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && (author->slug.current == $slug || $slug in authors[]->slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const postsByCategoryQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && $slug in categories[]->slug.current] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

// Category queries
export const allCategoriesQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(name asc) {
    name,
    "slug": slug.current,
    description,
    "postCount": count(*[_type == "post" && defined(slug.current) && references(^._id)])
  }
`);

export const categoryBySlugQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    description
  }
`);

// Get all posts for search (without filters)
export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

// Team / all authors query
export const allAuthorsQuery = defineQuery(`
  *[_type == "author"] | order(name asc) {
    name,
    "slug": slug.current,
    picture,
    bio
  }
`);

