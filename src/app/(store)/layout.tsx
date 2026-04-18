import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { StoreProviders } from "./StoreProviders";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProviders>
      <OrganizationJsonLd />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </StoreProviders>
  );
}
