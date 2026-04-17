import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useLang } from "@/contexts/LanguageContext";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

const ScrollReveal = ({ children, delay = 0, direction = "up", className }: ScrollRevealProps) => {
  const { isAr } = useLang();

  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: isAr ? -60 : 60, y: 0 },
    right: { x: isAr ? 60 : -60, y: 0 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
