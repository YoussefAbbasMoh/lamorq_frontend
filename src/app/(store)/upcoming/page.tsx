import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Shop",
  robots: { index: false, follow: true },
};

/** Upcoming items are shown on /products?category=… — keep old URL from breaking bookmarks. */
export default function UpcomingRedirectPage() {
  redirect("/products");
}
