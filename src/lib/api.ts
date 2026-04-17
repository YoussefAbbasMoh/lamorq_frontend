import type { Order } from "@/app/admin/types";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function setStoredToken(token: string) {
  localStorage.setItem("admin_token", token);
}

export function clearStoredToken() {
  localStorage.removeItem("admin_token");
}

function messageText(body: { message?: { en?: string; ar?: string } | string }) {
  if (!body?.message) return "Request failed";
  if (typeof body.message === "string") return body.message;
  return body.message.en || body.message.ar || "Request failed";
}

/** Storefront & anonymous calls — never sends admin JWT. */
export async function publicApiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  return apiRequest<T>(path, options, false);
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  const headers = new Headers(options.headers);
  if (auth) {
    const token = getStoredToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.body && !(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = (await res.json().catch(() => ({}))) as T & {
    message?: { en?: string; ar?: string } | string;
  };

  if (!res.ok) {
    throw new Error(messageText(json));
  }

  return json as T;
}

export async function adminLogin(email: string, password: string) {
  const json = await apiRequest<{ token: string }>(
    "/api/admin/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    false
  );
  return json.token;
}

export async function fetchDefaultProducts() {
  const json = await apiRequest<{ data: Record<string, unknown>[] }>("/api/products");
  return json.data;
}

export async function fetchUpcomingProducts() {
  const json = await apiRequest<{ data: Record<string, unknown>[] }>("/api/upcoming-products");
  return json.data;
}

export async function createDefaultProduct(formData: FormData) {
  return apiRequest<{ data: Record<string, unknown> }>("/api/products", {
    method: "POST",
    body: formData,
  });
}

export async function updateDefaultProduct(id: string, formData: FormData) {
  return apiRequest<{ data: Record<string, unknown> }>(`/api/products/${id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deleteDefaultProduct(id: string) {
  return apiRequest(`/api/products/${id}`, { method: "DELETE" });
}

export async function createUpcomingProduct(formData: FormData) {
  return apiRequest<{ data: Record<string, unknown> }>("/api/upcoming-products", {
    method: "POST",
    body: formData,
  });
}

export async function updateUpcomingProduct(id: string, formData: FormData) {
  return apiRequest<{ data: Record<string, unknown> }>(`/api/upcoming-products/${id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deleteUpcomingProduct(id: string) {
  return apiRequest(`/api/upcoming-products/${id}`, { method: "DELETE" });
}

export async function fetchMessages() {
  const json = await apiRequest<{ data: Record<string, unknown>[] }>("/api/messages");
  return json.data;
}

export async function updateMessage(id: string, body: Record<string, unknown>) {
  return apiRequest(`/api/messages/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteMessage(id: string) {
  return apiRequest(`/api/messages/${id}`, { method: "DELETE" });
}

export async function fetchRatings() {
  const json = await apiRequest<{ data: Record<string, unknown>[] }>("/api/ratings");
  return json.data;
}

export async function createRating(body: { rating: number; name: string; content: string }) {
  return apiRequest<{ data: Record<string, unknown> }>("/api/ratings", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateRating(
  id: string,
  body: Partial<{ rating: number; name: string; content: string }>
) {
  return apiRequest<{ data: Record<string, unknown> }>(`/api/ratings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteRating(id: string) {
  return apiRequest(`/api/ratings/${id}`, { method: "DELETE" });
}

export type AdminDashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  activeUsers: number;
  activeUsersPeriodDays: number;
  recentOrders: Order[];
};

export async function fetchAdminDashboardStats() {
  const json = await apiRequest<{ data: AdminDashboardStats }>("/api/admin/dashboard-stats");
  return json.data;
}

export async function fetchAdminOrders() {
  const json = await apiRequest<{ data: Order[] }>("/api/admin/orders");
  return json.data;
}

/** Public endpoint: call once per storefront session to measure unique visitors. */
export async function recordSiteVisit(path: string = "/") {
  await publicApiRequest("/api/visits", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}

// ——— Storefront (public) ———

export async function fetchStoreProducts() {
  const json = await publicApiRequest<{ data: Record<string, unknown>[] }>("/api/products");
  return json.data;
}

export async function fetchStoreProductById(id: string) {
  const json = await publicApiRequest<{ data: Record<string, unknown> }>(`/api/products/${id}`);
  return json.data;
}

export async function fetchStoreUpcomingProducts() {
  const json = await publicApiRequest<{ data: Record<string, unknown>[] }>("/api/upcoming-products");
  return json.data;
}

export async function submitContactMessage(body: {
  fullName: string;
  phoneNumber: string;
  subject: string;
  message: string;
}) {
  return publicApiRequest<{ message: { en: string; ar: string }; data?: Record<string, unknown> }>(
    "/api/messages",
    { method: "POST", body: JSON.stringify(body) }
  );
}

export async function fetchStoreRatings() {
  const json = await publicApiRequest<{ data: Record<string, unknown>[] }>("/api/ratings");
  return json.data;
}

export async function createStoreRating(body: { rating: number; name: string; content: string }) {
  return publicApiRequest<{ message: { en: string; ar: string }; data: Record<string, unknown> }>(
    "/api/ratings",
    { method: "POST", body: JSON.stringify(body) }
  );
}
