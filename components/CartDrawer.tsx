"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export const CartDrawer: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    isCartOpen,
    closeCart,
    openCheckout,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotalItems,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isCartOpen) return null;

  const subtotal = getSubtotal();
  const totalCount = getTotalItems();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 bg-[#161616] text-white flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#c19b65]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">
                Shopping Cart ({totalCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner notification */}
          <div className="bg-[#fcf8f2] border-b border-[#f3e7d5] px-4 py-2.5 flex items-center gap-2 text-xs text-[#8a652e]">
            <Truck className="w-4 h-4 flex-shrink-0" />
            <span>ক্যাশ অন ডেলিভারি (COD) সুবিধা রয়েছে সমগ্র বাংলাদেশে</span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-neutral-800">Your bag is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Discover our exclusive Eid & heritage Panjabi collections.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 bg-[#161616] text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-6 rounded-xs hover:bg-black transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map(({ product, size, quantity }) => (
                <div key={`${product.id}-${size}`} className="pt-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-neutral-100 rounded-xs overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(product.id, size)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-xs">
                          Size: {size}
                        </span>
                        <span className="text-xs font-bold text-neutral-900">
                          {product.salePrice.toLocaleString("en-US")}&nbsp;৳
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-300 rounded-xs text-xs">
                        <button
                          onClick={() => updateQuantity(product.id, size, quantity - 1)}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 font-semibold text-neutral-900 min-w-[24px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, size, quantity + 1)}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-neutral-900">
                        {(product.salePrice * quantity).toLocaleString("en-US")}&nbsp;৳
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout button */}
          {items.length > 0 && (
            <div className="border-t border-neutral-200 p-5 bg-neutral-50 space-y-4">
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {subtotal.toLocaleString("en-US")}&nbsp;৳
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Delivery Charge</span>
                  <span>Calculated at checkout (৳70 / ৳130)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full text-center bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-900 font-bold py-3 px-3 text-xs uppercase tracking-wider rounded-xs transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full text-center bg-[#161616] hover:bg-black text-white font-bold py-3 px-3 text-xs uppercase tracking-wider rounded-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c19b65]" />
                </Link>
              </div>

              <button
                onClick={closeCart}
                className="w-full text-center text-xs text-neutral-500 hover:text-neutral-900 font-medium py-1"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
