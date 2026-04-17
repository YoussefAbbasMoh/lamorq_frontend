"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CircleDollarSign, Package, ShoppingBag, Users } from "lucide-react";
import { useAdmin } from "../admin-context";
import { loadAdminDashboardStats } from "../loaders";
import type { AdminDashboardStats } from "@/lib/api";

function formatEgp(n: number) {
  return `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(n)} EGP`;
}

function StatNumber({ loading, children }: { loading: boolean; children: ReactNode }) {
  return <p className="text-2xl text-foreground font-semibold">{loading ? "—" : children}</p>;
}

export function DashboardScreen() {
  const { t, isRTL, getStatusColor } = useAdmin();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadAdminDashboardStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          alert(err instanceof Error ? err.message : "Failed to load dashboard");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const recentOrders = stats?.recentOrders ?? [];
  const days = stats?.activeUsersPeriodDays ?? 7;
  const footnoteUsers = t.activeUsersFootnote.replace("{{days}}", String(days));

  return (
    <div>
      <h1 className="text-3xl text-foreground mb-8">{t.dashboard}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CircleDollarSign className="w-6 h-6 text-green-700" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t.totalRevenue}</p>
          <StatNumber loading={loading}>{formatEgp(stats?.totalRevenue ?? 0)}</StatNumber>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t.totalOrders}</p>
          <StatNumber loading={loading}>{stats?.totalOrders ?? 0}</StatNumber>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t.totalProducts}</p>
          <StatNumber loading={loading}>{stats?.totalProducts ?? 0}</StatNumber>
          <p className="text-purple-600 text-xs mt-2">{t.catalogProductCount}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-700" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">{t.activeUsers}</p>
          <StatNumber loading={loading}>{stats?.activeUsers ?? 0}</StatNumber>
          <p className="text-yellow-700 text-xs mt-2">{footnoteUsers}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl text-foreground mb-4">{t.recentOrders}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className={`${isRTL ? "text-right" : "text-left"} py-3 text-sm text-gray-600`}>
                  {t.orderId}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} py-3 text-sm text-gray-600`}>
                  {t.customer}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} py-3 text-sm text-gray-600`}>
                  {t.date}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} py-3 text-sm text-gray-600`}>
                  {t.total}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} py-3 text-sm text-gray-600`}>
                  {t.status}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 text-sm">
                    {t.loadingDashboard}
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 text-sm">
                    {t.noRecentOrders}
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-4 text-sm text-foreground">#{order.id}</td>
                    <td className="py-4 text-sm text-gray-700">{order.customerPhone}</td>
                    <td className="py-4 text-sm text-gray-700">{order.date}</td>
                    <td className="py-4 text-sm text-foreground font-semibold">{order.total} EGP</td>
                    <td className="py-4">
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {t[order.status as keyof typeof t]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
