"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { AdminProvider } from "../admin-context";
import { AdminShell } from "./AdminShell";

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (!api.getStoredToken()) {
      router.replace("/admin-auth");
      setChecked(true);
      return;
    }
    setOk(true);
    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-foreground">
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  if (!ok) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <AdminShell>{children}</AdminShell>
      </AdminProvider>
    </QueryClientProvider>
  );
}
