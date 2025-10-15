import { groq } from "next-sanity";

export const aboutmeQuery = groq`
  *[_type == "page" && slug.current == "about-me"][0]
`;