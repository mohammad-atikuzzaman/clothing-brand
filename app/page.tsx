"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductCard } from "@/components/ProductCard";
import { FeaturesStrip } from "@/components/FeaturesStrip";
import { AboutBrand } from "@/components/AboutBrand";
import { PRODUCTS, getProductsByCategory } from "@/data/products";
import { SlidersHorizontal, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter products by selected category for the main interactive grid
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const categories = [
    "All",
    "Signature Line",
    "Core Classics",
    "Smart Casuals",
    "ZAQWAN",
    "Price 990 - 999",
  ];

  const signatureProducts = useMemo(() => getProductsByCategory("Signature Line").slice(0, 4), []);
  const coreClassicProducts = useMemo(() => getProductsByCategory("Core Classics").slice(0, 4), []);

  return (
    <div className="bg-white">
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
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-8">
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#161616] hover:bg-[#c19b65] hover:text-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xs shadow-md group"
          >
            <span>Explore Entire Shop</span>
            <ArrowRight className="w-4 h-4 text-[#c19b65] group-hover:text-black group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Signature Line Spotlight Row (Woodmart / Izhaan Style) */}
      <section className="bg-neutral-50 py-12 sm:py-16 border-y border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#c19b65] uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Luxury Collection</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 uppercase">
                Signature Line Panjabis
              </h3>
            </div>
            <Link
              href="/product-category/signature-line"
              className="mt-3 sm:mt-0 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-[#c19b65] flex items-center gap-1 group"
            >
              <span>View All Signature</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {signatureProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Core Classics Spotlight Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-xs font-bold text-[#c19b65] uppercase tracking-widest block mb-1">
              Everyday Elegance
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 uppercase">
              Core Classics Edition
            </h3>
          </div>
          <Link
            href="/product-category/core-classics"
            className="mt-3 sm:mt-0 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-[#c19b65] flex items-center gap-1 group"
          >
            <span>View All Classics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {coreClassicProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4-Column Features Strip */}
      <FeaturesStrip />

      {/* Brand Story */}
      <AboutBrand />
    </div>
  );
}
