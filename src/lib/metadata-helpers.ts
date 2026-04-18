import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

const OG_IMAGE =
  typeof process.env.NEXT_PUBLIC_OG_IMAGE_URL === "string" && process.env.NEXT_PUBLIC_OG_IMAGE_URL.trim()
    ? process.env.NEXT_PUBLIC_OG_IMAGE_URL.trim()
    : null;

/** Optional default Open Graph / Twitter image (1200×630 recommended). */
export function defaultOgImage(): NonNullable<Metadata["openGraph"]>["images"] | undefined {
  if (!OG_IMAGE) return undefined;
  return [{ url: OG_IMAGE, width: 1200, height: 630, alt: "LAMORQ skincare" }];
}

export function defaultTwitterImageUrls(): string[] | undefined {
  if (!OG_IMAGE) return undefined;
  return [OG_IMAGE];
}

export function pageOpenGraph(
  path: string,
  title: string,
  description: string,
  ogTitle?: string
): NonNullable<Metadata["openGraph"]> {
  return {
    title: ogTitle ?? title,
    description,
    url: absoluteUrl(path),
    siteName: "LAMORQ",
    locale: "en_US",
    type: "website",
    images: defaultOgImage(),
  };
}

export function pageTwitter(title: string, description: string, ogTitle?: string): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title: ogTitle ?? title,
    description,
    images: OG_IMAGE ? [OG_IMAGE] : undefined,
  };
}

export function truncateMetaDescription(s: string, max = 155): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}
