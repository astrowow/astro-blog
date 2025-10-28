import { asciiArtHtml } from './ascii';
import * as demo from "@/sanity/lib/demo";
import Link from "next/link";
import PortableText from "../shared/ui/portable-text";
import { type PortableTextBlock } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import { aboutmeQuery } from "@/sanity/lib/queries";

export default async function AboutMe() {
  const about = (await sanityFetch({ query: aboutmeQuery })) as any;

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: asciiArtHtml }}
      />
      <div className="relative container mx-auto px-5 z-10 flex flex-col min-h-screen text-dark">
        <h2 className="mb-16 mt-10 text-2xl font-semibold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
          <Link href="/" className="hover:underline">
            {demo.title}
          </Link>
        </h2>
        <h1 className="text-balance mb-12 text-6xl font-sans leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
          Sobre nosotros
        </h1>
        {about?.content?.length ? (
          <PortableText className="mx-auto max-w-2xl" value={about.content as PortableTextBlock[]} />
        ) : (
          <p className="text-neutral-600">Crea la página &quot;about-me&quot; en el Studio y agrega contenido.</p>
        )}
      </div>
    </div>
  );
}