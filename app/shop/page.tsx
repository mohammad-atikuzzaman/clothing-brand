"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PRODUCTS, Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { SlidersHorizontal, ArrowUpDown, X, Star, Filter } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Update selectedCategory if URL parameter changes
  React.useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const categories = [
    "All",
    "Signature Line",
    "Core Classics",
    "Smart Casuals",
    "ZAQWAN",
    "Price 990 - 999",
  ];

  // Filtering products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory !== "All") {
      result = result.filter(
        (p) =>
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.categorySlug.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    result = result.filter((p) => p.salePrice <= maxPrice);

    if (onlyInStock) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.salePrice - a.salePrice);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, maxPrice, onlyInStock, sortBy]);

  const topRatedProducts = useMemo(
    () => [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 3),
    []
  );

  const resetFilters = () => {
    setSelectedCategory("All");
    setMaxPrice(4000);
    setOnlyInStock(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== "All" || maxPrice < 4000 || onlyInStock || sortBy !== "featured";

  return (
    <div className="bg-white min-h-screen">
      {/* Shop Page Banner */}
      <div className="bg-[#161616] text-white py-10 sm:py-14 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] sm:text-xs font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-1">
            Izhaan Men&apos;s Wear
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold uppercase tracking-wider">
            Shop All Collections
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-lg mx-auto">
            Explore authentic handcrafted Panjabis tailored with premium fabrics and impeccable placket details.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Shop", href: "/shop" }]} />

        {/* Category Horizontal Filter Bar */}
        <div className="border-b border-neutral-200 pb-4 mb-8 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded-xs transition-all ${
                  selectedCategory === cat
                    ? "bg-[#161616] text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8">
            {/* Filter by Category */}
            <div className="border border-neutral-200 rounded-xs p-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                Categories
              </h4>
              <ul className="space-y-2 text-xs">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left py-1 flex items-center justify-between transition-colors ${
                        selectedCategory === cat
                          ? "text-[#c19b65] font-bold"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[11px] text-neutral-400">
                        ({cat === "All" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat).length})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter by Price */}
            <div className="border border-neutral-200 rounded-xs p-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                Filter by Max Price
              </h4>
              <input
                type="range"
                min={990}
                max={4000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#c19b65] cursor-pointer"
              />
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 mt-3">
                <span>Min: 990 ৳</span>
                <span className="text-neutral-900 font-bold bg-neutral-100 px-2 py-1 rounded-xs">
                  Max: {formatPrice(maxPrice)}
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="border border-neutral-200 rounded-xs p-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-3 pb-2 border-b border-neutral-100">
                Availability
              </h4>
              <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded-xs accent-neutral-900"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Top Rated Showcase */}
            <div className="border border-neutral-200 rounded-xs p-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                Top Rated Panjabis
              </h4>
              <div className="space-y-3.5">
                {topRatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-12 h-16 relative bg-neutral-100 rounded-xs overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-neutral-800 group-hover:text-[#c19b65] truncate transition-colors">
                        {p.name}
                      </h5>
                      <div className="flex items-center gap-1 my-0.5 text-[#c19b65]">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold text-neutral-700">{p.rating}</span>
                      </div>
                      <span className="text-xs font-bold text-neutral-900">
                        {formatPrice(p.salePrice)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full py-2.5 border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 rounded-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </aside>

          {/* Main Products Grid Column */}
          <div className="lg:col-span-3">
            {/* Controls Bar (Filter toggle for mobile, results count, sorting) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4 mb-6">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-2 rounded-xs text-xs font-semibold"
                >
                  <Filter className="w-3.5 h-3.5 text-[#c19b65]" />
                  <span>Filters</span>
                </button>
                <span className="text-xs text-neutral-500">
                  Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> items
                </span>
              </div>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 hidden sm:inline">Sort By:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs font-semibold py-2 pl-3 pr-8 rounded-xs focus:outline-none focus:border-neutral-900 cursor-pointer"
                  >
                    <option value="featured">Featured / Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Average Rating</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center flex-wrap gap-2 mb-6">
                <span className="text-xs text-neutral-400 font-medium">Active:</span>
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-[11px] font-semibold px-2.5 py-1 rounded-xs">
                    {selectedCategory}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => setSelectedCategory("All")}
                    />
                  </span>
                )}
                {maxPrice < 4000 && (
                  <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-[11px] font-semibold px-2.5 py-1 rounded-xs">
                    ≤ {formatPrice(maxPrice)}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => setMaxPrice(4000)}
                    />
                  </span>
                )}
                {onlyInStock && (
                  <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-[11px] font-semibold px-2.5 py-1 rounded-xs">
                    In Stock
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => setOnlyInStock(false)}
                    />
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#c19b65] hover:underline font-semibold ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-neutral-100 rounded-xs bg-neutral-50/50">
                <SlidersHorizontal className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-neutral-900 mb-1">No Panjabis Found</h3>
                <p className="text-xs text-neutral-500 mb-6 max-w-sm mx-auto">
                  We couldn&apos;t find any products matching your current filters. Try changing category or price range.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#161616] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#c19b65] hover:text-black transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                <span className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Filter Products
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-neutral-500 hover:text-neutral-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category options */}
              <div className="mb-6">
                <h5 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-3">
                  Category
                </h5>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`block w-full text-left text-xs py-1.5 px-2 rounded-xs ${
                        selectedCategory === cat
                          ? "bg-[#161616] text-white font-bold"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="mb-6">
                <h5 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-2">
                  Max Price: {formatPrice(maxPrice)}
                </h5>
                <input
                  type="range"
                  min={990}
                  max={4000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#c19b65]"
                />
              </div>

              {/* In Stock */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-neutral-900"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-[#161616] text-white py-3 text-xs font-bold uppercase tracking-wider rounded-xs"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-500">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
