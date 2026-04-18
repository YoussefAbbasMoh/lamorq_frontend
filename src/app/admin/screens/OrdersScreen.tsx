"use client";

import { useEffect, useState } from "react";
import type { Order } from "../types";
import { useAdmin } from "../admin-context";
import { bustAdminOrdersDedupe, loadAdminOrders } from "../loaders";
import { updateAdminOrderStatus } from "@/lib/api";

export function OrdersScreen() {
  const {
    t,
    isRTL,
    orders,
    setOrders,
    searchQuery,
    setSearchQuery,
    getStatusColor,
    getOrderStatsByStatus,
    handleViewOrderDetails,
  } = useAdmin();

  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setOrdersLoading(true);
    loadAdminOrders()
      .then((list) => {
        if (!cancelled) setOrders(list);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          alert(err instanceof Error ? err.message : "Failed to load orders");
        }
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [setOrders]);

  const filteredOrders = orders.filter(
    (order) =>
      searchQuery === "" ||
      order.id.toString().includes(searchQuery) ||
      order.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl text-foreground">{t.orders}</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by phone, email, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-foreground text-sm font-medium mb-1">
            {t.pending} ({t.thisMonth})
          </p>
          <p className="text-2xl text-foreground font-semibold">{getOrderStatsByStatus("pending").count}</p>
          <p
            className={`text-xs mt-1 ${
              getOrderStatsByStatus("pending").percentChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {getOrderStatsByStatus("pending").percentChange >= 0 ? "+" : ""}
            {getOrderStatsByStatus("pending").percentChange}% vs last month
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-foreground text-sm font-medium mb-1">
            {t["on-processing"]} ({t.thisMonth})
          </p>
          <p className="text-2xl text-foreground font-semibold">
            {getOrderStatsByStatus("on-processing").count}
          </p>
          <p
            className={`text-xs mt-1 ${
              getOrderStatsByStatus("on-processing").percentChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {getOrderStatsByStatus("on-processing").percentChange >= 0 ? "+" : ""}
            {getOrderStatsByStatus("on-processing").percentChange}% vs last month
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-foreground text-sm font-medium mb-1">
            {t.delivered} ({t.thisMonth})
          </p>
          <p className="text-2xl text-foreground font-semibold">{getOrderStatsByStatus("delivered").count}</p>
          <p
            className={`text-xs mt-1 ${
              getOrderStatsByStatus("delivered").percentChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {getOrderStatsByStatus("delivered").percentChange >= 0 ? "+" : ""}
            {getOrderStatsByStatus("delivered").percentChange}% vs last month
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-foreground text-sm font-medium mb-1">
            {t.cancelled} ({t.thisMonth})
          </p>
          <p className="text-2xl text-foreground font-semibold">{getOrderStatsByStatus("cancelled").count}</p>
          <p
            className={`text-xs mt-1 ${
              getOrderStatsByStatus("cancelled").percentChange >= 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {getOrderStatsByStatus("cancelled").percentChange >= 0 ? "+" : ""}
            {getOrderStatsByStatus("cancelled").percentChange}% vs last month
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  {t.orderId}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  {t.date}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  Customer Phone
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  {t.total}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  Payment Method
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  {t.status}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                    {t.loadingDashboard}
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                    {orders.length === 0 ? t.noOrdersYet : t.noMatchingOrders}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.customerPhone}</td>
                    <td className="px-6 py-4 text-sm text-primary font-semibold">{order.total} EGP</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          const next = e.target.value as Order["status"];
                          try {
                            await updateAdminOrderStatus(order.id, next);
                            bustAdminOrdersDedupe();
                            setOrders(await loadAdminOrders());
                          } catch (err) {
                            alert(err instanceof Error ? err.message : "Update failed");
                          }
                        }}
                        className={`text-xs px-3 py-1 rounded-full border cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">{t.pending}</option>
                        <option value="on-processing">{t["on-processing"]}</option>
                        <option value="delivered">{t.delivered}</option>
                        <option value="cancelled">{t.cancelled}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleViewOrderDetails(order)}
                        className="text-primary text-sm hover:underline"
                      >
                        View Details
                      </button>
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
