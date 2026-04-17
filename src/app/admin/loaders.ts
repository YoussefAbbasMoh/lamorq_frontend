import * as api from "@/lib/api";
import type { AdminDashboardStats } from "@/lib/api";
import { bustDedupeCache, dedupeAsync } from "@/lib/dedupe-async";
import type { ContactMessage, Order, Product, ReviewData } from "./types";
import { mapDefaultProduct, mapMessage, mapRating, mapUpcomingProduct } from "./mappers";

const K = {
  products: "admin:products",
  dashboardStats: "admin:dashboard-stats",
  orders: "admin:orders",
  messages: "admin:messages",
  reviews: "admin:reviews",
} as const;

/** Call after product create/update/delete so the next load is not served from dedupe cache. */
export function bustAdminProductDataDedupe() {
  bustDedupeCache(K.products);
  bustDedupeCache(K.dashboardStats);
}

export function bustAdminMessagesDedupe() {
  bustDedupeCache(K.messages);
}

export function bustAdminReviewsDedupe() {
  bustDedupeCache(K.reviews);
}

/** Default + upcoming products (used by dashboard + products screens and after product mutations). */
export async function loadAdminProducts(): Promise<Product[]> {
  return dedupeAsync(K.products, async () => {
    const [rawDefault, rawUpcoming] = await Promise.all([
      api.fetchDefaultProducts(),
      api.fetchUpcomingProducts(),
    ]);
    return [...rawDefault.map(mapDefaultProduct), ...rawUpcoming.map(mapUpcomingProduct)];
  });
}

export async function loadAdminMessages(): Promise<ContactMessage[]> {
  return dedupeAsync(K.messages, async () => {
    const raw = await api.fetchMessages();
    return raw.map(mapMessage);
  });
}

export async function loadAdminReviews(): Promise<ReviewData[]> {
  return dedupeAsync(K.reviews, async () => {
    const raw = await api.fetchRatings();
    return raw.map(mapRating);
  });
}

export async function loadAdminDashboardStats(): Promise<AdminDashboardStats> {
  return dedupeAsync(K.dashboardStats, () => api.fetchAdminDashboardStats());
}

export async function loadAdminOrders(): Promise<Order[]> {
  return dedupeAsync(K.orders, () => api.fetchAdminOrders());
}
