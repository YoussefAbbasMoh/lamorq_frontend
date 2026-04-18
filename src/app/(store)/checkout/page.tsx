import type { Metadata } from "next";
import Checkout from "@/storefront/pages/Checkout";
import { pageOpenGraph, pageTwitter } from "@/lib/metadata-helpers";

const title = "Checkout";
const description = "Complete your LAMORQ order — secure checkout and delivery across Egypt.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/checkout" },
  openGraph: pageOpenGraph("/checkout", title, description),
  twitter: pageTwitter(title, description),
};

export default function CheckoutPage() {
  return <Checkout />;
}
