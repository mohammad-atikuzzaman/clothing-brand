"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Image as ImageIcon,
  Settings,
  MessageSquare,
  ExternalLink,
  Menu,
  X,
  Store,
  Bell,
  RotateCcw,
  Sparkles,
  Search,
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { orders, products, messages, resetToDefaults } = useAdminStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const pendingOrdersCount = mounted
    ? orders.filter((o) => o.status === "Pending").length
    : 0;

  const unreadMessagesCount = mounted
    ? messages.filter((m) => m.status === "Unread").length
    : 0;

  const totalProductsCount = mounted ? products.length : 0;

  const navItems = [
    {
      name: "Dashboard & Insights",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Orders Management",
      href: "/admin/orders",
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : undefined,
      badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    },
    {
      name: "Products & Stock",
      href: "/admin/products",
      icon: Package,
      badge: `${totalProductsCount}`,
      badgeColor: "bg-neutral-800 text-neutral-400",
    },
    {
      name: "Banners & Content",
      href: "/admin/content",
      icon: ImageIcon,
    },
    {
      name: "Customer Inquiries",
      href: "/admin/messages",
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined,
      badgeColor: "bg-[#c19b65]/20 text-[#c19b65] border border-[#c19b65]/30",
    },
    {
      name: "Settings & Contact",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleResetData = () => {
    if (confirm("Reset all admin data, orders, and products back to initial demo state?")) {
      resetToDefaults();
      toast.success("Admin data reset to default demo values.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-neutral-100 flex flex-col lg:flex-row antialiased font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[#131722] border-r border-neutral-800/80 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c19b65] text-black font-bold flex items-center justify-center font-serif text-lg shadow-md shadow-[#c19b65]/20">
              IZ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-white tracking-widest text-sm uppercase">
                  IZHAAN
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#c19b65]/20 text-[#c19b65] font-semibold uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 block tracking-wider uppercase">
                Control Hub
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Store Quick Action */}
        <div className="p-4 border-b border-neutral-800/50">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-md bg-neutral-800/40 hover:bg-neutral-800 text-xs font-medium text-neutral-300 hover:text-white border border-neutral-700/40 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-[#c19b65]" />
              <span>View Public Store</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#c19b65] text-black font-semibold shadow-md shadow-[#c19b65]/20"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 ${
                      isActive ? "text-black" : "text-neutral-400 group-hover:text-white"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-black/20 text-black"
                        : item.badgeColor || "bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-800/80 bg-[#0f121a]/60 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c19b65] to-amber-200 text-black flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-semibold text-white truncate">
                Izhaan Store Manager
              </span>
              <span className="block text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                System Online
              </span>
            </div>
          </div>

          <button
            onClick={handleResetData}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-neutral-800/40 hover:bg-red-500/10 hover:text-red-400 text-neutral-400 border border-neutral-700/30 text-[11px] font-medium transition-colors"
            title="Reset to default demo orders and products"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#131722]/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 lg:hidden"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] text-[#c19b65] uppercase font-bold tracking-widest block">
                Izhaan Lifestyle
              </span>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide capitalize">
                {pathname === "/admin"
                  ? "Dashboard & Insights"
                  : pathname.replace("/admin/", "").replace("-", " ")}
              </h1>
            </div>
          </div>

          {/* Topbar Right Tools */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-[#c19b65]/10 text-[#c19b65] border border-[#c19b65]/30 hover:bg-[#c19b65]/20 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Live Store</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
              <Link
                href="/admin/orders"
                className="relative p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                title="Orders"
              >
                <ShoppingBag className="w-4 h-4" />
                {pendingOrdersCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[#131722]" />
                )}
              </Link>

              <Link
                href="/admin/messages"
                className="relative p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                title="Inquiries"
              >
                <MessageSquare className="w-4 h-4" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#c19b65] ring-2 ring-[#131722]" />
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Page Children Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
