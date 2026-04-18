import type { Metadata } from "next";
import Privacy from "@/storefront/pages/Privacy";
import { pageOpenGraph, pageTwitter } from "@/lib/metadata-helpers";

const title = "Privacy Policy";
const description =
  "How LAMORQ collects, uses, and protects your information when you shop or contact us.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: pageOpenGraph("/privacy", title, description),
  twitter: pageTwitter(title, description),
};

export default function PrivacyPage() {
  return <Privacy />;
}
