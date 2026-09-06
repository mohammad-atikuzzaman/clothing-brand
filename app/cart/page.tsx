"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag, Truck, Tag, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    shippingArea,
    setShippingArea,
    getShippingCost,
    getTotal,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-neutral-400">
        Loading Cart...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === "IZHAAN100") {
      setDiscountAmount(100);
      toast.success("Coupon applied: ৳100 discount!");
    } else {
      toast.error("Invalid or expired coupon code.");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-[#161616] text-white py-10 sm:py-12 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] sm:text-xs font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-1">
            Review Your Selection
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold uppercase tracking-wider">
            Shopping Cart
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: "Cart", href: "/cart" }]} />

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mb-1">Your Cart is Currently Empty</h2>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              Before proceeding to checkout, you must add some items to your shopping cart. You will find lots of classic and festive Panjabis in our shop!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#161616] hover:bg-[#c19b65] hover:text-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-xs transition-colors"
            >
              <span>Return to Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-4">
            {/* Items Table (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Desktop Table View */}
              <div className="hidden sm:block border border-neutral-200 rounded-xs overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4 text-center">Quantity</th>
                      <th className="py-3.5 px-4 text-right">Subtotal</th>
                      <th className="py-3.5 px-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {items.map((item) => (
                      <tr key={`${item.product.id}-${item.size}`} className="hover:bg-neutral-50/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-18 bg-neutral-100 rounded-xs overflow-hidden flex-shrink-0 border border-neutral-200">
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/product/${item.product.slug}`}
                                className="font-bold text-neutral-900 hover:text-[#c19b65] transition-colors line-clamp-1"
                              >
                                {item.product.name}
                              </Link>
                              <span className="text-[11px] text-neutral-500 block mt-0.5">
                                Size: <strong className="text-neutral-800">{item.size}</strong>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-neutral-800">
                          {formatPrice(item.product.salePrice)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center border border-neutral-300 rounded-xs mx-auto w-24">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-neutral-900">
                          {formatPrice(item.product.salePrice * item.quantity)}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button
                            onClick={() => removeItem(item.product.id, item.size)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-3 p-3 border border-neutral-200 rounded-xs bg-neutral-50/50"
                  >
                    <div className="relative w-18 h-24 bg-neutral-100 rounded-xs overflow-hidden flex-shrink-0 border">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.product.id, item.size)}
                            className="text-neutral-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[11px] text-neutral-500">Size: {item.size}</span>
                        <div className="text-xs font-bold text-neutral-900 mt-1">
                          {formatPrice(item.product.salePrice)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-300 rounded-xs text-xs">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="px-2 py-0.5"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="px-2 py-0.5"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-bold text-[#c19b65]">
                          {formatPrice(item.product.salePrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Strip */}
              <div className="p-4 border border-neutral-200 rounded-xs flex flex-col sm:flex-row items-center gap-3 bg-neutral-50/30">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 flex-shrink-0">
                  <Tag className="w-4 h-4 text-[#c19b65]" />
                  <span>Promo Coupon:</span>
                </div>
                <form onSubmit={handleApplyCoupon} className="flex flex-1 w-full gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon (e.g. IZHAAN100)"
                    className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
                  >
                    Apply
                  </button>
                </form>
              </div>

              {/* Continue shopping link */}
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-neutral-600 hover:text-[#c19b65] transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Cart Totals Summary Box (4 cols) */}
            <div className="lg:col-span-4">
              <div className="border border-neutral-200 rounded-xs p-6 bg-neutral-50/70 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-3 font-serif">
                  Cart Totals
                </h3>

                {/* Subtotal */}
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* Coupon discount */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                {/* Shipping selector */}
                <div className="pt-2 border-t border-neutral-200">
                  <span className="text-xs font-bold text-neutral-800 block mb-2">
                    Shipping & Delivery Zone:
                  </span>
                  <div className="space-y-2 text-xs">
                    <label
                      onClick={() => setShippingArea("inside_dhaka")}
                      className={`flex items-center justify-between p-2.5 border rounded-xs cursor-pointer transition-colors ${
                        shippingArea === "inside_dhaka"
                          ? "border-[#c19b65] bg-white font-semibold shadow-xs"
                          : "border-neutral-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingArea === "inside_dhaka"}
                          onChange={() => setShippingArea("inside_dhaka")}
                          className="accent-[#c19b65]"
                        />
                        <span>Inside Dhaka (24-48h)</span>
                      </div>
                      <span className="font-bold">70 ৳</span>
                    </label>

                    <label
                      onClick={() => setShippingArea("outside_dhaka")}
                      className={`flex items-center justify-between p-2.5 border rounded-xs cursor-pointer transition-colors ${
                        shippingArea === "outside_dhaka"
                          ? "border-[#c19b65] bg-white font-semibold shadow-xs"
                          : "border-neutral-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingArea === "outside_dhaka"}
                          onChange={() => setShippingArea("outside_dhaka")}
                          className="accent-[#c19b65]"
                        />
                        <span>Outside Dhaka (48-96h)</span>
                      </div>
                      <span className="font-bold">130 ৳</span>
                    </label>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-neutral-900 uppercase">Total</span>
                  <span className="text-xl font-bold text-neutral-900">
                    {formatPrice(finalTotal)}
                  </span>
                </div>

                {/* Proceed button */}
                <Link
                  href="/checkout"
                  className="w-full bg-[#161616] hover:bg-black text-white py-3.5 px-4 text-xs font-bold uppercase tracking-widest rounded-xs flex items-center justify-center gap-2 transition-colors shadow-md mt-4"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#c19b65]" />
                </Link>

                <div className="pt-2 text-[11px] text-neutral-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c19b65]" />
                    <span>Cash on Delivery available on checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#c19b65]" />
                    <span>Rider inspection before payment permitted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
