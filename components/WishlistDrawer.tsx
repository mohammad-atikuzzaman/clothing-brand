"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

export const WishlistDrawer: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { items, isWishlistOpen, closeWishlist, removeItem } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isWishlistOpen) return null;

  const handleMoveToCart = (product: (typeof items)[0]) => {
    addItem(product, product.sizes[0] || "40", 1);
    removeItem(product.id);
    toast.success(`Moved ${product.name} to your bag!`);
    closeWishlist();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 bg-[#161616] text-white flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-[#c19b65] fill-current" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">
                My Wishlist ({items.length})
              </h2>
            </div>
            <button
              onClick={closeWishlist}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-neutral-800">Your wishlist is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Save items you love to review them anytime or move them to your bag.
                </p>
                <button
                  onClick={closeWishlist}
                  className="mt-2 bg-[#161616] text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-6 rounded-xs hover:bg-black transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((product) => (
                <div key={product.id} className="pt-4 flex gap-4">
                  <div className="relative w-20 h-24 bg-neutral-100 rounded-xs overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[11px] text-neutral-400 line-through">
                          {product.regularPrice.toLocaleString("en-US")} ৳
                        </span>
                        <span className="text-xs font-bold text-neutral-900">
                          {product.salePrice.toLocaleString("en-US")} ৳
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="mt-2 w-full bg-[#161616] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider py-2 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#c19b65]" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-neutral-200 p-4 bg-neutral-50">
              <Link
                href="/wishlist"
                onClick={closeWishlist}
                className="w-full block text-center bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-900 font-bold py-2.5 px-3 text-xs uppercase tracking-wider rounded-xs transition-colors"
              >
                View Full Wishlist Page
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
