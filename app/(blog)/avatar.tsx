import { Image } from "next-sanity/image";
import Link from "next/link";

import type { Author } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

interface Props {
  name: string;
  picture: Exclude<Author["picture"], undefined> | null;
  slug?: string | null;
}

export default function Avatar({ name, picture, slug }: Props) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    slug ? <Link href={`/authors/${slug}`}>{children}</Link> : <>{children}</>;

  return (
    <div className="flex items-center text-xl">
      <Wrapper>
        {picture?.asset?._ref ? (
          <div className="mr-4 h-12 w-12">
            <Image
              alt={picture?.alt || ""}
              className="h-full rounded-full object-cover"
              height={48}
              width={48}
              src={
                urlForImage(picture)
                  ?.height(96)
                  .width(96)
                  .fit("crop")
                  .url() as string
              }
            />
          </div>
        ) : null}
      </Wrapper>
      <div className="text-pretty text-xl font-bold">
        <Wrapper>{name}</Wrapper>
      </div>
    </div>
  );
}
