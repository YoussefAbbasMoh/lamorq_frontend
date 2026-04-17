import { Suspense } from "react";
import AllProducts from "@/storefront/pages/AllProducts";

export default function ProductsListingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">Loading…</div>
      }
    >
      <AllProducts />
    </Suspense>
  );
}
