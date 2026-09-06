"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Heart, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useUIStore } from "@/store/useUIStore";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { getTotalItems, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openAuth } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartItems = mounted ? getTotalItems() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#161616] text-neutral-300 border-t border-neutral-800 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.3)]">
      <div className="grid grid-cols-4 h-15">
        {/* Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            pathname.startsWith("/shop")
              ? "text-[#c19b65]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide uppercase">
            Shop
          </span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
            pathname === "/wishlist"
              ? "text-[#c19b65]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#c19b65] text-white text-[9px] font-bold min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-0.5">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-wide uppercase">
            Wishlist
          </span>
        </Link>

        {/* Cart */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center justify-center gap-1 text-neutral-400 hover:text-white transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#c19b65] text-black text-[9px] font-bold min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-0.5">
                {totalCartItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-wide uppercase">
            Cart
          </span>
        </button>

        {/* My Account */}
        <button
          onClick={() => openAuth("login")}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            pathname === "/my-account"
              ? "text-[#c19b65]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide uppercase">
            Account
          </span>
        </button>
      </div>
    </div>
  );
};
