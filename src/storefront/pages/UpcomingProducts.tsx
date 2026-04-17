"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";
import { fetchStoreUpcomingProducts } from "@/lib/api";
import { mapApiUpcomingToStoreItem, type StoreUpcomingItem } from "@/lib/store-product-mapper";
import beforeAfterImg from "@/assets/before-after.jpg";
import productHairImg from "@/assets/product-hair-serum.jpg";
import glowSerumImg from "@/assets/product-glow-serum.jpg";

type StaticSection = {
  title: string;
  description: string;
  image: typeof beforeAfterImg;
  bg: string;
};

const UPCOMING_QUERY_KEY = ["store", "upcoming"] as const;

const UpcomingProducts = () => {
  const { t, isAr } = useLang();

  const { data: rawUpcoming = [], isLoading } = useQuery({
    queryKey: UPCOMING_QUERY_KEY,
    queryFn: fetchStoreUpcomingProducts,
    staleTime: 120_000,
  });

  const fromApi: StoreUpcomingItem[] = useMemo(
    () => rawUpcoming.map((p) => mapApiUpcomingToStoreItem(p)),
    [rawUpcoming]
  );

  const staticSections: StaticSection[] = useMemo(
    () => [
      {
        title: t("Hair Loss Treatment", "علاج تساقط الشعر"),
        description: t(
          "Our science-backed formulas target hair thinning at the root. Combining potent natural oils with clinically proven actives, we help stimulate follicle growth and restore volume — safely and effectively.",
          "تركيباتنا المدعومة علمياً تستهدف ترقق الشعر من الجذور. نجمع بين الزيوت الطبيعية القوية والمكونات الفعالة المثبتة سريرياً لتحفيز نمو البصيلات واستعادة الكثافة — بأمان وفعالية."
        ),
        image: beforeAfterImg,
        bg: "bg-secondary/40",
      },
      {
        title: t("Frizz Control", "التحكم بالتجعد"),
        description: t(
          "Tame unruly hair with our deeply nourishing blends. Lightweight yet powerful, our frizz-control solutions smooth the cuticle and lock in moisture for sleek, manageable hair all day long.",
          "تحكم بشعرك المتطاير مع خلطاتنا المغذية بعمق. خفيفة لكنها قوية، تعمل حلول التحكم بالتجعد على تنعيم الشعر وحبس الرطوبة لشعر أنيق وسهل التصفيف طوال اليوم."
        ),
        image: productHairImg,
        bg: "bg-background",
      },
      {
        title: t("Dandruff Relief", "علاج القشرة"),
        description: t(
          "Soothe and rebalance your scalp with gentle, natural anti-dandruff treatments. Our formulations calm irritation, reduce flaking, and promote a healthy scalp environment without harsh chemicals.",
          "هدئ فروة رأسك وأعد توازنها مع علاجات القشرة الطبيعية اللطيفة. تركيباتنا تهدئ التهيج وتقلل التقشر وتعزز بيئة صحية لفروة الرأس بدون مواد كيميائية قاسية."
        ),
        image: glowSerumImg,
        bg: "bg-secondary/40",
      },
    ],
    [t]
  );

  const sections = useMemo(() => {
    if (fromApi.length > 0) {
      return fromApi.map((u, i) => ({
        key: u.id,
        title: isAr ? u.nameAr || u.name : u.name,
        description:
          (isAr ? u.descriptionAr : u.descriptionEn) || (isAr ? u.teaserAr : u.teaserEn),
        imageUrl: u.image || "/placeholder.svg",
        bg: i % 2 === 0 ? "bg-secondary/40" : "bg-background",
        source: "api" as const,
      }));
    }
    return staticSections.map((s, i) => ({
      key: `static-${i}`,
      title: s.title,
      description: s.description,
      imageUrl: s.image.src,
      bg: s.bg,
      source: "static" as const,
    }));
  }, [fromApi, isAr, staticSections]);

  const beforeLabel = t("Before", "قبل");
  const afterLabel = t("After", "بعد");

  return (
    <PageTransition>
      <section className="py-16 px-6 lg:px-12 text-center">
        <ScrollReveal>
          <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">
            {t("Shop", "المتجر")}
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold text-foreground md:text-5xl">
            {t("Hair Care", "العناية بالشعر")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t(
              "Explore our therapeutic hair care range — designed to treat, nourish, and restore. Upcoming launches are highlighted below.",
              "اكتشف مجموعتنا العلاجية للعناية بالشعر — مصممة للعلاج والتغذية والاستعادة. الإصدارات القادمة موضحة أدناه."
            )}
          </p>
        </ScrollReveal>
      </section>

      {isLoading ? (
        <div className="pb-8 space-y-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-muted/30 animate-pulse py-20">
              <div className="mx-auto max-w-6xl px-6 lg:px-12 flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-24 bg-muted rounded" />
                  <div className="h-10 bg-muted rounded w-3/4" />
                  <div className="h-24 bg-muted rounded" />
                </div>
                <div className="flex-1 h-64 bg-muted rounded-2xl max-w-md mx-auto w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pb-8">
          {sections.map((section, i) => {
            const textFirst = i % 2 === 0;
            return (
              <div key={section.key} className={`${section.bg} transition-colors`}>
                <div
                  className={`mx-auto max-w-6xl px-6 py-20 lg:px-12 flex flex-col items-center gap-12 md:gap-16 ${
                    textFirst ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 space-y-5 text-start">
                    <Badge
                      variant="secondary"
                      className="text-xs px-3 py-1 font-semibold tracking-wide border border-[#c4b800] bg-[#e7d600]/15 text-[#8a7f00]"
                    >
                      {t("Coming Soon", "قريباً")}
                    </Badge>
                    <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">{section.description}</p>
                    {section.source === "api" && (
                      <Link
                        href="/contact"
                        className="inline-block text-sm font-medium text-primary hover:underline"
                      >
                        {t("Get notified", "إشعارني عند الإطلاق")} →
                      </Link>
                    )}
                  </div>

                  <div className="flex-1 w-full max-w-md">
                    <BeforeAfterSlider
                      beforeImage={section.imageUrl}
                      afterImage={section.imageUrl}
                      beforeLabel={beforeLabel}
                      afterLabel={afterLabel}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <section className="py-16 px-4 bg-muted/40 border-t border-border">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="font-display text-xl font-semibold text-foreground">
            {t("Stay close on WhatsApp", "تواصلي معنا على واتساب")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t(
              "Get launch updates and ask our team about the right oil for you.",
              "احصلي على تحديثات الإطلاق واسألي فريقنا عن الزيت المناسب لك."
            )}
          </p>
          <Button asChild className="gradient-brand text-primary-foreground">
            <a href="https://wa.me/201234567890" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 me-2" />
              {t("Message us", "راسلينا")}
            </a>
          </Button>
        </div>
      </section>
    </PageTransition>
  );
};

export default UpcomingProducts;
