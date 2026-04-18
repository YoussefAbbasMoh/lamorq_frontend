"use client";

import Link from "next/link";
import { Minus, Plus, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LanguageContext";

const Cart = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
    shippingRegions,
    shippingRegionsLoading,
    selectedShippingRegionId,
    setSelectedShippingRegionId,
  } = useCart();
  const { t, isAr } = useLang();

  const priceRange =
    shippingRegions.length > 0
      ? {
          min: Math.min(...shippingRegions.map((r) => r.price)),
          max: Math.max(...shippingRegions.map((r) => r.price)),
        }
      : null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-page py-16 md:py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">{t("Your Cart is Empty", "سلتك فارغة")}</h1>
        <p className="text-muted-foreground mb-8">{t("Start exploring the shop.", "ابدأي تتسوّقي من المتجر.")}</p>
        <Link href="/products">
          <Button className="gradient-brand text-primary-foreground">{t("Shop Now", "تسوق الآن")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-page py-12 md:py-16">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">{t("Shopping Cart", "سلة التسوق")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 bg-card p-4 rounded-xl border border-border">
              <img src={item.product.image} alt={isAr ? item.product.nameAr : item.product.name} className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <Link href={`/products/${item.product.id}`} className="font-semibold text-card-foreground hover:text-primary line-clamp-1">
                    {isAr ? item.product.nameAr : item.product.name}
                  </Link>
                  <button type="button" onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{item.product.price} {t("EGP", "ج.م")}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-border rounded-lg">
                    <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-muted"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-muted"><Plus className="w-3 h-3" /></button>
                  </div>
                  <span className="font-semibold text-foreground">{item.product.price * item.quantity} {t("EGP", "ج.م")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card p-6 rounded-xl border border-border h-fit sticky top-24 space-y-4">
          <h2 className="font-display text-xl font-semibold text-card-foreground">{t("Order Summary", "ملخص الطلب")}</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("Subtotal", "المجموع الفرعي")}</span>
              <span>{subtotal} {t("EGP", "ج.م")}</span>
            </div>

            <div className="space-y-2">
              <label htmlFor="cart-governorate" className="text-xs font-medium text-muted-foreground block">
                {t("Governorate (delivery)", "المحافظة (التوصيل)")}
              </label>
              <div className="relative">
                <select
                  id="cart-governorate"
                  value={selectedShippingRegionId || ""}
                  onChange={(e) => setSelectedShippingRegionId(e.target.value)}
                  disabled={shippingRegionsLoading || shippingRegions.length === 0}
                  className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pe-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:opacity-60"
                >
                  {shippingRegionsLoading ? (
                    <option value="">{t("Loading…", "جاري التحميل…")}</option>
                  ) : shippingRegions.length === 0 ? (
                    <option value="">{t("No rates available", "لا توجد أسعار")}</option>
                  ) : (
                    shippingRegions.map((r) => (
                      <option key={r._id} value={String(r._id)}>
                        {isAr ? r.government_ar : r.government_en} — {r.price} {t("EGP", "ج.م")}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="flex justify-between items-baseline gap-2 pt-1">
              <span className="text-muted-foreground">{t("Shipping", "الشحن")}</span>
              <span className="font-medium text-foreground">
                {shippingRegionsLoading ? "—" : `${shipping} ${t("EGP", "ج.م")}`}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground leading-snug">
              {priceRange
                ? t(
                    `Rates for Egypt range from ${priceRange.min}–${priceRange.max} EGP by governorate. Your checkout will use the same governorate.`,
                    `أسعار التوصيل في مصر من ${priceRange.min}–${priceRange.max} ج.م حسب المحافظة. إتمام الطلب يستخدم نفس المحافظة.`
                  )
                : t("Select your governorate to see the delivery fee.", "اختاري محافظتك لعرض رسوم التوصيل.")}
            </p>
          </div>

          <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
            <span>{t("Total", "الإجمالي")}</span>
            <span>
              {total} {t("EGP", "ج.م")}
            </span>
          </div>
          <Link href="/checkout" className="block">
            <Button className="w-full gradient-brand text-primary-foreground hover:opacity-90">{t("Proceed to Checkout", "المتابعة للدفع")}</Button>
          </Link>
          <Link href="/products" className="block text-center text-sm text-primary hover:underline">
            {t("Continue Shopping", "متابعة التسوق")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
