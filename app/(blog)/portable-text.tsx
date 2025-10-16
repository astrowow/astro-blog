/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import React from "react";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import { urlForImage } from "@/sanity/lib/utils";
import Image from "next/image";
import { InstagramIcon, YouTubeIcon } from "./components/icons";

// Función para reemplazar texto específico con iconos
const replaceTextWithIcons = (text: string) => {
  if (text === "📷 Instagram") {
    return (
      <span className="inline-flex items-center gap-1">
        <InstagramIcon className="w-4 h-4" />
        Instagram
      </span>
    );
  }
  
  if (text === "▶️ YouTube") {
    return (
      <span className="inline-flex items-center gap-1">
        <YouTubeIcon className="w-4 h-4" />
        YouTube
      </span>
    );
  }
  
  return text;
};

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p>{children}</p>,
      h5: ({ children }) => (
        <h5 className="mb-2 text-sm font-semibold">{children}</h5>
      ),
      h6: ({ children }) => (
        <h6 className="mb-1 text-xs font-semibold">{children}</h6>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
          {children}
        </blockquote>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        // Procesar children para reemplazar texto con iconos dentro de links
        const processedChildren = React.Children.map(children, (child) => {
          if (typeof child === 'string') {
            return replaceTextWithIcons(child);
          }
          return child;
        });
        
        return (
          <a href={value?.href} rel="noreferrer noopener">
            {processedChildren}
          </a>
        );
      },
    },

    types: {
      contentImage: ({ value }) => {
        if (!value?.asset?._ref) {
          return null;
        }

        return (
          <figure className="my-6">
            <Image
               src={urlForImage(value)?.width(800).height(600).fit("max").auto("format").url() || ""}
               alt={value.alt || ""}
               width={800}
               height={600}
               className="w-full h-auto shadow-md"
               placeholder="blur"
               blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
             />
            {value.caption && (
              <figcaption className="mt-2 text-sm text-gray-600 text-center italic">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };

  return (
    <div className={["prose", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
