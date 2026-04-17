"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Globe,
  CircleDollarSign,
} from "lucide-react";
import { useAdmin } from "../admin-context";

const nav = [
  { href: "/admin/dashboard", labelKey: "dashboard" as const, icon: LayoutDashboard },
  { href: "/admin/products", labelKey: "products" as const, icon: Package },
  { href: "/admin/orders", labelKey: "orders" as const, icon: ShoppingBag },
  { href: "/admin/massages", labelKey: "messages" as const, icon: MessageSquare },
  { href: "/admin/content", labelKey: "content" as const, icon: FileText },
  { href: "/admin/region-prices", labelKey: "regionPrices" as const, icon: CircleDollarSign },
  { href: "/admin/profile", labelKey: "profile" as const, icon: Settings },
];

export function AdminSidebar({
  sidebarOpen,
  onNavigate,
}: {
  sidebarOpen: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { t, language, setLanguage, handleLogout, isRTL } = useAdmin();

  const asideTransform = isRTL
    ? `right-0 border-l ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`
    : `left-0 border-r ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`;

  return (
    <aside
      className={`fixed z-50 top-0 h-full w-64 max-w-[85vw] bg-white border-gray-200 overflow-y-auto transition-transform duration-200 md:translate-x-0 ${asideTransform}`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-white font-bold">L</span>
          </div>
          <div>
            <h2 className="text-lg text-foreground font-semibold">LAMORQ</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          className="w-full flex items-center justify-center gap-2 mb-6 py-2 text-primary hover:bg-secondary rounded-lg transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">{language === "en" ? "العربية" : "English"}</span>
        </button>

        <nav className="space-y-2">
          {nav.map(({ href, labelKey, icon: Icon }) => {
            const active =
              href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => onNavigate?.()}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? "bg-secondary text-primary" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{t[labelKey]}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            handleLogout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-8"
        >
          <LogOut className="w-5 h-5" />
          <span>{t.logout}</span>
        </button>
      </div>
    </aside>
  );
}
