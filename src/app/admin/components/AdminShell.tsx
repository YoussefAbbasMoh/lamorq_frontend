"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { useAdmin } from "../admin-context";
import { AdminSidebar } from "./AdminSidebar";
import { AdminModals } from "../modals/AdminModals";

export function AdminShell({ children }: { children: ReactNode }) {
  const { isRTL } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="flex relative">
        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <AdminSidebar sidebarOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

        <main
          className={`flex-1 min-w-0 w-full ${isRTL ? "md:mr-64" : "md:ml-64"} py-4 sm:py-6 md:py-8 px-page`}
        >
          <div className="flex items-center justify-between gap-4 md:hidden mb-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg border border-gray-200 text-foreground"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-sm font-semibold text-foreground">LAMORQ</span>
          </div>
          {children}
        </main>
      </div>
      <AdminModals />
    </div>
  );
}
