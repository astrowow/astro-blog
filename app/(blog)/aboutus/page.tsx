import Link from "next/link";
import * as demo from "@/sanity/lib/demo";
import PortableText from "../shared/ui/portable-text";
import { type PortableTextBlock } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import { aboutmeQuery } from "@/sanity/lib/queries";
import { asciiArtHtml } from "./ascii";

export default async function AboutUsPage() {
  const about = (await sanityFetch({ query: aboutmeQuery })) as any;

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: asciiArtHtml }}
      />
      <div className="relative container mx-auto px-5 z-10 flex flex-col min-h-screen text-dark">
        <h1 className="text-balance mb-12 text-6xl font-sans leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
          {about?.title || "Sobre nosotros"}
        </h1>
        {about?.content?.length ? (
          <PortableText className="mx-auto max-w-2xl" value={about.content as PortableTextBlock[]} />
        ) : (
          <p className="text-neutral-600">Crea la página en el Studio y agrega contenido.</p>
        )}
      </div>
    </div>
  );
}