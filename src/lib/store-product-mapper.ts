import type { Product } from "@/data/products";
import { categories } from "@/data/products";

/** URL/query slug (e.g. hair-care) → API enum (hair_care) */
export const API_CATEGORY_FROM_SLUG: Record<string, string> = {
  "hair-care": "hair_care",
  "skin-care": "skin_care",
  "body-care": "body_care",
};

/** API enum → storefront category id used in routes and filters */
export const SLUG_FROM_API_CATEGORY: Record<string, string> = {
  hair_care: "hair-care",
  skin_care: "skin-care",
  body_care: "body-care",
};

function categoryArForSlug(slug: string): string {
  return categories.find((c) => c.id === slug)?.nameAr ?? "";
}

function truncate(s: string, max: number): string {
  const t = (s || "").trim();
  if (!t) return "";
  return t.length <= max ? t : `${t.slice(0, max).trim()}…`;
}

/**
 * Maps list/selling vs compare-at from API `price` + `discountPrice`.
 * Supports both conventions: sale lower than list, or list price stored in discountPrice.
 */
function resolvePricing(price: number, discountPrice: number): { selling: number; compareAt?: number } {
  if (!discountPrice || discountPrice <= 0) {
    return { selling: price };
  }
  if (discountPrice > price) {
    return { selling: price, compareAt: discountPrice };
  }
  return { selling: discountPrice, compareAt: price };
}

export function mapApiProductToStoreProduct(p: Record<string, unknown>): Product {
  const name = (p.name as { en?: string; ar?: string }) || {};
  const details =
    (p.details as {
      description?: { en?: string; ar?: string };
      ingredients?: { en?: string; ar?: string };
      benefits?: { en?: string; ar?: string };
      howToUse?: { en?: string; ar?: string };
    }) || {};

  const descEn = details.description?.en || "";
  const descAr = details.description?.ar || "";
  const ingEn = details.ingredients?.en || "";
  const ingAr = details.ingredients?.ar || "";
  const benEn = details.benefits?.en || "";
  const benAr = details.benefits?.ar || "";
  const howEn = details.howToUse?.en || "";
  const howAr = details.howToUse?.ar || "";

  const apiCat = String(p.category || "");
  const categorySlug = SLUG_FROM_API_CATEGORY[apiCat] || apiCat;

  const apiPrice = Number(p.price) || 0;
  const apiDisc = Number(p.discountPrice) || 0;
  const { selling, compareAt } = resolvePricing(apiPrice, apiDisc);

  const ingList = Array.isArray(p.ingredients) ? (p.ingredients as string[]).map(String) : [];
  const imageUrl = String(p.imageUrl || "/placeholder.svg");

  return {
    id: String(p._id),
    name: name.en || "",
    nameAr: name.ar || "",
    shortDesc: truncate(descEn, 140),
    shortDescAr: truncate(descAr, 140),
    description: descEn,
    descriptionAr: descAr,
    ingredients: ingEn || ingList.join(", "),
    ingredientsAr: ingAr || (ingList.length ? ingList.join("، ") : ""),
    benefits: benEn,
    benefitsAr: benAr,
    howToUse: howEn,
    howToUseAr: howAr,
    price: selling,
    originalPrice: compareAt,
    rating: Number(p.rating) || 0,
    reviews: Number(p.ratingCount) || 0,
    image: imageUrl,
    images: imageUrl ? [imageUrl] : [],
    category: categorySlug,
    categoryAr: categoryArForSlug(categorySlug),
    featured: Boolean(p.isFeatured),
    purity: ingList[0] || "",
    vitamins: ingList.slice(0, 12),
  };
}

export type StoreUpcomingItem = {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  categorySlug: string;
  /** Short text for cards (home). */
  teaserEn: string;
  teaserAr: string;
  /** Full description for upcoming detail page. */
  descriptionEn: string;
  descriptionAr: string;
  isFeatured: boolean;
};

export function mapApiUpcomingToStoreItem(p: Record<string, unknown>): StoreUpcomingItem {
  const name = (p.name as { en?: string; ar?: string }) || {};
  const description = (p.description as { en?: string; ar?: string }) || {};
  const apiCat = String(p.category || "");
  const categorySlug = SLUG_FROM_API_CATEGORY[apiCat] || apiCat;

  const descEn = String(description.en || "").trim();
  const descAr = String(description.ar || "").trim();

  return {
    id: String(p._id),
    name: name.en || "",
    nameAr: name.ar || "",
    image: String(p.imageUrl || ""),
    categorySlug,
    teaserEn: truncate(descEn, 120),
    teaserAr: truncate(descAr, 120),
    descriptionEn: descEn,
    descriptionAr: descAr,
    isFeatured: Boolean(p.isFeatured),
  };
}
