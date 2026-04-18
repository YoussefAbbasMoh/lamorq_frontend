"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronUp, ChevronDown, Info, Banknote, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LanguageContext";

function CheckoutInputField({
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors ${className}`}
    />
  );
}

const Checkout = () => {
  const {
    items,
    subtotal,
    clearCart,
    shipping,
    total,
    shippingRegions,
    selectedShippingRegionId,
    setSelectedShippingRegionId,
  } = useCart();
  const { t, isAr } = useLang();
  const [form, setForm] = useState({
    firstName: "", lastName: "", address: "", apartment: "",
    city: "", postalCode: "", phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "wallet">("cod");
  const [saveInfo, setSaveInfo] = useState(false);
  const [smsOffers, setSmsOffers] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const selectedRegion = shippingRegions.find((r) => String(r._id) === selectedShippingRegionId);
  const governorateLabel = selectedRegion
    ? isAr
      ? selectedRegion.government_ar
      : selectedRegion.government_en
    : "";

  const handleField = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  if (items.length === 0 && !confirmed) {
    return (
      <div className="container mx-auto px-page py-16 md:py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("No items in cart", "لا توجد عناصر في السلة")}</h1>
        <Link href="/products" className="text-primary hover:underline mt-4 inline-block">{t("Shop Now", "تسوق الآن")}</Link>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="container mx-auto px-page py-16 md:py-24 max-w-lg text-center space-y-8">
        <div className="w-20 h-20 gradient-brand rounded-full flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="font-display text-3xl font-bold text-foreground">{t("Order Confirmed!", "تم تأكيد الطلب!")}</h2>
        <p className="text-muted-foreground">
          {t(
            "Thank you for your order! You will receive a confirmation SMS shortly. Your LAMORQ products are on their way.",
            "شكراً لطلبك! هتوصلك رسالة تأكيد قريباً. منتجات لامورك في الطريق."
          )}
        </p>
        <div className="bg-muted p-4 rounded-lg text-sm">
          <p className="font-medium text-foreground">{t("Order #LMQ-2026-001", "رقم الطلب: LMQ-2026-001")}</p>
          <p className="text-muted-foreground mt-1">{t("Estimated delivery: 2-4 business days", "التوصيل المتوقع: 2-4 أيام عمل")}</p>
        </div>
        <Link href="/products">
          <Button className="gradient-brand text-primary-foreground hover:opacity-90">{t("Continue Shopping", "متابعة التسوق")}</Button>
        </Link>
      </div>
    );
  }

  const paymentOptions = [
    {
      id: "cod" as const,
      icon: Banknote,
      title: t("Cash on Delivery", "الدفع عند الاستلام"),
      desc: t("Pay cash to the delivery agent upon direct delivery of the order", "ادفع نقداً لمندوب التوصيل عند استلام الطلب مباشرة"),
    },
    {
      id: "card" as const,
      icon: CreditCard,
      title: t("Bank Cards", "البطاقات البنكية"),
      desc: t("Pay using Visa / Mastercard", "ادفع باستخدام فيزا / ماستركارد"),
    },
    {
      id: "wallet" as const,
      icon: Smartphone,
      title: t("Mobile Wallet", "المحفظة الإلكترونية"),
      desc: t("Pay using Vodafone Cash wallet", "ادفع باستخدام محفظة فودافون كاش"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px]">
        {/* Left - Form */}
        <div className="px-6 md:px-12 lg:px-16 py-12 space-y-8">
          {/* Contact */}
          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">{t("Contact", "التواصل")}</h2>
            <div className="relative">
              <CheckoutInputField
                placeholder={t("Phone number", "رقم الهاتف")}
                value={form.phone}
                onChange={(v) => handleField("phone", v)}
                type="tel"
              />
              <Info className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={smsOffers} onChange={(e) => setSmsOffers(e.target.checked)} className="w-4 h-4 rounded border-border accent-primary" />
              <span className="text-sm text-muted-foreground">{t("Text me with news and offers", "أرسل لي رسائل نصية بالأخبار والعروض")}</span>
            </label>
          </section>

          {/* Delivery */}
          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">{t("Delivery", "التوصيل")}</h2>
            <p className="text-sm text-muted-foreground">{t("This will also be used as your billing address for this order.", "سيتم استخدام هذا كعنوان الفواتير لهذا الطلب.")}</p>

            {/* Country */}
            <div className="relative">
              <label className="absolute top-2 start-4 text-xs text-muted-foreground">{t("Country/Region", "الدولة/المنطقة")}</label>
              <select
                className="w-full px-4 pt-7 pb-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 appearance-none cursor-pointer transition-colors"
                defaultValue="Egypt"
              >
                <option>{t("Egypt", "مصر")}</option>
              </select>
              <ChevronDown className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <CheckoutInputField placeholder={t("First name", "الاسم الأول")} value={form.firstName} onChange={(v) => handleField("firstName", v)} />
              <CheckoutInputField placeholder={t("Last name", "الاسم الأخير")} value={form.lastName} onChange={(v) => handleField("lastName", v)} />
            </div>

            <CheckoutInputField placeholder={t("Address", "العنوان")} value={form.address} onChange={(v) => handleField("address", v)} />
            <CheckoutInputField placeholder={t("Apartment, suite, etc. (optional)", "شقة، جناح، إلخ (اختياري)")} value={form.apartment} onChange={(v) => handleField("apartment", v)} />

            {/* City / Governorate / Postal */}
            <div className="grid grid-cols-3 gap-3">
              <CheckoutInputField placeholder={t("City", "المدينة")} value={form.city} onChange={(v) => handleField("city", v)} />
              <div className="relative">
                <label className="absolute top-2 start-4 text-xs text-muted-foreground">{t("Governorate", "المحافظة")}</label>
                <select
                  value={selectedShippingRegionId || ""}
                  onChange={(e) => setSelectedShippingRegionId(e.target.value)}
                  disabled={shippingRegions.length === 0}
                  className="w-full px-4 pt-7 pb-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 appearance-none cursor-pointer transition-colors disabled:opacity-60"
                >
                  {shippingRegions.length === 0 ? (
                    <option value="">{t("Loading regions…", "جاري تحميل المحافظات…")}</option>
                  ) : (
                    shippingRegions.map((g) => (
                      <option key={g._id} value={String(g._id)}>
                        {isAr ? g.government_ar : g.government_en}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              <CheckoutInputField placeholder={t("Postal code (optional)", "الرمز البريدي (اختياري)")} value={form.postalCode} onChange={(v) => handleField("postalCode", v)} />
            </div>

            {/* Checkboxes */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} className="w-4 h-4 rounded border-border accent-primary" />
              <span className="text-sm text-muted-foreground">{t("Save this information for next time", "احفظ هذه المعلومات للمرة القادمة")}</span>
            </label>
          </section>

          {/* Payment */}
          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">{t("Payment", "الدفع")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("All transactions are secure and encrypted.", "جميع المعاملات آمنة ومشفرة.")}
            </p>
            <div className="border border-border rounded-lg overflow-hidden">
              {paymentOptions.map((opt, idx) => (
                <button
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`w-full flex items-start gap-3 p-4 text-sm transition-colors text-start ${
                    paymentMethod === opt.id ? "bg-primary/5" : ""
                  } ${idx < paymentOptions.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${paymentMethod === opt.id ? "border-primary" : "border-border"}`}>
                    {paymentMethod === opt.id && <div className="w-2.5 h-2.5 rounded-full gradient-brand" />}
                  </div>
                  <opt.icon className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{opt.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Complete Order */}
          <Button
            className="gradient-brand text-primary-foreground hover:opacity-90 w-full py-6 text-base font-semibold"
            onClick={() => { setConfirmed(true); clearCart(); }}
          >
            {t("Complete order", "إتمام الطلب")}
          </Button>
        </div>

        {/* Right - Order Summary */}
        <div className="bg-muted/40 border-s border-border px-6 md:px-8 py-12 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          {/* Items */}
          <div className="space-y-4">
            {items.length > 0 && (
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-lg border border-border overflow-hidden bg-card flex-shrink-0">
                  <img src={items[0].product.image} alt="" className="w-full h-full object-cover" />
                  <span className="absolute -top-1.5 -end-1.5 w-5 h-5 gradient-brand rounded-full text-[10px] text-primary-foreground font-bold flex items-center justify-center">
                    {items.reduce((a, i) => a + i.quantity, 0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {items.map((i) => `${i.quantity} ${isAr ? i.product.nameAr : i.product.name}`).join(" + ")}
                  </p>
                  <button
                    onClick={() => setShowItems(!showItems)}
                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                  >
                    {showItems ? t("Hide", "إخفاء") : t("Show", "عرض")} {items.length} {t("items", "عناصر")}
                    {showItems ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  {t(`E£${subtotal.toLocaleString()}`, `${subtotal.toLocaleString()} ج.م`)}
                </span>
              </div>
            )}

            {showItems && (
              <div className="space-y-3 ps-6 border-s border-border ms-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-border overflow-hidden bg-card flex-shrink-0">
                      <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm text-muted-foreground flex-1 truncate">
                      {item.quantity} × {isAr ? item.product.nameAr : item.product.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("Subtotal", "المجموع الفرعي")}</span>
              <span className="text-foreground">{t(`E£${subtotal.toLocaleString()}`, `${subtotal.toLocaleString()} ج.م`)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("Shipping", "الشحن")}</span>
              <div className="text-end">
                <span className="text-foreground">
                  {t(`E£${shipping.toLocaleString()}`, `${shipping.toLocaleString()} ج.م`)}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {governorateLabel
                    ? t(`Governorate: ${governorateLabel}`, `المحافظة: ${governorateLabel}`)
                    : "—"}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-border">
              <span className="text-base font-bold text-foreground">{t("Total", "الإجمالي")}</span>
              <div className="text-end">
                <span className="text-xs text-muted-foreground me-2">{t("EGP", "ج.م")}</span>
                <span className="text-xl font-bold text-foreground">{t(`E£${total.toLocaleString()}`, `${total.toLocaleString()} ج.م`)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
