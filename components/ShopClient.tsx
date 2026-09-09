"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SerializedProduct } from "@/actions/product";
import { formatPrice } from "@/lib/utils";
import { SlidersHorizontal, ArrowUpDown, X, Star, Filter } from "lucide-react";

interface ShopClientProps {
  initialProducts: SerializedProduct[];
}

function ShopInner({ initialProducts }: ShopClientProps) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "All";

  const [products] = useState<SerializedProduct[]>(initialProducts);
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

  // Filtering products in-memory instantly without network hops
  const filteredProducts = useMemo(() => {
    let result = [...products];

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
  }, [products, selectedCategory, maxPrice, onlyInStock, sortBy]);

  const topRatedProducts = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 3),
    [products]
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
                className={`text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded-xs transition-all cursor-pointer ${
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
                      className={`w-full text-left py-1 flex items-center justify-between transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "text-[#c19b65] font-bold"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[11px] text-neutral-400">
                        ({cat === "All" ? products.length : products.filter((p) => p.category === cat).length})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter by Max Price */}
            <div className="border border-neutral-200 rounded-xs p-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                Filter by Price
              </h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min="900"
                  max="4000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#c19b65] cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs text-neutral-600 font-medium">
                  <span>Price: ৳990 — {formatPrice(maxPrice)}</span>
                </div>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="border border-neutral-200 rounded-xs p-5">
              <label className="flex items-center space-x-2 text-xs text-neutral-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded-xs border-neutral-300 text-[#c19b65] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-medium">In Stock Only</span>
              </label>
            </div>

            {/* Top Rated Showcase */}
            <div className="border border-neutral-200 rounded-xs p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 pb-2 border-b border-neutral-100">
                Top Rated Picks
              </h4>
              <div className="space-y-3">
                {topRatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="flex items-center space-x-3 group"
                  >
                    <div className="relative w-12 h-16 bg-neutral-100 flex-shrink-0 overflow-hidden rounded-xs border border-neutral-200">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-neutral-800 line-clamp-1 group-hover:text-[#c19b65] transition-colors">
                        {p.name}
                      </span>
                      <div className="flex items-center text-[#c19b65] text-[10px] my-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-neutral-900">
                        {formatPrice(p.salePrice)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Product Content */}
          <main className="lg:col-span-3">
            {/* Control Bar: Product Count, Mobile Filter Trigger, Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-neutral-200 gap-4">
              <div className="flex items-center space-x-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center space-x-2 text-xs font-bold uppercase tracking-wider bg-neutral-100 px-3.5 py-2 rounded-xs border border-neutral-200 hover:bg-neutral-200 transition-colors"
                >
                  <Filter className="w-3.5 h-3.5 text-[#c19b65]" />
                  <span>Filter Products</span>
                </button>

                <p className="text-xs text-neutral-500">
                  Showing <span className="font-bold text-neutral-900">{filteredProducts.length}</span>{" "}
                  of <span className="font-bold text-neutral-900">{products.length}</span> products
                </p>
              </div>

              {/* Active Filter Badges & Sort Selector */}
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center space-x-1 uppercase tracking-wider"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear Filters</span>
                  </button>
                )}

                {/* Sort dropdown */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-neutral-400 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort products"
                    className="text-xs border border-neutral-300 rounded-xs py-1.5 px-2 bg-white text-neutral-700 font-medium focus:outline-none focus:border-neutral-900 cursor-pointer"
                  >
                    <option value="featured">Featured Collection</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Customer Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-neutral-300 rounded-xs">
                <SlidersHorizontal className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-base font-serif font-bold text-neutral-800 uppercase tracking-wide">
                  No Panjabis matched your filter
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Try clearing some filters or changing your maximum budget to see our available collections.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 bg-[#161616] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#c19b65] hover:text-black transition-colors rounded-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer / Sheet */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-900">
                Filter Collections
              </span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-neutral-400 hover:text-black"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Categories */}
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-3 text-neutral-900">
                  Categories
                </h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left py-1 flex items-center justify-between ${
                        selectedCategory === cat ? "text-[#c19b65] font-bold" : "text-neutral-600"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[11px] text-neutral-400">
                        ({cat === "All" ? products.length : products.filter((p) => p.category === cat).length})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-3 text-neutral-900">
                  Max Price: {formatPrice(maxPrice)}
                </h4>
                <input
                  type="range"
                  min="900"
                  max="4000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#c19b65]"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="flex items-center space-x-2 text-neutral-700">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded-xs text-[#c19b65] focus:ring-0"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-neutral-200 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider border border-neutral-300 text-neutral-700 rounded-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-[#161616] text-white rounded-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ShopClient({ initialProducts }: ShopClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopInner initialProducts={initialProducts} />
    </Suspense>
  );
}
