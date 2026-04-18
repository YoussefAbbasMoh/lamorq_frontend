import { cache } from "react";
import type { Product } from "@/data/products";
import { fetchStoreProductById } from "@/lib/api";
import { mapApiProductToStoreProduct } from "@/lib/store-product-mapper";

/** Deduped server fetch for metadata + JSON-LD + page shell. */
export const getStoreProductForPage = cache(async (id: string): Promise<Product | null> => {
  try {
    const raw = await fetchStoreProductById(id);
    return mapApiProductToStoreProduct(raw as Record<string, unknown>);
  } catch {
    return null;
  }
});
