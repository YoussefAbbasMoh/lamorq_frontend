import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { StoreProviders } from "./StoreProviders";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProviders>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </StoreProviders>
  );
}
