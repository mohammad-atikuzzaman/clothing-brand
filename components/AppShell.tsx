"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FloatingChat } from "@/components/FloatingChat";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { SearchBarModal } from "@/components/SearchBarModal";
import { ProductQuickViewModal } from "@/components/ProductQuickViewModal";
import { AuthModal } from "@/components/AuthModal";
import { SizeGuideModal } from "@/components/SizeGuideModal";

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
