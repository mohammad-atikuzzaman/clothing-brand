"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ShoppingBag } from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";
import { getProducts, SerializedProduct } from "@/actions/product";
import { useUIStore } from "@/store/useUIStore";
import { formatPrice } from "@/lib/utils";

interface SearchBarModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const SearchBarModal: React.FC<SearchBarModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  onSelectProduct,
}) => {
  const { isSearchOpen: storeIsOpen, closeSearch: storeCloseSearch, openQuickView } = useUIStore();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SerializedProduct[]>(PRODUCTS as any);

  React.useEffect(() => {
    getProducts().then((data) => {
      if (data && data.length > 0) setProducts(data);
    });
  }, []);

  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const onClose = propOnClose !== undefined ? propOnClose : storeCloseSearch;

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.fabric && p.fabric.toLowerCase().includes(q))
    );
  }, [query, products]);

  if (!isOpen) return null;

  const handleProductClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      openQuickView(product);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xs shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center gap-3 bg-[#161616] text-white">
          <Search className="w-5 h-5 text-[#c19b65]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Panjabi by name, category, or fabric..."
            className="flex-1 text-sm sm:text-base focus:outline-none bg-transparent text-white placeholder:text-neutral-500"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-neutral-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 bg-white">
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
                  onClick={() => handleProductClick(product)}
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
                      <span className="text-xs font-bold text-neutral-900">
                        {formatPrice(product.salePrice)}
                      </span>
                      <span className="text-[10px] text-neutral-400 line-through">
                        {formatPrice(product.regularPrice)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="p-2 text-neutral-400 hover:text-[#c19b65]"
                    title="View Product"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
