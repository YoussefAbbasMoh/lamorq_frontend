import type { Product, ContactMessage } from "./types";
import type { ReviewData } from "../data/reviewsData";

export const CATEGORY_TO_API: Record<string, string> = {
  "Hair Care": "hair_care",
  "Skin Care": "skin_care",
  "Body Care": "body_care",
};

export const CATEGORY_FROM_API: Record<string, string> = {
  hair_care: "Hair Care",
  skin_care: "Skin Care",
  body_care: "Body Care",
};

export function mapDefaultProduct(p: Record<string, unknown>): Product {
  const name = (p.name as { en?: string; ar?: string }) || {};
  const details = (p.details as {
    description?: { en?: string; ar?: string };
    ingredients?: { en?: string; ar?: string };
    benefits?: { en?: string; ar?: string };
    howToUse?: { en?: string; ar?: string };
  }) || {};

  return {
    id: String(p._id),
    nameEn: name.en || "",
    nameAr: name.ar || "",
    category: CATEGORY_FROM_API[String(p.category)] || String(p.category),
    productType: "default",
    price: Number(p.price) || 0,
    discountPrice: p.discountPrice != null ? Number(p.discountPrice) : undefined,
    rating: p.rating != null ? Number(p.rating) : undefined,
    ratingCount: p.ratingCount != null ? Number(p.ratingCount) : undefined,
    image: String(p.imageUrl || ""),
    ingredients: Array.isArray(p.ingredients) ? (p.ingredients as string[]) : [],
    isFeatured: Boolean(p.isFeatured),
    descriptionEn: details.description?.en,
    descriptionAr: details.description?.ar,
    ingredientsDescriptionEn: details.ingredients?.en,
    ingredientsDescriptionAr: details.ingredients?.ar,
    benefitsEn: details.benefits?.en,
    benefitsAr: details.benefits?.ar,
    howToUseEn: details.howToUse?.en,
    howToUseAr: details.howToUse?.ar,
  };
}

export function mapUpcomingProduct(p: Record<string, unknown>): Product {
  const name = (p.name as { en?: string; ar?: string }) || {};
  const desc = (p.description as { en?: string; ar?: string }) || {};

  return {
    id: String(p._id),
    nameEn: name.en || "",
    nameAr: name.ar || "",
    category: CATEGORY_FROM_API[String(p.category)] || String(p.category),
    productType: "upcoming",
    image: String(p.imageUrl || ""),
    isFeatured: Boolean(p.isFeatured),
    descriptionEn: desc.en,
    descriptionAr: desc.ar,
  };
}

export function mapMessage(m: Record<string, unknown>): ContactMessage {
  const rawStatus = String(m.status || "un-read");
  return {
    id: String(m._id),
    firstName: String(m.fullName || ""),
    email: "",
    phone: String(m.phoneNumber || ""),
    subject: String(m.subject || ""),
    message: String(m.message || ""),
    date: m.createdAt
      ? new Date(String(m.createdAt)).toISOString().slice(0, 10)
      : "",
    status: rawStatus === "read" ? "read" : "unread",
  };
}

export function mapRating(r: Record<string, unknown>): ReviewData {
  return {
    id: String(r._id),
    customerName: String(r.name || ""),
    reviewContent: String(r.content || ""),
    rating: Number(r.rating) || 0,
  };
}

