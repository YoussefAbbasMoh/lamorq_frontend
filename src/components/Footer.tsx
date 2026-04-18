"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import { SocialIconLinks } from "@/components/SocialIconLinks";
import { LAMORQ_CONTACT } from "@/lib/contact-info";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useLang();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-page py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <ScrollReveal delay={0}>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image
                  src={logo}
                  alt="LAMORQ"
                  width={120}
                  height={128}
                  className="h-10 w-auto brightness-200"
                />
                <span className="font-display text-xl font-bold">LAMORQ</span>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                {t(
                  "Premium natural skincare from Egypt — science-backed, gentle, and made to give you visible results.",
                  "عناية طبيعية فاخرة من مصر — مدعومة بالعلم، لطيفة، ومصمّمة عشان تشوفي نتيجة واضحة."
                )}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">{t("Quick Links", "روابط سريعة")}</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li>
                  <Link href="/products" className="hover:opacity-100 transition-opacity">
                    {t("All Products", "جميع المنتجات")}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:opacity-100 transition-opacity">
                    {t("About Us", "من نحن")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:opacity-100 transition-opacity">
                    {t("Contact", "تواصل معنا")}
                  </Link>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">{t("Policies", "السياسات")}</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li>
                  <Link href="/terms" className="hover:opacity-100 transition-opacity">
                    {t("Terms & Conditions", "الشروط والأحكام")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:opacity-100 transition-opacity">
                    {t("Privacy Policy", "سياسة الخصوصية")}
                  </Link>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">{t("Contact", "تواصل")}</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href={`mailto:${LAMORQ_CONTACT.email}`} className="hover:opacity-100 transition-opacity underline-offset-4 hover:underline">
                    {LAMORQ_CONTACT.email}
                  </a>
                </li>
                <li>
                  <a href={LAMORQ_CONTACT.phoneHref} className="hover:opacity-100 transition-opacity underline-offset-4 hover:underline">
                    {LAMORQ_CONTACT.phoneDisplay}
                  </a>
                </li>
                <li>{t("Cairo — New Giza, Egypt", "القاهرة — نيو جيزة، مصر")}</li>
              </ul>
              <SocialIconLinks variant="footer" className="mt-5" />
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.1}>
          <div className="border-t border-primary-foreground/20 mt-12 pt-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs opacity-50">
                © 2026 LAMORQ Cosmetics. {t("All rights reserved.", "جميع الحقوق محفوظة.")}
              </p>
              <Link href="/admin" className="text-xs opacity-30 hover:opacity-60 transition-opacity">
                {t("Admin Login", "تسجيل دخول الأدمن")}
              </Link>
            </div>
            <p className="text-xs text-center opacity-60">
              {t("Designed and developed by", "صُمم وطُوّر بواسطة")}{" "}
              <a
                href="https://www.absai.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-foreground/90 hover:underline underline-offset-2"
              >
                ABS.AI
              </a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default Footer;
