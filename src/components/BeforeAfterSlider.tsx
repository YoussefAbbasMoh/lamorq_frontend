"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Img = string | { src: string };

function toSrc(img: Img): string {
  if (!img) return "";
  return typeof img === "string" ? img : img.src;
}

export type BeforeAfterSliderProps = {
  beforeImage: Img;
  afterImage: Img;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
};

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: BeforeAfterSliderProps) {
  const before = toSrc(beforeImage) || "/placeholder.svg";
  const after = toSrc(afterImage) || before;
  const same = before === after;

  const [pct, setPct] = useState(50);

  if (same) {
    return (
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden border border-border shadow-md aspect-[4/3] bg-muted",
          className
        )}
      >
        <img src={before} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden border border-border shadow-md aspect-[4/3] select-none bg-muted",
        className
      )}
      role="img"
      aria-label={`${beforeLabel} / ${afterLabel} comparison`}
    >
      <img src={after} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <img
        src={before}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        loading="lazy"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      />
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/95 shadow-md pointer-events-none z-10"
        style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
      />
      <div className="absolute bottom-3 left-3 rounded-md bg-background/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground backdrop-blur-sm pointer-events-none z-10">
        {beforeLabel}
      </div>
      <div className="absolute bottom-3 right-3 rounded-md bg-background/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground backdrop-blur-sm pointer-events-none z-10">
        {afterLabel}
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        aria-label="Before and after"
        className="absolute inset-0 z-20 w-full h-full cursor-ew-resize opacity-0"
        onChange={(e) => setPct(Number(e.target.value))}
      />
    </div>
  );
}
