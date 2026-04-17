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
import { fetchStoreProducts } from "@/lib/api";
import { mapApiProductToStoreProduct } from "@/lib/store-product-mapper";

const STORE_PRODUCTS_KEY = ["store", "products"] as const;

const AllProducts = () => {
  const { t, isAr } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const setCategoryQuery = useCallback(
    (category: string | null) => {
      const p = new URLSearchParams(searchParams.toString());
      if (!category || category === "all") {
        p.delete("category");
      } else {
        p.set("category", category);
      }
      const qs = p.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const { data: rawList = [], isLoading, isError, error } = useQuery({
    queryKey: STORE_PRODUCTS_KEY,
    queryFn: fetchStoreProducts,
    staleTime: 60_000,
  });

  const products = useMemo(() => rawList.map((p) => mapApiProductToStoreProduct(p)), [rawList]);

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

  useEffect(() => {
    setPage(1);
  }, [activeCategory, sortBy, rawList.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <PageTransition>
      <PageHeader
        title={t("Our Therapeutic Solutions", "حلولنا العلاجية")}
        subtitle={t(
          "Discover our curated collection of imported natural oils designed specifically for treating hair, skin, and joints.",
          "اكتشفي مجموعتنا المختارة من الزيوت الطبيعية المستوردة المصممة خصيصاً لعلاج الشعر، البشرة والمفاصل."
        )}
        breadcrumbs={[{ label: t("All Products", "جميع المنتجات") }]}
      />

      <div className="container mx-auto px-4 py-12 md:py-16">
        {isError && (
          <p className="text-center text-destructive py-12" role="alert">
            {error instanceof Error ? error.message : t("Failed to load products", "تعذر تحميل المنتجات")}
          </p>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap gap-3 mb-8 items-center justify-between"
        >
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCategoryQuery(null);
                setPage(1);
              }}
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
                onClick={() => {
                  setCategoryQuery(c.id);
                  setPage(1);
                }}
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
              onChange={(e) => setSortBy(e.target.value)}
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
                key={`${activeCategory}-${page}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {paginated.map((p) => (
                  <motion.div key={p.id} variants={staggerItem}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </StaggerContainer>
            </AnimatePresence>

            {!paginated.length && !isError && (
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
                    onClick={() => setPage(i + 1)}
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
