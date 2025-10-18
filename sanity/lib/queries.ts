import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

export const aboutmeQuery = defineQuery(`
  *[_type == "page" && slug.current == "about-me"][0]
`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture, "slug": slug.current},
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
  *[_type == "post" && defined(slug.current) && author->slug.current == $slug] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);
