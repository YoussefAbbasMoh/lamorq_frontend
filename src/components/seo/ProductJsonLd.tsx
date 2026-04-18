import type { Product } from "@/data/products";
import { absoluteUrl } from "@/lib/site";

type Props = { product: Product };

/** Product rich results — cosmetic framing only in name/description from storefront copy. */
export function ProductJsonLd({ product }: Props) {
  const images = product.images?.length ? product.images : [product.image].filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description?.slice(0, 5000) || product.shortDesc,
    image: images.map((u) => (u.startsWith("http") ? u : absoluteUrl(u))),
    brand: {
      "@type": "Brand",
      name: "LAMORQ",
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.id}`),
      priceCurrency: "EGP",
      price: String(product.price),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
