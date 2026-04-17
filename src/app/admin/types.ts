import type { ReviewData } from "../data/reviewsData";

export type Language = "en" | "ar";

export type ProductType = "default" | "upcoming";

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  category: string;
  productType: ProductType;
  price?: number;
  discountPrice?: number;
  rating?: number;
  ratingCount?: number;
  image: string;
  ingredients?: string[];
  isFeatured: boolean;
  descriptionEn?: string;
  descriptionAr?: string;
  ingredientsDescriptionEn?: string;
  ingredientsDescriptionAr?: string;
  benefitsEn?: string;
  benefitsAr?: string;
  howToUseEn?: string;
  howToUseAr?: string;
}

export interface Order {
  id: number;
  customerPhone: string;
  date: string;
  total: number;
  paymentMethod: "Cash on Delivery" | "Visa / Mastercard" | "Vodafone Cash";
  status: "pending" | "on-processing" | "delivered" | "cancelled";
}

export interface ContactMessage {
  id: string;
  firstName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: "read" | "unread";
}

export type { ReviewData };

