"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/data/products";
import { fetchShippingRegions, type ShippingRegion } from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = "lamorq_cart_v1";
const SHIPPING_REGION_STORAGE_KEY = "lamorq_shipping_region_id";

function isCartItemRow(x: unknown): x is CartItem {
  if (!x || typeof x !== "object") return false;
  const rec = x as Record<string, unknown>;
  if (typeof rec.quantity !== "number" || rec.quantity < 1 || !Number.isFinite(rec.quantity)) return false;
  const prod = rec.product;
  if (!prod || typeof prod !== "object") return false;
  const p = prod as Record<string, unknown>;
  if (typeof p.id !== "string" || p.id.length === 0) return false;
  if (typeof p.price !== "number" || !Number.isFinite(p.price)) return false;
  return true;
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItemRow).map((row) => ({
      product: row.product as Product,
      quantity: Math.floor(row.quantity),
    }));
  } catch {
    return [];
  }
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  shippingRegions: ShippingRegion[];
  shippingRegionsLoading: boolean;
  selectedShippingRegionId: string | null;
  setSelectedShippingRegionId: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [selectedShippingRegionId, setSelectedShippingRegionId] = useState<string | null>(null);
  const [regionHydrated, setRegionHydrated] = useState(false);

  const { data: shippingRegions = [], isLoading: shippingRegionsLoading } = useQuery({
    queryKey: ["shippingRegions"],
    queryFn: fetchShippingRegions,
    staleTime: 60_000,
  });

  useEffect(() => {
    setItems(loadCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = localStorage.getItem(SHIPPING_REGION_STORAGE_KEY);
    setSelectedShippingRegionId(id);
    setRegionHydrated(true);
  }, []);

  const activeShippingRegionId = useMemo(() => {
    if (!shippingRegions.length) return null;
    if (
      selectedShippingRegionId &&
      shippingRegions.some((r) => String(r._id) === selectedShippingRegionId)
    ) {
      return selectedShippingRegionId;
    }
    return String(shippingRegions[0]._id);
  }, [shippingRegions, selectedShippingRegionId]);

  useEffect(() => {
    if (!regionHydrated || !activeShippingRegionId) return;
    if (selectedShippingRegionId !== activeShippingRegionId) {
      setSelectedShippingRegionId(activeShippingRegionId);
    }
  }, [regionHydrated, activeShippingRegionId, selectedShippingRegionId]);

  useEffect(() => {
    if (!regionHydrated || typeof window === "undefined" || !activeShippingRegionId) return;
    localStorage.setItem(SHIPPING_REGION_STORAGE_KEY, activeShippingRegionId);
  }, [activeShippingRegionId, regionHydrated]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      if (items.length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      /* storage full or disabled */
    }
  }, [items, hydrated]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  const selectedRegion = activeShippingRegionId
    ? shippingRegions.find((r) => String(r._id) === activeShippingRegionId)
    : undefined;
  const shipping = selectedRegion?.price ?? 0;
  const total = subtotal + shipping;

  const setSelectedShippingRegionIdCb = useCallback((id: string) => {
    setSelectedShippingRegionId(id);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        total,
        shippingRegions,
        shippingRegionsLoading,
        selectedShippingRegionId: activeShippingRegionId,
        setSelectedShippingRegionId: setSelectedShippingRegionIdCb,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
