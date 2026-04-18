"use client";

import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LanguageContext";
import { shouldOptimizeRemoteImage } from "@/lib/next-image-policy";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { isAr, t } = useLang();
  const optimizeImage = shouldOptimizeRemoteImage(product.image);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-card rounded-2xl overflow-hidden transition-shadow duration-500 hover:shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.15)]"
    >
      {/* Image area */}
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-[3/4] relative bg-gradient-to-b from-secondary/40 to-muted/30 flex items-center justify-center p-6">
          <motion.div
            className="relative w-full h-full rounded-xl overflow-hidden"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {optimizeImage ? (
              <Image
                src={product.image}
                alt={isAr ? product.nameAr : product.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
            ) : (
              <img
                src={product.image}
                alt={isAr ? product.nameAr : product.name}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
          </motion.div>
        </div>

        {/* Discount badge */}
        {product.originalPrice && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 start-4 bg-foreground text-background text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full"
          >
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </motion.span>
        )}

        {/* Quick add button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="absolute bottom-4 end-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:gradient-brand hover:text-primary-foreground hover:border-transparent"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </Link>

      {/* Info */}
      <div className="p-5 space-y-2.5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`}
            />
          ))}
          <span className="text-[11px] text-muted-foreground ms-1.5">({product.reviews})</span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-display text-base font-semibold text-card-foreground leading-snug hover:text-primary transition-colors line-clamp-1">
            {isAr ? product.nameAr : product.name}
          </h3>
        </Link>

        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
          {isAr ? product.shortDescAr : product.shortDesc}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-bold text-foreground">{product.price} <span className="text-sm font-medium">{t("EGP", "ج.م")}</span></span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
