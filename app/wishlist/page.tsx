"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/data/products";
import { toast } from "sonner";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-neutral-400">
        Loading Wishlist...
      </div>
    );
  }

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0] || "40";
    addItem(product, size, 1);
    toast.success(`Added ${product.name} (Size: ${size}) to Bag!`);
    openCart();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#161616] text-white py-10 sm:py-12 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] sm:text-xs font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-1">
            Saved Favorites
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold uppercase tracking-wider">
            My Wishlist
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: "Wishlist", href: "/wishlist" }]} />

        {items.length === 0 ? (
          /* Empty Wishlist State */
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mb-1">Your Wishlist is Empty</h2>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              You haven&apos;t added any products to your wishlist yet. You will find a lot of interesting Panjabis on our &ldquo;Shop&rdquo; page.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#161616] hover:bg-[#c19b65] hover:text-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-xs transition-colors"
            >
              <span>Explore Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Wishlist Table */
          <div className="border border-neutral-200 rounded-xs overflow-hidden mt-4">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-bold uppercase tracking-wider hidden sm:table-header-group">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Size Selection</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                  <th className="py-3.5 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {items.map((product) => {
                  const currentSize = selectedSizes[product.id] || product.sizes[0] || "40";
                  return (
                    <tr
                      key={product.id}
                      className="flex flex-col sm:table-row p-4 sm:p-0 hover:bg-neutral-50/50"
                    >
                      {/* Product details */}
                      <td className="sm:py-4 sm:px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-20 bg-neutral-100 rounded-xs overflow-hidden flex-shrink-0 border border-neutral-200">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/product/${product.slug}`}
                              className="font-bold text-neutral-900 hover:text-[#c19b65] transition-colors"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mt-0.5">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="mt-2 sm:mt-0 sm:py-4 sm:px-4">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-neutral-900">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-[11px] text-neutral-400 line-through">
                            {formatPrice(product.regularPrice)}
                          </span>
                        </div>
                      </td>

                      {/* Size picker */}
                      <td className="mt-2 sm:mt-0 sm:py-4 sm:px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {product.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSizeSelect(product.id, sz)}
                              className={`w-7 h-7 text-[11px] font-bold rounded-xs border transition-colors ${
                                currentSize === sz
                                  ? "border-[#161616] bg-[#161616] text-white"
                                  : "border-neutral-300 text-neutral-700 hover:border-neutral-700"
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </td>

                      {/* Stock Status */}
                      <td className="mt-2 sm:mt-0 sm:py-4 sm:px-4">
                        <span className="text-emerald-600 font-semibold text-xs">
                          In Stock
                        </span>
                      </td>

                      {/* Add to bag action */}
                      <td className="mt-3 sm:mt-0 sm:py-4 sm:px-4 sm:text-center">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#161616] hover:bg-black text-white px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#c19b65]" />
                          <span>Add to Bag</span>
                        </button>
                      </td>

                      {/* Remove from wishlist */}
                      <td className="mt-2 sm:mt-0 sm:py-4 sm:px-2 text-right">
                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                          title="Remove from Wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
