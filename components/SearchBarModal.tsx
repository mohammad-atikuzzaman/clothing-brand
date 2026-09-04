"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, X, ShoppingBag } from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";

interface SearchBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchBarModal: React.FC<SearchBarModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xs shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Panjabi by name, category, or fabric..."
            className="flex-1 text-sm sm:text-base focus:outline-none text-neutral-900 placeholder:text-neutral-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-neutral-400 hover:text-neutral-600 px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-800"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              Type to search through our latest ethnic collections...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              No products found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2 rounded-xs border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <div className="relative w-14 h-18 bg-neutral-100 rounded-xs overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#c19b65] font-semibold uppercase tracking-wider block">
                      {product.category}
                    </span>
                    <h4 className="text-xs font-bold text-neutral-900 truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-neutral-400 line-through">
                        {product.regularPrice.toLocaleString("en-US")} ৳
                      </span>
                      <span className="text-xs font-bold text-neutral-900">
                        {product.salePrice.toLocaleString("en-US")} ৳
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
