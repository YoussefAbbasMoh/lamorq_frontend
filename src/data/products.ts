/**
 * Storefront product shape (cart, cards, PDP). Populated via `mapApiProductToStoreProduct`.
 */
export interface Product {
  id: string;
  name: string;
  nameAr: string;
  shortDesc: string;
  shortDescAr: string;
  description: string;
  descriptionAr: string;
  ingredients: string;
  ingredientsAr: string;
  benefits: string;
  benefitsAr: string;
  howToUse: string;
  howToUseAr: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  category: string;
  categoryAr: string;
  featured?: boolean;
  purity: string;
  vitamins: string[];
}

/** Category filters in URLs and UI (`?category=hair-care`) */
export const categories = [
  { id: "skin-care", name: "Skin Care", nameAr: "العناية بالبشرة", icon: "Sparkles" },
  { id: "hair-care", name: "Hair Care", nameAr: "العناية بالشعر", icon: "Scissors" },
  { id: "body-care", name: "Body Care", nameAr: "العناية بالجسم", icon: "Heart" },
];
