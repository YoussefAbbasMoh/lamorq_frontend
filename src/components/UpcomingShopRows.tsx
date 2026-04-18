"use client";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/contexts/LanguageContext";
import type { StoreUpcomingItem } from "@/lib/store-product-mapper";

type Props = {
  items: StoreUpcomingItem[];
};

/** Full-width alternating rows (Shop-style) for API “upcoming” products in a category. */
export default function UpcomingShopRows({ items }: Props) {
  const { t, isAr } = useLang();

  if (!items.length) return null;

  const beforeLabel = t("Before", "قبل");
  const afterLabel = t("After", "بعد");

  return (
    <div className="w-full border-b border-border">
      {items.map((u, i) => {
        const textFirst = i % 2 === 0;
        const bg = i % 2 === 0 ? "bg-secondary/40" : "bg-background";
        const title = isAr ? u.nameAr || u.name : u.name;
        const desc = isAr ? u.descriptionAr || u.teaserAr : u.descriptionEn || u.teaserEn;
        const img = u.image || "/placeholder.svg";

        return (
          <div key={u.id} className={`${bg} transition-colors`}>
            <div
              className={`mx-auto max-w-6xl px-page py-16 flex flex-col items-center gap-12 md:gap-16 ${
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
                  {title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{desc}</p>
              </div>
              <div className="flex-1 w-full max-w-md">
                <BeforeAfterSlider
                  beforeImage={img}
                  afterImage={img}
                  beforeLabel={beforeLabel}
                  afterLabel={afterLabel}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
