"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

interface HeaderProps {
  onOpenSearch: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onSelectCategory }) => {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"menu" | "categories">("menu");

  const { getTotalItems, getSubtotal, openCart } = useCartStore();
  const { items: wishlistItems, openWishlist } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartItems = mounted ? getTotalItems() : 0;
  const cartSubtotal = mounted ? getSubtotal() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  const handleNavCategory = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#161616] text-white border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-neutral-300 hover:text-white focus:outline-none"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex flex-col items-start group">
                <span className="text-2xl sm:text-3xl font-serif tracking-[0.25em] text-white uppercase font-bold group-hover:text-neutral-300 transition-colors">
                  IZHAAN
                </span>
                <span className="text-[9px] tracking-[0.2em] text-neutral-400 font-light -mt-1 uppercase">
                  Lifestyle
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-[#c19b65] transition-colors"
              >
                Home
              </Link>

              <div className="relative group py-2">
                <button
                  className="flex items-center gap-1 text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-[#c19b65] transition-colors"
                >
                  Categories <ChevronDown className="w-4 h-4 opacity-70" />
                </button>
                <div className="absolute left-0 mt-2 w-52 bg-[#1c1c1c] border border-neutral-800 rounded-sm shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => handleNavCategory("Signature Line")}
                    className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider text-neutral-300 hover:bg-neutral-800 hover:text-[#c19b65] transition-colors"
                  >
                    Signature Line
                  </button>
                  <button
                    onClick={() => handleNavCategory("Core Classics")}
                    className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider text-neutral-300 hover:bg-neutral-800 hover:text-[#c19b65] transition-colors"
                  >
                    Core Classics
                  </button>
                  <button
                    onClick={() => handleNavCategory("Smart Casuals")}
                    className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider text-neutral-300 hover:bg-neutral-800 hover:text-[#c19b65] transition-colors"
                  >
                    Smart Casuals
                  </button>
                  <button
                    onClick={() => handleNavCategory("ZAQWAN")}
                    className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider text-neutral-300 hover:bg-neutral-800 hover:text-[#c19b65] transition-colors"
                  >
                    ZAQWAN Royal
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleNavCategory("Signature Line")}
                className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-[#c19b65] transition-colors"
              >
                Signature Line
              </button>

              <button
                onClick={() => handleNavCategory("Core Classics")}
                className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-[#c19b65] transition-colors"
              >
                Core Classics
              </button>

              <button
                onClick={() => handleNavCategory("Smart Casuals")}
                className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-[#c19b65] transition-colors"
              >
                Smart Casuals
              </button>

              <a
                href="#about-section"
                className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-[#c19b65] transition-colors"
              >
                About Us
              </a>

              <a
                href="#footer-section"
                className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-[#c19b65] transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Right Tools (Search, Wishlist, Cart) */}
            <div className="flex items-center space-x-5 sm:space-x-6">
              {/* Search */}
              <button
                onClick={onOpenSearch}
                className="p-1.5 text-neutral-300 hover:text-white transition-colors"
                aria-label="Search"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                onClick={openWishlist}
                className="relative p-1.5 text-neutral-300 hover:text-white transition-colors"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c19b65] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="flex items-center space-x-2 py-1.5 px-2.5 rounded-sm hover:bg-neutral-800 transition-colors group"
                aria-label="Cart"
                title="Shopping Bag"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-neutral-200 group-hover:text-white" />
                  <span className="absolute -top-1.5 -right-2 bg-[#c19b65] text-black font-semibold text-[10px] min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                </div>
                <div className="hidden sm:flex flex-col text-left text-xs leading-tight pl-1">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Bag</span>
                  <span className="font-semibold text-neutral-200">
                    {cartSubtotal.toLocaleString("en-US")}&nbsp;৳
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#161616] text-white h-full shadow-2xl flex flex-col z-10">
            {/* Header with Close */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <span className="text-xl font-serif tracking-[0.2em] font-bold">IZHAAN</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Tab Selectors */}
            <div className="flex border-b border-neutral-800 text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => setActiveMobileTab("menu")}
                className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                  activeMobileTab === "menu"
                    ? "border-[#c19b65] text-[#c19b65]"
                    : "border-transparent text-neutral-400"
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveMobileTab("categories")}
                className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                  activeMobileTab === "categories"
                    ? "border-[#c19b65] text-[#c19b65]"
                    : "border-transparent text-neutral-400"
                }`}
              >
                Categories
              </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeMobileTab === "menu" ? (
                <div className="flex flex-col space-y-4 text-sm font-medium uppercase tracking-wider text-neutral-300">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 border-b border-neutral-800/60 hover:text-white"
                  >
                    Home
                  </Link>
                  <button
                    onClick={() => handleNavCategory("All")}
                    className="py-2 text-left border-b border-neutral-800/60 hover:text-white"
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => handleNavCategory("Signature Line")}
                    className="py-2 text-left border-b border-neutral-800/60 hover:text-white"
                  >
                    Signature Line
                  </button>
                  <button
                    onClick={() => handleNavCategory("Core Classics")}
                    className="py-2 text-left border-b border-neutral-800/60 hover:text-white"
                  >
                    Core Classics
                  </button>
                  <button
                    onClick={() => handleNavCategory("Smart Casuals")}
                    className="py-2 text-left border-b border-neutral-800/60 hover:text-white"
                  >
                    Smart Casuals
                  </button>
                  <a
                    href="#about-section"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 border-b border-neutral-800/60 hover:text-white"
                  >
                    About Us
                  </a>
                  <a
                    href="#footer-section"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 hover:text-white"
                  >
                    Contact Us
                  </a>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 text-sm text-neutral-300">
                  <button
                    onClick={() => handleNavCategory("Signature Line")}
                    className="py-2.5 px-3 bg-neutral-900 text-left rounded-sm font-medium hover:text-[#c19b65]"
                  >
                    Signature Line
                  </button>
                  <button
                    onClick={() => handleNavCategory("Core Classics")}
                    className="py-2.5 px-3 bg-neutral-900 text-left rounded-sm font-medium hover:text-[#c19b65]"
                  >
                    Core Classics
                  </button>
                  <button
                    onClick={() => handleNavCategory("Smart Casuals")}
                    className="py-2.5 px-3 bg-neutral-900 text-left rounded-sm font-medium hover:text-[#c19b65]"
                  >
                    Smart Casuals
                  </button>
                  <button
                    onClick={() => handleNavCategory("ZAQWAN")}
                    className="py-2.5 px-3 bg-neutral-900 text-left rounded-sm font-medium hover:text-[#c19b65]"
                  >
                    ZAQWAN
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Footer Info */}
            <div className="p-4 border-t border-neutral-800 text-xs text-neutral-400 space-y-2">
              <p className="text-neutral-300 font-semibold">Cash on Delivery Available Nationwide</p>
              <p>Hotline: 01800-000000</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
