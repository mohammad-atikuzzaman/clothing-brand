"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Users,
  Eye,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { useAdminStore, OrderStatus } from "@/store/useAdminStore";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { orders, products, messages, updateOrderStatus } = useAdminStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-neutral-400">
        Loading Store Insights...
      </div>
    );
  }

  // Analytics Calculations
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const processingOrders = orders.filter((o) => o.status === "Processing");
  const shippedOrders = orders.filter((o) => o.status === "Shipped");
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled");

  const averageOrderValue =
    totalOrdersCount > 0
      ? Math.round(totalRevenue / Math.max(orders.filter((o) => o.status !== "Cancelled").length, 1))
      : 0;

  const inStockProductsCount = products.filter((p) => p.inStock).length;
  const outOfStockProductsCount = products.filter((p) => !p.inStock).length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      case "Confirmed":
        return "bg-sky-500/10 text-sky-400 border border-sky-500/30";
      case "Processing":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30";
      case "Shipped":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/30";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/30";
      default:
        return "bg-neutral-800 text-neutral-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131722] p-5 sm:p-6 rounded-xl border border-neutral-800/80 shadow-lg">
        <div>
          <span className="text-xs font-bold text-[#c19b65] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Performance</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
            Izhaan Lifestyle Overview
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time insights on sales, customer orders, and catalog availability.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#c19b65] hover:bg-[#d5ad74] text-black font-semibold text-xs transition-colors shadow-md shadow-[#c19b65]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs border border-neutral-700/50 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#c19b65]" />
            <span>Manage Orders ({pendingOrders.length} pending)</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Revenue */}
        <div className="bg-[#131722] p-5 rounded-xl border border-neutral-800/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {formatPrice(totalRevenue)}
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 inline-flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3 h-3" />
              Active sales & orders
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#131722] p-5 rounded-xl border border-neutral-800/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#c19b65]/10 text-[#c19b65] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {totalOrdersCount}
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              {deliveredOrders.length} delivered • {pendingOrders.length} pending
            </span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-[#131722] p-5 rounded-xl border border-neutral-800/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Avg. Order Value
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {formatPrice(averageOrderValue)}
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Per customer checkout
            </span>
          </div>
        </div>

        {/* Catalog Inventory */}
        <div className="bg-[#131722] p-5 rounded-xl border border-neutral-800/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Active Products
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {products.length}
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              {inStockProductsCount} In Stock • {outOfStockProductsCount} Out of Stock
            </span>
          </div>
        </div>
      </div>

      {/* Order Status Distribution & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Status Funnel (8 cols) */}
        <div className="lg:col-span-8 bg-[#131722] p-5 sm:p-6 rounded-xl border border-neutral-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Order Fulfillment Pipeline
              </h3>
              <p className="text-xs text-neutral-400">
                Live status breakdown of customer orders
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#c19b65] hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            <div className="bg-neutral-900/60 p-3.5 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending</span>
              </div>
              <div className="text-xl font-bold text-white">{pendingOrders.length}</div>
              <span className="text-[10px] text-neutral-400">Needs confirmation</span>
            </div>

            <div className="bg-neutral-900/60 p-3.5 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Processing</span>
              </div>
              <div className="text-xl font-bold text-white">{processingOrders.length}</div>
              <span className="text-[10px] text-neutral-400">Packing in warehouse</span>
            </div>

            <div className="bg-neutral-900/60 p-3.5 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold mb-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Shipped</span>
              </div>
              <div className="text-xl font-bold text-white">{shippedOrders.length}</div>
              <span className="text-[10px] text-neutral-400">With courier / Steadfast</span>
            </div>

            <div className="bg-neutral-900/60 p-3.5 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Delivered</span>
              </div>
              <div className="text-xl font-bold text-white">{deliveredOrders.length}</div>
              <span className="text-[10px] text-neutral-400">Completed & Cash Collected</span>
            </div>

            <div className="bg-neutral-900/60 p-3.5 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Cancelled</span>
              </div>
              <div className="text-xl font-bold text-white">{cancelledOrders.length}</div>
              <span className="text-[10px] text-neutral-400">Rejected or returned</span>
            </div>
          </div>
        </div>

        {/* Quick Insights / Notices (4 cols) */}
        <div className="lg:col-span-4 bg-[#131722] p-5 sm:p-6 rounded-xl border border-neutral-800/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Store Control Actions
            </h3>
            <p className="text-xs text-neutral-400">Quick direct shortcuts</p>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/admin/products"
              className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#c19b65]" />
                Catalog Management
              </span>
              <span className="text-[10px] text-neutral-500">Edit Price/Stock →</span>
            </Link>

            <Link
              href="/admin/content"
              className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#c19b65]" />
                Hero Banners & Sliders
              </span>
              <span className="text-[10px] text-neutral-500">Update Offers →</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c19b65]" />
                Hotline & Delivery Fees
              </span>
              <span className="text-[10px] text-neutral-500">Settings →</span>
            </Link>
          </div>

          <div className="p-3 bg-neutral-900/40 rounded-lg border border-neutral-800 text-[11px] text-neutral-400">
            💡 Customer orders placed on the public checkout are instantly synced into this dashboard.
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#131722] rounded-xl border border-neutral-800/80 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-neutral-400">
              Latest transactions placed on Izhaan Lifestyle
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-[#c19b65] hover:underline"
          >
            All Orders ({orders.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#0f121a] text-neutral-400 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Phone / City</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {orders.slice(0, 6).map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-neutral-200">
                    {order.customerName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="block text-neutral-300">{order.phone}</span>
                    <span className="text-[10px] text-neutral-400">{order.district}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-neutral-200">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </span>
                    <span className="block text-[10px] text-neutral-400 truncate max-w-[160px]">
                      {order.items.map((i) => i.name).join(", ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {formatPrice(order.total)}
                    <span className="block text-[10px] text-neutral-400 font-normal uppercase">
                      {order.paymentMethod === "bkash" ? "bKash" : "COD"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="bg-neutral-900 border border-neutral-700 text-[11px] text-neutral-200 rounded-md py-1 px-2 focus:outline-none focus:border-[#c19b65]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
