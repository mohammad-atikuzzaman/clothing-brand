"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/fpixel";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  Phone,
  MapPin,
  User,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

import { createOrder } from "@/actions/order";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const { items, clearCart, shippingArea, setShippingArea, getSubtotal, getShippingCost, getTotal } =
    useCartStore();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmed order state
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    customerName: string;
    phone: string;
    address: string;
    total: number;
    shippingCost: number;
    items: typeof items;
  } | null>(null);

  const hasTrackedCheckout = useRef(false);
  const hasTrackedPurchase = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track Meta Pixel InitiateCheckout once
  useEffect(() => {
    if (mounted && items.length > 0 && !hasTrackedCheckout.current && !confirmedOrder) {
      hasTrackedCheckout.current = true;
      try {
        trackEvent("InitiateCheckout", {
          num_items: items.reduce((acc, i) => acc + i.quantity, 0),
          value: getTotal(),
          currency: "BDT",
          content_type: "product",
          content_ids: items.map((i) => i.product.id),
        });
      } catch {
        // Non-blocking
      }
    }
  }, [mounted, items, confirmedOrder, getTotal]);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-neutral-400">
        Loading Checkout...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const grandTotal = getTotal();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    // BD Phone validation
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(cleanPhone)) {
      toast.error("Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX).");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter your full delivery address.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrder({
        customerName: fullName,
        phone: cleanPhone,
        address,
        district,
        notes: orderNotes,
        paymentMethod,
        shippingArea,
        items: items.map((it) => ({
          productId: it.product.id,
          name: it.product.name,
          slug: it.product.slug,
          image: it.product.image,
          price: it.product.salePrice,
          selectedSize: it.size,
          quantity: it.quantity,
        })),
      });

      if (!res.success || !res.order) {
        toast.error(res.error || "Failed to place order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setConfirmedOrder({
        orderId: res.order.orderId,
        customerName: res.order.customerName,
        phone: res.order.phone,
        address: `${res.order.address}, ${res.order.district}`,
        total: res.order.total,
        shippingCost: res.order.shippingCost,
        items: [...items],
      });

      // Trigger Client-side Meta Pixel Purchase event
      // Uses the identical orderId as eventID for 100% deduplication with server CAPI
      if (!hasTrackedPurchase.current) {
        hasTrackedPurchase.current = true;
        try {
          trackEvent(
            "Purchase",
            {
              value: res.order.total,
              currency: "BDT",
              order_id: res.order.orderId,
              num_items: res.order.items.reduce((acc, it) => acc + it.quantity, 0),
              content_type: "product",
              content_ids: res.order.items.map((it) => it.productId),
            },
            res.order.orderId
          );
        } catch {
          // Non-blocking
        }
      }

      clearCart();
      toast.success(`Order placed successfully! Order ID: ${res.order.orderId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmed Screen
  if (confirmedOrder) {
    return (
      <div className="bg-white min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="border border-neutral-200 rounded-xs p-6 sm:p-10 text-center bg-neutral-50/50 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold text-[#c19b65] uppercase tracking-widest block mb-1">
              Thank You! Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
              Order #{confirmedOrder.orderId}
            </h1>
            <p className="text-xs text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">
              Your Cash on Delivery order has been successfully placed. Our customer executive will call you shortly to confirm before dispatch.
            </p>

            {/* Receipt Box */}
            <div className="mt-8 border border-neutral-200 rounded-xs bg-white text-left p-5 text-xs space-y-3">
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2">
                Order Summary
              </h4>

              <div className="space-y-2">
                {confirmedOrder.items.map((it) => (
                  <div key={`${it.product.id}-${it.size}`} className="flex justify-between items-center">
                    <span className="text-neutral-700">
                      {it.product.name} (Size {it.size}) × {it.quantity}
                    </span>
                    <span className="font-bold text-neutral-900">
                      {formatPrice(it.product.salePrice * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-100 pt-3 space-y-1.5 text-neutral-600">
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span>{formatPrice(confirmedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900 text-sm pt-1 border-t border-neutral-100">
                  <span>Total Payable (COD):</span>
                  <span className="text-[#c19b65]">{formatPrice(confirmedOrder.total)}</span>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-3 text-[11px] text-neutral-500 space-y-1">
                <p><strong>Customer:</strong> {confirmedOrder.customerName}</p>
                <p><strong>Phone:</strong> {confirmedOrder.phone}</p>
                <p><strong>Address:</strong> {confirmedOrder.address}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="bg-[#161616] hover:bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
              >
                Continue Shopping
              </Link>
              <a
                href={`https://wa.me/8801811496175?text=Hello%20Izhaan%20Lifestyle,%20I%20placed%20Order%20%23${confirmedOrder.orderId}%20for%20BDT%20${confirmedOrder.total}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cart Empty redirect option
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">No items in your cart to checkout</h2>
        <p className="text-xs text-neutral-500 mb-6">Please add Panjabis to your shopping cart first.</p>
        <Link
          href="/shop"
          className="bg-[#161616] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xs"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-[#161616] text-white py-10 sm:py-12 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] sm:text-xs font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-1">
            Cash on Delivery Available Nationwide
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold uppercase tracking-wider">
            Checkout & Shipping
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: "Cart", href: "/cart" },
            { label: "Checkout", href: "/checkout" },
          ]}
        />

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-4">
          {/* Customer Details & Delivery Options (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border border-neutral-200 rounded-xs p-6 bg-white space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-3 font-serif flex items-center gap-2">
                <User className="w-4 h-4 text-[#c19b65]" />
                <span>Customer & Delivery Details</span>
              </h3>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mohammad Rahim"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Mobile Number (11 Digits) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-semibold">+88</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-11 pr-3 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Delivery rider will call this number prior to arrival.
                </span>
              </div>

              {/* Delivery District */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Delivery City / District <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    if (e.target.value === "Dhaka") {
                      setShippingArea("inside_dhaka");
                    } else {
                      setShippingArea("outside_dhaka");
                    }
                  }}
                  className="w-full px-3 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 bg-white"
                >
                  <option value="Dhaka">Dhaka City (Inside Dhaka - ৳70)</option>
                  <option value="Gazipur">Gazipur (Outside Dhaka - ৳130)</option>
                  <option value="Narayanganj">Narayanganj (Outside Dhaka - ৳130)</option>
                  <option value="Chittagong">Chittagong (Outside Dhaka - ৳130)</option>
                  <option value="Sylhet">Sylhet (Outside Dhaka - ৳130)</option>
                  <option value="Rajshahi">Rajshahi (Outside Dhaka - ৳130)</option>
                  <option value="Khulna">Khulna (Outside Dhaka - ৳130)</option>
                  <option value="Barisal">Barisal (Outside Dhaka - ৳130)</option>
                  <option value="Rangpur">Rangpur (Outside Dhaka - ৳130)</option>
                  <option value="Mymensingh">Mymensingh (Outside Dhaka - ৳130)</option>
                  <option value="Other">Other District across Bangladesh (৳130)</option>
                </select>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Full Street Address (House, Road, Area, Landmark) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 12, Road 5, Block B, Banani, Dhaka"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Order Notes (Optional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Special instructions for delivery (e.g. Deliver after 3 PM)"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            {/* Delivery Fee Method */}
            <div className="border border-neutral-200 rounded-xs p-6 bg-white space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-3 font-serif flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#c19b65]" />
                <span>Shipping Zone</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label
                  onClick={() => setShippingArea("inside_dhaka")}
                  className={`p-3 border rounded-xs cursor-pointer flex flex-col justify-between transition-colors ${
                    shippingArea === "inside_dhaka"
                      ? "border-[#c19b65] bg-neutral-50/70 font-semibold ring-1 ring-[#c19b65]"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingArea === "inside_dhaka"}
                      onChange={() => setShippingArea("inside_dhaka")}
                      className="accent-[#c19b65]"
                    />
                    <span>Inside Dhaka</span>
                  </div>
                  <span className="text-[11px] text-neutral-500">24-48 Hours Delivery</span>
                  <span className="font-bold text-neutral-900 mt-1">70 ৳</span>
                </label>

                <label
                  onClick={() => setShippingArea("outside_dhaka")}
                  className={`p-3 border rounded-xs cursor-pointer flex flex-col justify-between transition-colors ${
                    shippingArea === "outside_dhaka"
                      ? "border-[#c19b65] bg-neutral-50/70 font-semibold ring-1 ring-[#c19b65]"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingArea === "outside_dhaka"}
                      onChange={() => setShippingArea("outside_dhaka")}
                      className="accent-[#c19b65]"
                    />
                    <span>Outside Dhaka</span>
                  </div>
                  <span className="text-[11px] text-neutral-500">48-96 Hours Nationwide</span>
                  <span className="font-bold text-neutral-900 mt-1">130 ৳</span>
                </label>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="border border-neutral-200 rounded-xs p-6 bg-white space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-3 font-serif flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#c19b65]" />
                <span>Payment Method</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                {/* COD Option */}
                <label
                  className={`p-3.5 border rounded-xs flex items-start gap-3 cursor-pointer transition-colors ${
                    paymentMethod === "cod"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:bg-neutral-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-neutral-900 mt-0.5"
                  />
                  <div>
                    <strong className="text-neutral-900 block">
                      Cash on Delivery (ক্যাশ অন ডেলিভারি)
                    </strong>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Pay cash to the delivery agent when your Panjabi arrives at your doorstep.
                    </p>
                  </div>
                </label>

                {/* bKash Option */}
                <label
                  className={`p-3.5 border rounded-xs flex items-start gap-3 cursor-pointer transition-colors ${
                    paymentMethod === "bkash"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:bg-neutral-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                    className="accent-neutral-900 mt-0.5"
                  />
                  <div>
                    <strong className="text-neutral-900 block">bKash / Nagad / Online Pay</strong>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Pay via bKash Merchant account: 01811-496175 (Send Money/Payment).
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="border border-neutral-200 rounded-xs p-6 bg-neutral-50/70 space-y-4 sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-3 font-serif">
                Your Order ({items.reduce((s, i) => s + i.quantity, 0)} Items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={`${it.product.id}-${it.size}`} className="flex items-center gap-3 text-xs">
                    <div className="relative w-12 h-16 bg-neutral-100 rounded-xs overflow-hidden flex-shrink-0 border">
                      <Image src={it.product.image} alt={it.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-neutral-900 truncate">{it.product.name}</h4>
                      <p className="text-[11px] text-neutral-500">
                        Size: <strong>{it.size}</strong> × {it.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-neutral-900">
                      {formatPrice(it.product.salePrice * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation Rows */}
              <div className="border-t border-neutral-200 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-neutral-900">{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between items-baseline font-bold text-neutral-900 text-base pt-2 border-t border-neutral-200">
                  <span>Grand Total</span>
                  <span className="text-xl text-[#c19b65]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#161616] hover:bg-black text-white py-4 px-4 text-xs font-bold uppercase tracking-widest rounded-xs flex items-center justify-center gap-2 transition-colors shadow-md mt-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Place Order (Cash on Delivery)</span>
                    <ArrowRight className="w-4 h-4 text-[#c19b65]" />
                  </>
                )}
              </button>

              {/* Guarantees */}
              <div className="pt-2 text-[11px] text-neutral-500 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c19b65]" />
                  <span>100% Genuine Izhaan products</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#c19b65]" />
                  <span>Parcel check allowed upon delivery</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
