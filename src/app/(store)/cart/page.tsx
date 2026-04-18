import type { Metadata } from "next";
import Cart from "@/storefront/pages/Cart";
import { pageOpenGraph, pageTwitter } from "@/lib/metadata-helpers";

const title = "Your Cart";
const description = "Review your LAMORQ picks and head to checkout when you are ready.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/cart" },
  openGraph: pageOpenGraph("/cart", title, description),
  twitter: pageTwitter(title, description),
};

export default function CartPage() {
  return <Cart />;
}
