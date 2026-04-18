"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Star, Minus, Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LanguageContext";
import { fetchStoreProductById, fetchStoreProducts } from "@/lib/api";
import { mapApiProductToStoreProduct } from "@/lib/store-product-mapper";

const STORE_PRODUCTS_KEY = ["store", "products"] as const;

const ProductDetails = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";
  const { addToCart } = useCart();
  const { t, isAr } = useLang();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);

  const {
    data: rawDetail,
    isLoading: detailLoading,
    isError: detailError,
    error: detailErr,
  } = useQuery({
    queryKey: ["store", "product", id],
    queryFn: () => fetchStoreProductById(id),
    enabled: !!id,
    staleTime: 60_000,
  });

  const { data: rawList = [] } = useQuery({
    queryKey: STORE_PRODUCTS_KEY,
    queryFn: fetchStoreProducts,
    staleTime: 60_000,
  });

  const product = useMemo(
    () => (rawDetail ? mapApiProductToStoreProduct(rawDetail as Record<string, unknown>) : null),
    [rawDetail]
  );

  const related = useMemo(() => {
    if (!product) return [];
    return rawList
      .map((p) => mapApiProductToStoreProduct(p))
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [rawList, product]);

  const galleryImages =
    product && product.images.length > 0 ? product.images : product?.image ? [product.image] : [];

  if (detailLoading) {
    return (
      <div className="container mx-auto px-page py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square rounded-xl bg-muted" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-12 bg-muted rounded w-2/3" />
            <div className="h-24 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (detailError || !product) {
    return (
      <div className="container mx-auto px-page py-16 md:py-24 text-center">
        <h1 className="font-display text-2xl">{t("Product not found", "المنتج غير موجود")}</h1>
        {detailErr instanceof Error && (
          <p className="text-sm text-muted-foreground mt-2">{detailErr.message}</p>
        )}
        <Link href="/products" className="text-primary hover:underline mt-4 inline-block">
          {t("Back to Shop", "العودة للمتجر")}
        </Link>
      </div>
    );
  }

  const tabs = [
    { key: "description", label: t("Description", "الوصف"), content: isAr ? product.descriptionAr : product.description },
    { key: "ingredients", label: t("Ingredients", "المكونات"), content: isAr ? product.ingredientsAr : product.ingredients },
    { key: "benefits", label: t("Benefits", "الفوائد"), content: isAr ? product.benefitsAr : product.benefits },
    { key: "howToUse", label: t("How to Use", "طريقة الاستخدام"), content: isAr ? product.howToUseAr : product.howToUse },
  ];

  const categoryLabel = isAr
    ? product.categoryAr
    : product.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="container mx-auto px-page py-12 md:py-16">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ChevronLeft className="w-4 h-4 me-1 rtl:rotate-180" /> {t("Back to Shop", "العودة للمتجر")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border">
            <img
              src={galleryImages[activeImage] || "/placeholder.svg"}
              alt={isAr ? product.nameAr : product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="flex gap-3">
              {galleryImages.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i ? "border-primary" : "border-border"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${isAr ? product.nameAr : product.name} — photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-primary font-medium uppercase tracking-wider">{categoryLabel}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1">
              {isAr ? product.nameAr : product.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews} {t("reviews", "تقييم")})
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              {product.price} {t("EGP", "ج.م")}
            </span>
            {product.originalPrice != null && product.originalPrice > 0 && (
              <span className="text-lg text-muted-foreground line-through">
                {product.originalPrice} {t("EGP", "ج.م")}
              </span>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {product.purity ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium gradient-brand text-primary-foreground">
                {product.purity}
              </span>
            ) : null}
            {product.vitamins.map((v) => (
              <span key={v} className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {v}
              </span>
            ))}
          </div>

          <p className="text-muted-foreground leading-relaxed">{isAr ? product.shortDescAr : product.shortDesc}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border rounded-lg">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-muted transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 font-medium text-foreground">{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)} className="p-3 hover:bg-muted transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="gradient-brand text-primary-foreground hover:opacity-90 flex-1"
              onClick={() => addToCart(product, qty)}
            >
              {t("Add to Cart", "أضف للسلة")}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="py-8 text-muted-foreground leading-relaxed max-w-3xl whitespace-pre-line">
          {tabs.find((x) => x.key === activeTab)?.content}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12 md:mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">
            {t("Related Products", "منتجات ذات صلة")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
