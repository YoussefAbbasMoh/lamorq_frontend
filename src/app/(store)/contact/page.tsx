import type { Metadata } from "next";
import Contact from "@/storefront/pages/Contact";
import { pageOpenGraph, pageTwitter } from "@/lib/metadata-helpers";

const title = "Contact LAMORQ";
const description =
  "Questions about an order or a product? Reach out to the LAMORQ team — we are happy to help.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: pageOpenGraph("/contact", title, description),
  twitter: pageTwitter(title, description),
};

export default function ContactPage() {
  return <Contact />;
}
