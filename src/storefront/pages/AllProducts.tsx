"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import PageTransition from "@/components/PageTransition";
import PageHeader from "@/components/PageHeader";
import StaggerContainer, { staggerItem } from "@/components/StaggerContainer";
import { categories } from "@/data/products";
import { useLang } from "@/contexts/LanguageContext";
import UpcomingShopRows from "@/components/UpcomingShopRows";
import { fetchStoreProducts, fetchStoreUpcomingProducts } from "@/lib/api";
import { mapApiProductToStoreProduct, mapApiUpcomingToStoreItem } from "@/lib/store-product-mapper";

const STORE_PRODUCTS_KEY = ["store", "products"] as const;

const SORT_VALUES = ["featured", "price-low", "price-high", "rating"] as const;
type SortValue = (typeof SORT_VALUES)[number];

const CATEGORY_IDS = new Set(categories.map((c) => c.id));

function parseSortParam(s: string | null): SortValue {
  if (s && SORT_VALUES.includes(s as SortValue)) return s as SortValue;
  return "featured";
}

function parsePageParam(s: string | null): number {
  const n = parseInt(s || "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

/** Drop default query keys so `/products` stays clean when only defaults apply. */
function finalizeListParams(p: URLSearchParams) {
  const sort = p.get("sort");
  if (!sort || sort === "featured") p.delete("sort");
  const pg = p.get("page");
  if (!pg || pg === "1") p.delete("page");
  const cat = p.get("category");
  if (!cat) p.delete("category");
}

const AllProducts = () => {
  const { t, isAr } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawCategory = searchParams.get("category");
  const activeCategory =
    rawCategory && CATEGORY_IDS.has(rawCategory) ? rawCategory : "all";

  const sortBy = parseSortParam(searchParams.get("sort"));
  const pageFromUrl = parsePageParam(searchParams.get("page"));

  const updateSearchParams = useCallback(
    (mutate: (p: URLSearchParams) => void, mode: "push" | "replace" = "push") => {
      const p = new URLSearchParams(searchParams.toString());
      mutate(p);
      finalizeListParams(p);
      const qs = p.toString();
      const nav = mode === "replace" ? router.replace : router.push;
      nav(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  /** Remove unknown `category` from the URL (e.g. typos or old slugs). */
  useEffect(() => {
    const raw = searchParams.get("category");
    if (raw && !CATEGORY_IDS.has(raw)) {
      updateSearchParams((p) => p.delete("category"), "replace");
    }
  }, [searchParams, updateSearchParams]);

  const setCategoryQuery = useCallback(
    (categoryId: string | null) => {
      updateSearchParams((p) => {
        if (!categoryId || categoryId === "all") {
          p.delete("category");
        } else {
          p.set("category", categoryId);
        }
        p.delete("page");
      });
    },
    [updateSearchParams]
  );

  const setSortQuery = useCallback(
    (value: SortValue) => {
      updateSearchParams((p) => {
        if (value === "featured") p.delete("sort");
        else p.set("sort", value);
        p.delete("page");
      });
    },
    [updateSearchParams]
  );

  const setPageQuery = useCallback(
    (n: number) => {
      updateSearchParams((p) => {
        if (n <= 1) p.delete("page");
        else p.set("page", String(n));
      });
    },
    [updateSearchParams]
  );

  const perPage = 8;

  const { data: rawList = [], isLoading, isError, error } = useQuery({
    queryKey: STORE_PRODUCTS_KEY,
    queryFn: fetchStoreProducts,
    staleTime: 60_000,
  });

  const { data: rawUpcoming = [] } = useQuery({
    queryKey: ["store", "upcoming"],
    queryFn: fetchStoreUpcomingProducts,
    staleTime: 120_000,
  });

  const products = useMemo(() => rawList.map((p) => mapApiProductToStoreProduct(p)), [rawList]);

  const upcomingInCategory = useMemo(() => {
    if (activeCategory === "all") return [];
    return rawUpcoming
      .map((p) => mapApiUpcomingToStoreItem(p))
      .filter((u) => u.categorySlug === activeCategory);
  }, [activeCategory, rawUpcoming]);

  const filtered = useMemo(() => {
    let result =
      activeCategory === "all" ? [...products] : products.filter((p) => p.category === activeCategory);
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [activeCategory, sortBy, products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(pageFromUrl, totalPages);

  /** If URL page is past the last page (e.g. fewer products after filter), clamp in the address bar. */
  useEffect(() => {
    if (pageFromUrl !== page) {
      updateSearchParams(
        (p) => {
          if (page <= 1) p.delete("page");
          else p.set("page", String(page));
        },
        "replace"
      );
    }
  }, [pageFromUrl, page, updateSearchParams]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const showEmptyGridMessage =
    !filtered.length && !(activeCategory !== "all" && upcomingInCategory.length > 0);

  return (
    <PageTransition>
      <PageHeader
        title={t("Shop skincare & care", "تسوقي العناية")}
        subtitle={t(
          "Browse gentle, effective formulas for skin, hair, and body — made to support a healthy-looking glow.",
          "تصفّحي تركيبات لطيفة وفعّالة للبشرة والشعر والجسم — عشان إشراقة وصحة في المظهر."
        )}
        breadcrumbs={[{ label: t("All Products", "جميع المنتجات") }]}
      />

      <div className="container mx-auto px-page pt-12 md:pt-16 pb-4">
        {isError && (
          <p className="text-center text-destructive py-12" role="alert">
            {error instanceof Error ? error.message : t("Failed to load products", "تعذر تحميل المنتجات")}
          </p>
        )}

        {/* Filters — category + sort are reflected in the URL for refresh/share */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap gap-3 items-center justify-between"
        >
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoryQuery(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "gradient-brand text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              {t("All", "الكل")}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryQuery(c.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === c.id
                    ? "gradient-brand text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                {isAr ? c.nameAr : c.name}
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortQuery(parseSortParam(e.target.value))}
              className="appearance-none bg-card border border-border rounded-lg px-4 py-2 pe-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="featured">{t("Featured", "المميزة")}</option>
              <option value="price-low">{t("Price: Low to High", "السعر: الأقل")}</option>
              <option value="price-high">{t("Price: High to Low", "السعر: الأعلى")}</option>
              <option value="rating">{t("Top Rated", "الأعلى تقييماً")}</option>
            </select>
            <ChevronDown className="absolute end-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {activeCategory !== "all" && <UpcomingShopRows items={upcomingInCategory} />}

      <div className="container mx-auto px-page pb-12 md:pb-16 pt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-muted/40 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <StaggerContainer
                key={`${activeCategory}-${sortBy}-${page}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {paginated.map((p) => (
                  <motion.div key={p.id} variants={staggerItem}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </StaggerContainer>
            </AnimatePresence>

            {showEmptyGridMessage && !isError && (
              <p className="text-center text-muted-foreground py-16">
                {t("No products match these filters.", "لا توجد منتجات مطابقة لهذه الفلاتر.")}
              </p>
            )}

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center gap-2 mt-12"
              >
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setPageQuery(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      page === i + 1
                        ? "gradient-brand text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default AllProducts;
