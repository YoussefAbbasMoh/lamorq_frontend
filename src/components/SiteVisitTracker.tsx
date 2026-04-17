"use client";

import { useEffect } from "react";
import { recordSiteVisit } from "@/lib/api";

const SESSION_KEY = "lamorq_site_visit_recorded";

/**
 * Records one visit per browser session for public storefront traffic (not admin).
 * Skips /admin routes so the admin UI does not inflate visitor counts.
 */
export function SiteVisitTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname || "/";
    if (path.startsWith("/admin") || path.startsWith("/admin-auth")) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    recordSiteVisit(path).catch(() => {});
  }, []);

  return null;
}
