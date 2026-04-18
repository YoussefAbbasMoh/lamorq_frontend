import type { Metadata } from "next";
import ProductDetails from "@/storefront/pages/ProductDetails";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { absoluteUrl } from "@/lib/site";
import { pageOpenGraph, pageTwitter, truncateMetaDescription } from "@/lib/metadata-helpers";
import { getStoreProductForPage } from "@/lib/store-product-server";

function productImageForOg(product: { image: string; images: string[] }): string | undefined {
  const u = product.images[0] || product.image;
  if (!u) return undefined;
  return u.startsWith("http") ? u : absoluteUrl(u);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getStoreProductForPage(id);
  if (!product) {
    return { title: "Product" };
  }
  const description = truncateMetaDescription(product.shortDesc || product.description);
  const path = `/products/${id}`;
  const ogTitle = `${product.name} — LAMORQ`;
  const img = productImageForOg(product);
  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...pageOpenGraph(path, product.name, description, ogTitle),
      images: img ? [{ url: img, alt: `${product.name} — LAMORQ` }] : undefined,
    },
    twitter: {
      ...pageTwitter(product.name, description, ogTitle),
      images: img ? [img] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getStoreProductForPage(id);
  return (
    <>
      {product && <ProductJsonLd product={product} />}
      <ProductDetails />
    </>
  );
}
