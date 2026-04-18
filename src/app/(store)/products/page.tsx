import { Suspense } from "react";
import type { Metadata } from "next";
import AllProducts from "@/storefront/pages/AllProducts";
import { pageOpenGraph, pageTwitter } from "@/lib/metadata-helpers";

const title = "Shop Skincare & Care";
const description =
  "Browse LAMORQ products for skin, hair, and body — gentle formulas for a healthy-looking glow.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/products" },
  openGraph: pageOpenGraph("/products", title, description),
  twitter: pageTwitter(title, description),
};

export default function ProductsListingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-page py-24 text-center text-muted-foreground">Loading…</div>
      }
    >
      <AllProducts />
    </Suspense>
  );
}
