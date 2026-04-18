"use client";

import { Leaf, Shield, Droplets, Heart, Star, Target, Eye } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import aboutPhilosophy from "@/assets/about-philosophy.jpg";
import oilJojoba from "@/assets/oil-jojoba.jpg";
import oilSesame from "@/assets/oil-sesame.jpg";
import oilFlaxseed from "@/assets/oil-flaxseed.jpg";

const About = () => {
  const { t } = useLang();

  const values = [
    {
      icon: Leaf,
      title: t("100% Natural", "طبيعي 100%"),
      desc: t(
        "No chemicals, no preservatives — just the raw power of nature in every drop.",
        "بدون كيماويات أو مواد حافظة — فقط قوة الطبيعة الخام في كل قطرة."
      ),
    },
    {
      icon: Shield,
      title: t("Pure Imported Oils", "زيوت نقية مستوردة"),
      desc: t(
        "Jojoba, Sesame, and Flaxseed oils imported for their unmatched purity and quality.",
        "زيوت الجوجوبا والسمسم وبذور الكتان مستوردة لنقائها وجودتها الفائقة."
      ),
    },
    {
      icon: Heart,
      title: t("Proudly Made in Egypt", "صناعة مصرية فخورة"),
      desc: t(
        "Every product is handcrafted in Egypt with the highest standards of care.",
        "كل منتج مصنوع يدوياً في مصر بأعلى معايير العناية."
      ),
    },
    {
      icon: Droplets,
      title: t("Transparent Exchange Policy", "سياسة استبدال شفافة"),
      desc: t(
        "A clear return and exchange policy you can trust — no hidden terms.",
        "سياسة إرجاع واستبدال واضحة يمكنك الوثوق بها — بدون شروط مخفية."
      ),
    },
  ];

  const badges = [
    { big: t("100%", "١٠٠٪"), label: t("NATURAL", "طبيعي") },
    { big: t("0%", "٠٪"), label: t("CHEMICALS", "كيماويات") },
    { big: t("Egypt", "مصر"), label: t("HANDMADE", "يدوي") },
  ];

  const oils = [
    {
      name: t("Jojoba Oil", "زيت الجوجوبا"),
      desc: t(
        "Imported for its high vitamin E content and extreme purity.",
        "مستورد لمحتواه العالي من فيتامين E ونقائه المتناهي."
      ),
      image: oilJojoba.src,
    },
    {
      name: t("Sesame Oil", "زيت السمسم"),
      desc: t(
        "Rich in antioxidants and minerals to support healthy-looking hair and skin.",
        "غني بمضادات الأكسدة والمعادن عشان شعر وبشرة أحسن في المظهر."
      ),
      image: oilSesame.src,
    },
    {
      name: t("Flaxseed Oil", "زيت بذور الكتان"),
      desc: t(
        "A rich plant source of Omega-3 to support softness and comfort for skin and hair.",
        "مصدر غني بالأوميجا-3 من النبات عشان نعومة وراحة في مظهر البشرة والشعر."
      ),
      image: oilFlaxseed.src,
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("About LAMORQ", "عن لامورك")}
        subtitle={t(
          "Natural skincare from Egypt — gentle ingredients, clear standards, visible results.",
          "عناية طبيعية من مصر — مكونات لطيفة، معايير واضحة، ونتايج تبان."
        )}
      />

      {/* ── Our Philosophy (Story) ── */}
      <section className="bg-background">
        <div className="container mx-auto px-page py-16 md:py-24 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left: Text + Badges */}
            <ScrollReveal>
              <div className="space-y-6">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground italic">
                  {t("Our Philosophy", "فلسفتنا")}
                </h2>
                <div className="space-y-5 text-muted-foreground text-[15px] leading-[1.85]">
                  <p>
                    {t(
                      "At LAMORQ, we focus on skincare you can understand. We source cold-pressed oils and proven actives, then blend them with care in Egypt — for formulas that feel simple and deliver visible results.",
                      "في لامورك، بنركّز على عناية تقدري تفهمي مكوناتها. بنجيب زيوت معصورة على البارد ومواد فعّالة مدروسة، وبنمزجها بعناية في مصر — عشان تركيبات بسيطة في الاستخدام ونتايج واضحة."
                    )}
                  </p>
                  <p>
                    {t(
                      "We believe in 100% transparency. Every ingredient is listed, every claim is verified, and every product is made in Egypt with the highest standards of purity. No synthetic chemicals, no artificial scents — just the raw power of nature.",
                      "نؤمن بالشفافية الكاملة. كل مكون مُدرج، كل ادعاء مُثبت، وكل منتج مصنوع في مصر بأعلى معايير النقاء. بدون كيماويات صناعية أو عطور اصطناعية — فقط قوة الطبيعة الخام."
                    )}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-4 pt-4">
                  {badges.map((b, i) => (
                    <div
                      key={i}
                      className="w-24 h-20 rounded-xl border border-border bg-muted/30 flex flex-col items-center justify-center gap-1"
                    >
                      <span className="font-display text-lg font-bold text-foreground">{b.big}</span>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                        {b.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Image */}
            <ScrollReveal delay={0.15}>
              <div className="rounded-2xl overflow-hidden border border-border bg-muted/10">
                <img
                  src={aboutPhilosophy.src}
                  alt={t("Natural Care Products", "منتجات العناية الطبيعية")}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  width={640}
                  height={800}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Why Choose LAMORQ ── */}
      <section className="container mx-auto px-page py-16 md:py-24 max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">
              {t("Our Values", "قيمنا")}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-3">
              {t("Why Choose LAMORQ", "لماذا تختار لامورك")}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="bg-background rounded-2xl border border-border p-7 md:p-8 space-y-4 h-full hover:shadow-sm transition-shadow duration-300">
                <div className="w-11 h-11 gradient-brand rounded-xl flex items-center justify-center">
                  <v.icon className="w-[18px] h-[18px] text-primary-foreground" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="bg-muted/20">
        <div className="container mx-auto px-page py-16 md:py-24 max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">
                {t("Our Purpose", "هدفنا")}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-3">
                {t("Mission & Vision", "المهمة والرؤية")}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal delay={0}>
              <div className="bg-primary rounded-2xl p-10 md:p-12 h-full flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-6">
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-primary-foreground mb-4">
                  {t("Our Mission", "مهمتنا")}
                </h2>
                <p className="text-primary-foreground/80 text-[15px] leading-[1.8] flex-1">
                  {t(
                    "To bring gentle, science-backed skincare to every Egyptian home — effective, accessible, and easy to use every day.",
                    "نوصّل عناية لطيفة ومدعومة بالعلم لكل بيت مصري — فعّالة، في المتناول، وسهلة في الاستخدام اليومي."
                  )}
                </p>
                <div className="flex gap-1 mt-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-background rounded-2xl border border-border p-10 md:p-12 h-full flex flex-col">
                <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center mb-6">
                  <Eye className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                  {t("Our Vision", "رؤيتنا")}
                </h2>
                <p className="text-muted-foreground text-[15px] leading-[1.8] flex-1">
                  {t(
                    "To become a trusted Egyptian name in natural skincare — known for purity, transparency, and formulas that deliver visible results.",
                    "نبقى اسم مصري موثوق في العناية الطبيعية — معروفين بالنقاء والشفافية وتركيبات بتدي نتايج واضحة."
                  )}
                </p>
                <p className="text-muted-foreground/60 text-sm italic mt-8">
                  {t(
                    '"When you choose LAMORQ, you choose purity, transparency, and a better way of living."',
                    '"عندما تختار لامورك، فأنت تختار النقاء والشفافية وأسلوب حياة أفضل."'
                  )}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Our Ingredients (Pure Imported Oils) ── */}
      <section className="bg-muted/20">
        <div className="container mx-auto px-page py-16 md:py-24 max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">
                {t("Quality First", "الجودة أولاً")}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-3">
                {t("Pure Imported Oils", "زيوت نقية مستوردة")}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {oils.map((oil, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="text-center space-y-5">
                  {/* Circular image with border */}
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-border shadow-sm">
                    <img
                      src={oil.image}
                      alt={oil.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={512}
                      height={512}
                    />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground italic">
                    {oil.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
                    {oil.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
