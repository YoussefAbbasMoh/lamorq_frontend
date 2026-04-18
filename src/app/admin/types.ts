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

export interface OrderLineItem {
  productId: string;
  nameEn: string;
  nameAr: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface OrderDelivery {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode?: string;
  country?: string;
}

export interface Order {
  id: number;
  customerPhone: string;
  /** Optional — for confirmation / status emails */
  customerEmail?: string;
  date: string;
  total: number;
  subtotal?: number;
  shippingFee?: number;
  paymentMethod: "Cash on Delivery" | "Visa / Mastercard" | "Vodafone Cash";
  status: "pending" | "on-processing" | "delivered" | "cancelled";
  shippingRegionId?: string;
  shippingGovernorateEn?: string;
  shippingGovernorateAr?: string;
  delivery?: OrderDelivery;
  items?: OrderLineItem[];
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

