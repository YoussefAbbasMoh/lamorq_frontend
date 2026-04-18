import { Cairo, DM_Sans, Playfair_Display } from "next/font/google";

/** Self-hosted via next/font — removes render-blocking Google Fonts CSS from the critical path. */
export const fontCairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
  adjustFontFallback: true,
});

export const fontDmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  adjustFontFallback: true,
});

export const fontPlayfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  adjustFontFallback: true,
});

export const fontVariables = `${fontCairo.variable} ${fontDmSans.variable} ${fontPlayfair.variable}`;
