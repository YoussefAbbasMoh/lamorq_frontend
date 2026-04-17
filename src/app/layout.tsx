import type { Metadata } from "next";
import "./globals.css";
import { SiteVisitTracker } from "@/components/SiteVisitTracker";

export const metadata: Metadata = {
  title: "LAMORQ",
  description: "LAMORQ storefront and admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteVisitTracker />
        {children}
      </body>
    </html>
  );
}
