import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/lib/api";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

function hasAssetRef(source: SanityImageSource): source is { asset: { _ref: string } } {
  return typeof source === "object" && source !== null && "asset" in source &&
    typeof (source as Record<string, unknown>).asset === "object" &&
    (source as Record<string, Record<string, unknown>>).asset !== null &&
    typeof (source as Record<string, Record<string, unknown>>).asset._ref === "string";
}

export const urlForImage = (source: SanityImageSource) => {
  // Ensure that source image contains a valid reference
  if (!hasAssetRef(source)) {
    return undefined;
  }

  return imageBuilder?.image(source).auto("format").fit("max");
};

export function resolveOpenGraphImage(image: (SanityImageSource & { alt?: string }) | undefined | null, width = 1200, height = 627) {
  if (!image) return;
  const url = urlForImage(image)?.width(1200).height(627).fit("crop").url();
  if (!url) return;
  return { url, alt: image?.alt as string, width, height };
}

export function resolveHref(
  documentType?: string,
  slug?: string,
): string | undefined {
  switch (documentType) {
    case "post":
      return slug ? `/posts/${slug}` : undefined;
    default:
      console.warn("Invalid document type:", documentType);
      return undefined;
  }
}
