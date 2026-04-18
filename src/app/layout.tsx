import type { Metadata } from "next";
import "./globals.css";
import { SiteVisitTracker } from "@/components/SiteVisitTracker";
import { fontVariables } from "./fonts";
import { siteUrl } from "@/lib/site";
import { defaultOgImage, defaultTwitterImageUrls } from "@/lib/metadata-helpers";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LAMORQ",
    template: "%s — LAMORQ",
  },
  description:
    "LAMORQ is an Egyptian skincare brand built on science-backed, gentle ingredients. Effective products for brighter, even, healthy-looking skin.",
  openGraph: {
    type: "website",
    siteName: "LAMORQ",
    locale: "en_US",
    images: defaultOgImage(),
  },
  twitter: {
    card: "summary_large_image",
    images: defaultTwitterImageUrls(),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <SiteVisitTracker />
        {children}
      </body>
    </html>
  );
}
