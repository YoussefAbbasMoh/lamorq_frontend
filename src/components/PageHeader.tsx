"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";

interface Breadcrumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

const PageHeader = ({ title, subtitle, breadcrumbs }: PageHeaderProps) => {
  const { t } = useLang();

  const crumbs: Breadcrumb[] = [
    { label: t("Home", "الرئيسية"), to: "/" },
    ...(breadcrumbs || []),
    { label: title },
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-10">
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground/70 mb-6"
        >
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3 h-3 opacity-40 rtl:-scale-x-100" />}
              {crumb.to ? (
                <Link href={crumb.to} className="hover:text-primary transition-colors duration-300">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground/90 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </motion.nav>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-3xl md:text-[2.75rem] md:leading-tight font-bold text-foreground tracking-tight"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-muted-foreground/80 mt-3 max-w-lg text-[15px] leading-relaxed font-light"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Gradient accent line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-[3px] w-[200px] rounded-full gradient-brand mt-8 origin-left rtl:origin-right opacity-80"
        />
      </div>
    </div>
  );
};

export default PageHeader;
