"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Leaf, Shield, Droplets, Heart, ChevronRight, Sparkles, Scissors, Truck, CreditCard, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerContainer, { staggerItem } from "@/components/StaggerContainer";
import { categories } from "@/data/products";
import { useLang } from "@/contexts/LanguageContext";
import { fetchStoreProducts, fetchStoreRatings, fetchStoreUpcomingProducts } from "@/lib/api";
import { mapApiProductToStoreProduct, mapApiUpcomingToStoreItem } from "@/lib/store-product-mapper";

const STORE_PRODUCTS_KEY = ["store", "products"] as const;
import heroProductImg from "@/assets/hero-product-bottle.png";
import beforeAfterImg from "@/assets/before-after.jpg";
import glowSerumImg from "@/assets/product-glow-serum.jpg";
import productJojobaImg from "@/assets/product-jojoba.jpg";
import productHairImg from "@/assets/product-hair-serum.jpg";
import categorySkinImg from "@/assets/category-skin.jpg";
import categoryHairImg from "@/assets/category-hair.jpg";
import categoryBodyImg from "@/assets/category-body.jpg";

const Home = () => {
  const { t, isAr } = useLang();
  const heroRef = useRef(null);

  const { data: rawProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: STORE_PRODUCTS_KEY,
    queryFn: fetchStoreProducts,
    staleTime: 60_000,
  });

  const { data: rawUpcoming = [] } = useQuery({
    queryKey: ["store", "upcoming"],
    queryFn: fetchStoreUpcomingProducts,
    staleTime: 120_000,
  });

  const {
    data: rawRatings = [],
    isLoading: ratingsLoading,
    isError: ratingsError,
    isSuccess: ratingsSuccess,
  } = useQuery({
    queryKey: ["store", "ratings"],
    queryFn: fetchStoreRatings,
    staleTime: 120_000,
  });

  const products = useMemo(() => rawProducts.map((p) => mapApiProductToStoreProduct(p)), [rawProducts]);
  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 4), [products]);
  const spotlightId = featured[0]?.id ?? products[0]?.id;

  const upcomingItems = useMemo(
    () => rawUpcoming.map((p) => mapApiUpcomingToStoreItem(p)).slice(0, 4),
    [rawUpcoming]
  );

  const reviews = useMemo(() => {
    if (!ratingsSuccess) return [];
    return rawRatings.slice(0, 6).map((r) => ({
      id: String(r._id ?? r.id ?? ""),
      name: String(r.name || "").trim(),
      text: String(r.content ?? r.context ?? "").trim(),
      rating: Math.min(5, Math.max(0, Math.round(Number(r.rating) || 0))),
    }));
  }, [rawRatings, ratingsSuccess]);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const values = [
    { icon: Leaf, title: t("100% Natural", "طبيعي 100%"), desc: t("No chemicals, no preservatives", "بدون كيماويات أو مواد حافظة") },
    { icon: Shield, title: t("Pure Imported Oils", "زيوت نقية مستوردة"), desc: t("Premium quality from trusted sources", "جودة فاخرة من مصادر موثوقة") },
    { icon: Droplets, title: t("Therapeutic Focus", "تركيز علاجي"), desc: t("Treatment, not just beauty", "علاج وليس مجرد جمال") },
    { icon: Heart, title: t("Made in Egypt", "صنع في مصر"), desc: t("Proudly crafted with Egyptian heritage", "صنع بفخر بالتراث المصري") },
  ];

  const iconMap: Record<string, React.ElementType> = { Sparkles, Scissors, Heart };

  return (
    <PageTransition>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs text-center py-2 px-4 tracking-wide">
        {t(
          "Free Shipping on Orders Above 1000 EGP | Nationwide Delivery | Cash on Delivery",
          "شحن مجاني للطلبات فوق 1000 ج.م | توصيل لجميع المحافظات | الدفع عند الاستلام"
        )}
      </div>

      {/* 1. Hero */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-[100px]" />
          <div className="absolute top-[20%] right-[25%] w-[300px] h-[300px] rounded-full bg-accent/[0.08] blur-[80px]" />
          <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-primary/[0.04] to-transparent" />
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[8%] w-20 h-20 rounded-full border border-primary/10"
          />
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[25%] left-[12%] w-12 h-12 rounded-full bg-accent/[0.06]"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute top-[30%] right-[8%] w-16 h-16 rounded-full border border-accent/10"
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-7 max-w-xl"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-primary/[0.07] border border-primary/15 rounded-full px-4 py-1.5"
              >
                <Leaf className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-medium tracking-wider uppercase">
                  {t("100% Natural Therapeutic Oils", "زيوت علاجية طبيعية 100%")}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-display font-bold text-foreground leading-[1.08] tracking-tight"
              >
                {t("Science-Backed", "علاج طبيعي")}
                <br />
                <span className="text-gradient-brand">{t("Natural Treatment", "مدعوم بالعلم")}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="text-[15px] md:text-base text-muted-foreground leading-relaxed max-w-md"
              >
                {t(
                  "Pure imported oils combined with potent actives for effective, safe treatment of skin, hair, and body",
                  "زيوت نقية مستوردة ممزوجة بمواد فعالة قوية لعلاج آمن وفعّال للبشرة والشعر والجسم"
                )}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center gap-6"
              >
                <Link href="/products">
                  <Button size="lg" className="gradient-brand text-primary-foreground hover:opacity-90 text-base px-10 py-6 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                    {t("Shop Now", "تسوق الآن")} <ArrowRight className="w-4 h-4 ms-1 rtl:-scale-x-100" />
                  </Button>
                </Link>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs">{t("500+ Happy Customers", "٥٠٠+ عميل سعيد")}</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[520px]">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-20 flex justify-center"
                >
                  <img
                    src={heroProductImg.src}
                    alt="LAMORQ Premium Natural Oil"
                    className="w-[260px] md:w-[300px] lg:w-[340px] h-auto drop-shadow-2xl"
                    width={800}
                    height={960}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -start-4 md:-start-8 top-[15%] z-30"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="bg-card/90 backdrop-blur-md border border-border/60 rounded-2xl p-2.5 shadow-xl shadow-primary/[0.08]"
                  >
                    <img src={productJojobaImg.src} alt="Jojoba Oil" className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover" />
                    <p className="text-[10px] font-medium text-foreground mt-1.5 text-center">{t("Jojoba Oil", "زيت الجوجوبا")}</p>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -end-4 md:-end-8 top-[8%] z-30"
                >
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="bg-card/90 backdrop-blur-md border border-border/60 rounded-2xl p-2.5 shadow-xl shadow-primary/[0.08]"
                  >
                    <img src={productHairImg.src} alt="Hair Serum" className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover" />
                    <p className="text-[10px] font-medium text-foreground mt-1.5 text-center">{t("Hair Serum", "سيروم الشعر")}</p>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -end-2 md:end-0 bottom-[5%] z-30"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="bg-card/90 backdrop-blur-md border border-border/60 rounded-2xl p-2.5 shadow-xl shadow-primary/[0.08]"
                  >
                    <img src={glowSerumImg.src} alt="Glow Serum" className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover" />
                    <p className="text-[10px] font-medium text-foreground mt-1.5 text-center">{t("Glow Serum", "سيروم التوهج")}</p>
                  </motion.div>
                </motion.div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[340px] h-[280px] md:h-[340px] rounded-full border border-primary/[0.08] z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] md:w-[420px] h-[360px] md:h-[420px] rounded-full border border-primary/[0.04] z-10" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 z-10 bg-card/60 backdrop-blur-sm border-t border-border/40"
        >
          <div className="container mx-auto px-4 py-3.5">
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5 text-primary/70" /> {t("Fast Shipping", "شحن سريع")}</span>
              <span className="flex items-center gap-2"><CreditCard className="w-3.5 h-3.5 text-primary/70" /> {t("Cash on Delivery", "دفع عند الاستلام")}</span>
              <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-primary/70" /> {t("Guaranteed Quality", "جودة مضمونة")}</span>
              <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary/70" /> {t("Nationwide Delivery", "توصيل لجميع المحافظات")}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Main Categories */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                {t("Main Categories", "الأقسام الرئيسية")}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                {t("Our Therapeutic Specialties", "تخصصاتنا العلاجية")}
              </h2>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "skin-care",
                name: t("Skin Care", "العناية بالبشرة"),
                desc: t("Natural solutions for brightening, deep hydration, and treating skin concerns.", "حلول طبيعية للتفتيح والترطيب العميق وعلاج العيوب."),
                image: categorySkinImg.src,
              },
              {
                id: "hair-care",
                name: t("Hair Treatment", "علاج الشعر"),
                desc: t("Repair damaged hair, stimulate follicles, and promote healthy growth.", "إصلاح الشعر التالف وتنشيط البصيلات وتعزيز النمو."),
                image: categoryHairImg.src,
              },
              {
                id: "body-care",
                name: t("Body & Joints", "الجسم والمفاصل"),
                desc: t("Therapeutic oils to soothe joint pain and promote total relaxation.", "زيوت علاجية لتسكين آلام المفاصل والراحة التامة."),
                image: categoryBodyImg.src,
              },
            ].map((cat) => (
              <motion.div key={cat.id} variants={staggerItem}>
                <Link
                  href={`/products?category=${cat.id}`}
                  className="group relative block rounded-2xl overflow-hidden h-[400px]"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    width={800}
                    height={1024}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-primary-foreground">
                    <h3 className="font-display text-xl font-bold mb-1">{cat.name}</h3>
                    <p className="text-sm text-primary-foreground/80 mb-4 leading-relaxed">{cat.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all">
                      {t("Discover More", "اكتشف المزيد")} <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  {t("Featured Products", "المنتجات المميزة")}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {t("Our bestselling therapeutic treatments", "علاجاتنا الأكثر مبيعاً")}
                </p>
              </div>
              <Link href="/products" className="text-sm font-medium text-primary hover:underline hidden md:block">
                {t("View All →", "عرض الكل →")}
              </Link>
            </div>
          </ScrollReveal>
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-muted/40 animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t("No featured products yet. Browse the full shop.", "لا توجد منتجات مميزة بعد. تصفحي المتجر الكامل.")}
            </p>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <motion.div key={p.id} variants={staggerItem}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* 4b. Upcoming products (API) */}
      {upcomingItems.length > 0 && (
        <section className="py-16 md:py-24 border-y border-border bg-muted/20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="mb-10 text-center max-w-2xl mx-auto">
                <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">
                  {t("Coming Soon", "قريباً")}
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                  {t("Upcoming Launches", "إصدارات قادمة")}
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">
                  {t("Stay tuned for new therapeutic formulas.", "ترقبوا تركيبات علاجية جديدة.")}
                </p>
              </div>
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingItems.map((u) => (
                <motion.div
                  key={u.id}
                  variants={staggerItem}
                  className="group rounded-2xl border border-border bg-card overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    <img
                      src={u.image || "/placeholder.svg"}
                      alt={isAr ? u.nameAr : u.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                      {t("Upcoming", "قريباً")}
                    </span>
                    <h3 className="font-display font-semibold text-foreground line-clamp-2">
                      {isAr ? u.nameAr : u.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {isAr ? u.teaserAr : u.teaserEn}
                    </p>
                    <Link
                      href="/upcoming"
                      className="text-xs font-medium text-primary hover:underline inline-block pt-1"
                    >
                      {t("View upcoming", "عرض القادم")} →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* 5. Why Choose LAMORQ */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="space-y-6">
                <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary-foreground bg-primary px-4 py-1.5 rounded-full">
                  {t("Why Choose LAMORQ", "لماذا تختارين لاموركيو")}
                </span>

                <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-foreground leading-[1.15]">
                  {t("Healing That ", "الشفاء الذي ")}
                  <span className="text-gradient-brand">{t("Nature", "تمنحه")}</span>
                  <br />
                  {t("Provides", "الطبيعة")}
                </h2>

                <p className="text-muted-foreground leading-relaxed max-w-lg text-[15px]">
                  {t(
                    "Since our launch in 2024, we've had one goal: delivering the safest and most effective natural therapeutic alternative. We don't just sell oils — we offer treatment protocols drawn from the heart of nature with advanced manufacturing technology.",
                    "منذ انطلاقنا في عام ٢٠٢٤، وضعنا نصب أعيننا هدفاً واحداً: تقديم البديل الطبيعي العلاجي الأكثر أماناً وفعالية. نحن لا نبيع مجرد زيوت تجميلية، بل نقدم بروتوكولات علاجية مستخلصة من قلب الطبيعة بتكنولوجيا تصنيع متطورة."
                  )}
                </p>

                <ul className="space-y-3">
                  {[
                    t("Full transparency in ingredients", "شفافية كاملة في ذكر المكونات"),
                    t("No artificial fragrances or colors", "لا نستخدم عطوراً اصطناعية أو ألواناً"),
                    t("Delivery coverage to all Egyptian governorates", "تغطية توصيل لجميع محافظات مصر"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href="/about">
                  <Button size="lg" className="gradient-brand text-primary-foreground hover:opacity-90 px-8 mt-2 rounded-lg">
                    {t("Learn More About Us", "اعرفي المزيد عنا")}
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-2 gap-4">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  className="bg-card p-6 rounded-2xl border border-border space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <v.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-base text-card-foreground">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* 6. Glow Serum / Before & After */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-8">
              <span className="text-sm font-medium text-primary tracking-widest uppercase">
                {t("Real Results", "نتائج حقيقية")}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                {t("Glow Serum", "سيروم التوهج")}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Before & After Image */}
            <ScrollReveal direction="left">
              <div className="relative rounded-2xl overflow-hidden shadow-lg h-full">
                <img
                  src={beforeAfterImg.src}
                  alt={t("Before and after using Glow Serum", "قبل وبعد استخدام سيروم التوهج")}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 inset-x-0 flex">
                  <span className="flex-1 text-center py-2 bg-foreground/70 text-background text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                    {t("Before", "قبل")}
                  </span>
                  <span className="flex-1 text-center py-2 bg-primary/80 text-primary-foreground text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                    {t("After", "بعد")}
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Product + CTA */}
            <ScrollReveal direction="right">
              <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-card rounded-2xl border border-border p-4 shadow-lg w-full max-w-[280px]"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                    <img
                      src={glowSerumImg.src}
                      alt={t("Glow Serum product", "منتج سيروم التوهج")}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </motion.div>

                <div className="space-y-3 max-w-sm">
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {t("Glow Serum", "سيروم التوهج")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(
                      "Reveal radiant, clear skin with our premium glow serum. Clinically visible results in just 2 weeks.",
                      "اكشف عن بشرة مشرقة وصافية مع سيروم التوهج الفاخر. نتائج مرئية سريرياً في أسبوعين فقط."
                    )}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-lg font-bold text-primary">
                      {t("380 EGP", "380 ج.م")}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {t("480 EGP", "480 ج.م")}
                    </span>
                  </div>
                  <Link href={spotlightId ? `/products/${spotlightId}` : "/products"}>
                    <Button className="gradient-brand text-primary-foreground hover:opacity-90 mt-3 px-8">
                      {t("Buy Now", "اشتري الآن")} <ChevronRight className="w-4 h-4 ms-1 rtl:-scale-x-100" />
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. Reviews — GET /api/ratings */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              {t("What Our Customers Say", "ماذا يقول عملاؤنا")}
            </h2>
          </ScrollReveal>
          {ratingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-card p-8 rounded-xl border border-border space-y-4 animate-pulse"
                >
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-16 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : ratingsError ? (
            <p className="text-center text-sm text-muted-foreground max-w-md mx-auto">
              {t(
                "We couldn't load reviews right now. Please try again later.",
                "تعذر تحميل التقييمات حالياً. يرجى المحاولة لاحقاً."
              )}
            </p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground max-w-md mx-auto">
              {t(
                "No reviews yet — be the first to share your experience.",
                "لا توجد تقييمات بعد — كن أول من يشارك تجربته."
              )}
            </p>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id || `review-${i}`}
                  variants={staggerItem}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="bg-card p-8 rounded-xl border border-border space-y-4"
                >
                  <div className="flex gap-1">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{r.text}"</p>
                  <p className="font-semibold text-sm text-card-foreground">— {r.name}</p>
                </motion.div>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Trust Features Bar */}
      <section className="py-8 border-y border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {[
              { icon: Truck, label: t("Delivery to All Egyptian Governorates", "توصيل لجميع محافظات مصر") },
              { icon: Shield, label: t("Purity & Global Import Guarantee", "ضمان نقاء واستيراد عالمي") },
              { icon: Heart, label: t("Proudly Made in Egypt", "صناعة مصرية فخورة") },
              { icon: Sparkles, label: t("Transparent Replacement Policy", "سياسة استبدال شفافة") },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <item.icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;
