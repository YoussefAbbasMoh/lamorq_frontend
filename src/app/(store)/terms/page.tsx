import type { Metadata } from "next";
import Terms from "@/storefront/pages/Terms";
import { pageOpenGraph, pageTwitter } from "@/lib/metadata-helpers";

const title = "Terms & Conditions";
const description =
  "Read the terms of shopping with LAMORQ — shipping, returns, and how we serve customers in Egypt.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: pageOpenGraph("/terms", title, description),
  twitter: pageTwitter(title, description),
};

export default function TermsPage() {
  return <Terms />;
}
