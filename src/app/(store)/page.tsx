import type { Metadata } from "next";
import Home from "@/storefront/pages/Home";
import { pageOpenGraph, pageTwitter } from "@/lib/metadata-helpers";

const title = "Natural Skincare That Actually Works";
const description =
  "LAMORQ is an Egyptian skincare brand built on science-backed, gentle ingredients. Effective products for brighter, even, healthy-looking skin.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: pageOpenGraph("/", title, description),
  twitter: pageTwitter(title, description),
};

export default function StoreHomePage() {
  return <Home />;
}
