"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FloatingChat } from "@/components/FloatingChat";

// Lazy-load secondary global drawers & modals to drastically reduce initial page bundle weight
const CartDrawer = dynamic(() => import("@/components/CartDrawer").then((m) => m.CartDrawer), {
  ssr: false,
});
const WishlistDrawer = dynamic(
  () => import("@/components/WishlistDrawer").then((m) => m.WishlistDrawer),
  { ssr: false }
);
const SearchBarModal = dynamic(
  () => import("@/components/SearchBarModal").then((m) => m.SearchBarModal),
  { ssr: false }
);
const ProductQuickViewModal = dynamic(
  () => import("@/components/ProductQuickViewModal").then((m) => m.ProductQuickViewModal),
  { ssr: false }
);
const AuthModal = dynamic(() => import("@/components/AuthModal").then((m) => m.AuthModal), {
  ssr: false,
});
const SizeGuideModal = dynamic(
  () => import("@/components/SizeGuideModal").then((m) => m.SizeGuideModal),
  { ssr: false }
);

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <div className="min-h-screen bg-[#0f1117]">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Persistent Sticky Header */}
      <Header />

      {/* Main Content Area (padding-bottom on mobile for sticky bottom nav) */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Persistent Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Toolbar */}
      <MobileBottomNav />

      {/* Floating Messenger / WhatsApp Chat */}
      <FloatingChat />

      {/* Global Drawers and Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchBarModal />
      <ProductQuickViewModal />
      <AuthModal />
      <SizeGuideModal />
    </div>
  );
};
