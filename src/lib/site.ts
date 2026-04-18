/** Canonical site origin for metadata, canonical URLs, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production. */
export const siteUrl =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL.trim()
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : "http://localhost:3000";

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${p}`;
}
