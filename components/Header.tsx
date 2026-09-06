"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  User,
  Sparkles,
  Phone,
  MessageCircle,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useUIStore } from "@/store/useUIStore";
import { formatPrice } from "@/lib/utils";

interface HeaderProps {
  onOpenSearch?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onSelectCategory }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(true);

  const { getTotalItems, getSubtotal, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openSearch: globalOpenSearch, openAuth } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const totalCartItems = mounted ? getTotalItems() : 0;
  const cartSubtotal = mounted ? getSubtotal() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      globalOpenSearch();
    }
  };

  // Route active states
  const isHome = pathname === "/";
  const isShop =
    pathname.startsWith("/shop") ||
    pathname.startsWith("/product-category") ||
    pathname.startsWith("/product/");
  const isAbout = pathname === "/about-us";
  const isContact = pathname === "/contact-us";

  return (
    <>
      {/* Main Sticky Navbar */}
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
                <span className="text-2xl sm:text-3xl font-serif tracking-[0.25em] text-white uppercase font-bold group-hover:text-neutral-200 transition-colors">
                  IZHAAN
                </span>
                <span className="text-[9px] tracking-[0.2em] text-[#c19b65] font-light -mt-1 uppercase">
                  Lifestyle
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-9">
              {/* Home */}
              <Link
                href="/"
                className={`relative text-xs font-semibold uppercase tracking-wider transition-colors py-2 ${
                  isHome ? "text-[#c19b65]" : "text-neutral-200 hover:text-[#c19b65]"
                }`}
              >
                <span>Home</span>
                {isHome && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c19b65] rounded-full" />
                )}
              </Link>

              {/* Shop (Consolidated: links to /shop with full collection mega dropdown) */}
              <div className="relative group py-2">
                <Link
                  href="/shop"
                  className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors py-2 ${
                    isShop ? "text-[#c19b65]" : "text-neutral-200 hover:text-[#c19b65]"
                  }`}
                >
                  <span>Shop</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </Link>
                {isShop && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c19b65] rounded-full" />
                )}

                {/* Dropdown Menu with Hover Bridge */}
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="w-96 bg-[#1a1a1a] border border-neutral-800 rounded-sm shadow-2xl p-4 divide-y divide-neutral-800/80">
                    {/* All Products Header */}
                    <div className="pb-3">
                      <Link
                        href="/shop"
                        className="flex items-center justify-between p-2.5 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 rounded-xs transition-colors group/all"
                      >
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-white group-hover/all:text-[#c19b65] transition-colors block">
                            All Collections
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            Browse full catalog of 100+ Panjabis
                          </span>
                        </div>
                        <span className="text-xs text-[#c19b65] font-semibold tracking-wider">
                          View All →
                        </span>
                      </Link>
                    </div>

                    {/* Specific Categories */}
                    <div className="py-2.5 space-y-1">
                      <Link
                        href="/product-category/signature-line"
                        className="flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wider text-neutral-200 hover:bg-neutral-800 hover:text-[#c19b65] rounded-xs transition-colors group/item"
                      >
                        <div>
                          <span className="font-medium">Signature Line</span>
                          <span className="block text-[10px] text-neutral-400 lowercase first-letter:uppercase tracking-normal">
                            Luxury combed cotton jacquard
                          </span>
                        </div>
                        <span className="text-[9px] bg-[#c19b65]/20 text-[#c19b65] px-1.5 py-0.5 rounded-xs font-bold">
                          Exclusive
                        </span>
                      </Link>

                      <Link
                        href="/product-category/core-classics"
                        className="flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wider text-neutral-200 hover:bg-neutral-800 hover:text-[#c19b65] rounded-xs transition-colors"
                      >
                        <div>
                          <span className="font-medium">Core Classics</span>
                          <span className="block text-[10px] text-neutral-400 lowercase first-letter:uppercase tracking-normal">
                            Everyday minimalist elegance
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/product-category/smart-casuals"
                        className="flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wider text-neutral-200 hover:bg-neutral-800 hover:text-[#c19b65] rounded-xs transition-colors"
                      >
                        <div>
                          <span className="font-medium">Smart Casuals</span>
                          <span className="block text-[10px] text-neutral-400 lowercase first-letter:uppercase tracking-normal">
                            Modern contemporary fits
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/product-category/zaqwan"
                        className="flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wider text-neutral-200 hover:bg-neutral-800 hover:text-[#c19b65] rounded-xs transition-colors"
                      >
                        <div>
                          <span className="font-medium">ZAQWAN Royal Edition</span>
                          <span className="block text-[10px] text-neutral-400 lowercase first-letter:uppercase tracking-normal">
                            Festive embroidered masterpieces
                          </span>
                        </div>
                        <span className="text-[9px] bg-neutral-800 text-[#c19b65] px-1.5 py-0.5 rounded-xs font-bold">
                          Premium
                        </span>
                      </Link>

                      <Link
                        href="/product-category/price-990-999"
                        className="flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wider text-[#c19b65] hover:bg-neutral-800 rounded-xs transition-colors font-semibold"
                      >
                        <div>
                          <span>Special ৳990 - ৳999</span>
                          <span className="block text-[10px] text-neutral-400 lowercase first-letter:uppercase tracking-normal font-normal">
                            Limited flash sale stock
                          </span>
                        </div>
                        <Sparkles className="w-3.5 h-3.5 text-[#c19b65]" />
                      </Link>
                    </div>

                    {/* Quality Assurance Strip */}
                    <div className="pt-2.5 px-3 flex items-center justify-between text-[10px] text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3 text-[#c19b65]" /> 2-3 Days Delivery
                      </span>
                      <span className="flex items-center gap-1">
                        <RotateCcw className="w-3 h-3 text-[#c19b65]" /> 7-Day Exchange
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Us */}
              <Link
                href="/about-us"
                className={`relative text-xs font-semibold uppercase tracking-wider transition-colors py-2 ${
                  isAbout ? "text-[#c19b65]" : "text-neutral-200 hover:text-[#c19b65]"
                }`}
              >
                <span>About Us</span>
                {isAbout && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c19b65] rounded-full" />
                )}
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact-us"
                className={`relative text-xs font-semibold uppercase tracking-wider transition-colors py-2 ${
                  isContact ? "text-[#c19b65]" : "text-neutral-200 hover:text-[#c19b65]"
                }`}
              >
                <span>Contact Us</span>
                {isContact && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c19b65] rounded-full" />
                )}
              </Link>
            </nav>

            {/* Right Tools (Account, Search, Wishlist, Cart) */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Account / Login */}
              <button
                onClick={() => openAuth("login")}
                className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors"
                title="Login / Register"
              >
                <User className="w-4 h-4 text-[#c19b65]" />
                <span className="font-medium tracking-wider uppercase text-[11px]">
                  Sign In
                </span>
              </button>

              {/* Search */}
              <button
                onClick={handleSearchClick}
                className="p-1.5 text-neutral-300 hover:text-white transition-colors"
                aria-label="Search"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
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
              </Link>

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
                  <span className="text-[9px] text-neutral-400 uppercase tracking-wider">Bag</span>
                  <span className="font-semibold text-neutral-200">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation (Unified, intuitive & no duplicate shop links) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#161616] text-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-xl font-serif tracking-[0.2em] font-bold block text-white">
                  IZHAAN
                </span>
                <span className="text-[9px] text-[#c19b65] uppercase tracking-widest">
                  Lifestyle
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-neutral-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-3 rounded-xs uppercase tracking-wider text-xs font-semibold transition-colors ${
                  isHome
                    ? "bg-neutral-800 text-[#c19b65]"
                    : "text-neutral-200 hover:bg-neutral-800 hover:text-[#c19b65]"
                }`}
              >
                Home
              </Link>

              {/* Shop with Accordion */}
              <div className="rounded-xs overflow-hidden">
                <div className="flex items-center justify-between py-2 px-3 bg-neutral-900/60 border border-neutral-800 rounded-xs">
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`uppercase tracking-wider text-xs font-bold transition-colors ${
                      isShop ? "text-[#c19b65]" : "text-white hover:text-[#c19b65]"
                    }`}
                  >
                    Shop All Panjabis
                  </Link>
                  <button
                    onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                    className="p-1 text-neutral-400 hover:text-white"
                    aria-label="Toggle collections"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileShopExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {mobileShopExpanded && (
                  <div className="pl-3 pr-1 py-1.5 space-y-1 border-l-2 border-[#c19b65]/30 ml-3 mt-1.5">
                    <Link
                      href="/shop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 px-2 text-xs font-semibold text-white hover:text-[#c19b65] transition-colors uppercase tracking-wider"
                    >
                      • All Collections
                    </Link>
                    <Link
                      href="/product-category/signature-line"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 px-2 text-xs text-neutral-300 hover:text-[#c19b65] transition-colors uppercase tracking-wider"
                    >
                      • Signature Line (Exclusive)
                    </Link>
                    <Link
                      href="/product-category/core-classics"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 px-2 text-xs text-neutral-300 hover:text-[#c19b65] transition-colors uppercase tracking-wider"
                    >
                      • Core Classics
                    </Link>
                    <Link
                      href="/product-category/smart-casuals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 px-2 text-xs text-neutral-300 hover:text-[#c19b65] transition-colors uppercase tracking-wider"
                    >
                      • Smart Casuals
                    </Link>
                    <Link
                      href="/product-category/zaqwan"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 px-2 text-xs text-neutral-300 hover:text-[#c19b65] transition-colors uppercase tracking-wider"
                    >
                      • ZAQWAN Royal Edition
                    </Link>
                    <Link
                      href="/product-category/price-990-999"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 px-2 text-xs text-[#c19b65] hover:underline transition-colors uppercase tracking-wider font-semibold"
                    >
                      • Special ৳990 - ৳999
                    </Link>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 text-neutral-200 hover:bg-neutral-800 hover:text-[#c19b65] rounded-xs uppercase tracking-wider text-xs font-semibold transition-colors"
              >
                <span>My Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="bg-[#c19b65] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 text-neutral-200 hover:bg-neutral-800 hover:text-[#c19b65] rounded-xs uppercase tracking-wider text-xs font-semibold transition-colors"
              >
                <span>Shopping Bag</span>
                {totalCartItems > 0 && (
                  <span className="bg-[#c19b65] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              {/* About Us */}
              <Link
                href="/about-us"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-3 rounded-xs uppercase tracking-wider text-xs font-semibold transition-colors ${
                  isAbout
                    ? "bg-neutral-800 text-[#c19b65]"
                    : "text-neutral-200 hover:bg-neutral-800 hover:text-[#c19b65]"
                }`}
              >
                About Us
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact-us"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-3 rounded-xs uppercase tracking-wider text-xs font-semibold transition-colors ${
                  isContact
                    ? "bg-neutral-800 text-[#c19b65]"
                    : "text-neutral-200 hover:bg-neutral-800 hover:text-[#c19b65]"
                }`}
              >
                Contact Us
              </Link>

              {/* Sign In / My Account */}
              <div className="pt-3 border-t border-neutral-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth("login");
                  }}
                  className="w-full text-left py-2.5 px-3 text-[#c19b65] hover:bg-neutral-800 rounded-xs uppercase tracking-wider text-xs font-semibold flex items-center justify-between"
                >
                  <span>Sign In / My Account</span>
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Footer Contact Action Bar */}
            <div className="p-4 border-t border-neutral-800 text-xs text-neutral-400 space-y-2 bg-neutral-950/80">
              <div className="flex items-center gap-2">
                <a
                  href="tel:01811496175"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xs text-xs font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c19b65]" />
                  <span>Call Hotline</span>
                </a>
                <a
                  href="https://wa.me/8801811496175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 rounded-xs text-xs font-medium transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
              <p className="text-[10px] text-center text-neutral-500 pt-1">
                Authentic Premium Panjabis • Izhaan Lifestyle
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

