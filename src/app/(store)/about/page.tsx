import type { Metadata } from "next";
import About from "@/storefront/pages/About";
import { pageOpenGraph, pageTwitter } from "@/lib/metadata-helpers";

const title = "About LAMORQ";
const description =
  "Learn how LAMORQ brings gentle, science-backed skincare from Egypt — purity, transparency, and visible results.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: pageOpenGraph("/about", title, description),
  twitter: pageTwitter(title, description),
};

export default function AboutPage() {
  return <About />;
}
