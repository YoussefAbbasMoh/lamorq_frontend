export type ReviewData = {
  id: string;
  customerName: string;
  reviewContent: string;
  rating: number;
  image?: string;
  location?: string;
};

/** Seed data for offline UI only; dashboard loads reviews from the API when logged in. */
export const reviewsData: ReviewData[] = [];
