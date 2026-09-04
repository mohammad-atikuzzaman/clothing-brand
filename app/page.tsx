"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductCard } from "@/components/ProductCard";
import { ProductQuickViewModal } from "@/components/ProductQuickViewModal";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { SearchBarModal } from "@/components/SearchBarModal";
import { CheckoutModal, OrderDetails } from "@/components/CheckoutModal";
import { OrderSuccessModal } from "@/components/OrderSuccessModal";
import { FeaturesStrip } from "@/components/FeaturesStrip";
import { AboutBrand } from "@/components/AboutBrand";
import { Footer } from "@/components/Footer";
import { PRODUCTS, Product } from "@/data/products";
import { SlidersHorizontal } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const categories = ["All", "Signature Line", "Core Classics", "Smart Casuals", "ZAQWAN"];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sticky Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* 3-Category Showcase */}
      <CategoryGrid
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        activeCategory={selectedCategory}
      />

      {/* Main Featured Products Section */}
      <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-1">
            Izhaan Exclusive Collection
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
            Featured Products
          </h2>
          <div className="w-12 h-0.5 bg-[#c19b65] mx-auto my-3"></div>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            A curated selection of Izhaan premium Panjabis where refined craftsmanship meets contemporary design.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded-xs transition-all ${
                selectedCategory === cat
                  ? "bg-[#161616] text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Count & Filter Bar */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6 text-xs text-neutral-500">
          <span>Showing {filteredProducts.length} items</span>
          <div className="flex items-center gap-1.5 font-medium text-neutral-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#c19b65]" />
            <span>{selectedCategory}</span>
          </div>
        </div>

        {/* Product Grid: 4 columns on large, 3 on md, 2 on sm */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 3-Column Features Strip */}
      <FeaturesStrip />

      {/* Brand Story */}
      <AboutBrand />

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <CartDrawer />

      <WishlistDrawer />

      <SearchBarModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      <CheckoutModal
        onOrderSuccess={(order) => setConfirmedOrder(order)}
      />

      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />
    </div>
  );
}
