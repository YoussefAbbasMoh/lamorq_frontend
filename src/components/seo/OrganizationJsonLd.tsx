import { absoluteUrl } from "@/lib/site";

/** Homepage / sitewide — Organization schema (no medical claims). */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LAMORQ",
    description:
      "Egyptian skincare brand focused on science-backed, gentle ingredients for brighter, even, healthy-looking skin.",
    url: absoluteUrl("/"),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
