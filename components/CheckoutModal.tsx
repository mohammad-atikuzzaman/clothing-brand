"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, CheckCircle2, Shield, Truck, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryArea: "inside_dhaka" | "outside_dhaka";
  deliveryFee: number;
  subtotal: number;
  total: number;
  date: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

interface CheckoutModalProps {
  onOrderSuccess: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onOrderSuccess }) => {
  const { items, isCheckoutOpen, closeCheckout, clearCart, getSubtotal } = useCartStore();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const subtotal = getSubtotal();
  const deliveryFee = deliveryArea === "inside_dhaka" ? 70 : 130;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!customerName.trim()) {
      setError("অনুগ্রহ করে আপনার পুরো নাম লিখুন (Please enter your full name).");
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 11) {
      setError("অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (e.g. 017XXXXXXXX).");
      return;
    }

    if (!address.trim() || address.trim().length < 8) {
      setError("অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা লিখুন (বাসা নং, রোড, এলাকা, জেলা).");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `IZH-${Date.now().toString().slice(-6)}`;
      const orderData: OrderDetails = {
        orderId,
        customerName: customerName.trim(),
        phone: cleanPhone,
        address: address.trim(),
        deliveryArea,
        deliveryFee,
        subtotal,
        total,
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        items: items.map((item) => ({
          name: item.product.name,
          size: item.size,
          quantity: item.quantity,
          price: item.product.salePrice,
          image: item.product.image,
        })),
      };

      clearCart();
      closeCheckout();
      setIsSubmitting(false);
      onOrderSuccess(orderData);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white w-full max-w-2xl rounded-xs shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-[#161616] text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#c19b65] font-semibold tracking-widest uppercase">
              Fast Checkout
            </span>
            <h2 className="text-base font-bold font-serif uppercase tracking-wider">
              Cash on Delivery (ক্যাশ অন ডেলিভারি)
            </h2>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1 text-neutral-400 hover:text-white"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notice */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xs flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Customer info fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b pb-1">
              Customer & Delivery Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Full Name (আপনার নাম) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. মোঃ আসিফ রহমান"
                className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Mobile Number (মোবাইল নম্বর) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-black focus:outline-none"
                required
              />
            </div>

            {/* Delivery Area Selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                Delivery Area (ডেলিভারি এরিয়া) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`border p-3 rounded-xs flex flex-col cursor-pointer transition-all ${
                    deliveryArea === "inside_dhaka"
                      ? "border-[#161616] bg-neutral-50 ring-1 ring-[#161616]"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Inside Dhaka</span>
                    <input
                      type="radio"
                      name="deliveryArea"
                      checked={deliveryArea === "inside_dhaka"}
                      onChange={() => setDeliveryArea("inside_dhaka")}
                      className="accent-black"
                    />
                  </div>
                  <span className="text-xs text-[#c19b65] font-bold mt-1">৳ 70</span>
                  <span className="text-[10px] text-neutral-500">ঢাকার ভিতরে (1-2 Days)</span>
                </label>

                <label
                  className={`border p-3 rounded-xs flex flex-col cursor-pointer transition-all ${
                    deliveryArea === "outside_dhaka"
                      ? "border-[#161616] bg-neutral-50 ring-1 ring-[#161616]"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Outside Dhaka</span>
                    <input
                      type="radio"
                      name="deliveryArea"
                      checked={deliveryArea === "outside_dhaka"}
                      onChange={() => setDeliveryArea("outside_dhaka")}
                      className="accent-black"
                    />
                  </div>
                  <span className="text-xs text-[#c19b65] font-bold mt-1">৳ 130</span>
                  <span className="text-[10px] text-neutral-500">ঢাকার বাইরে (2-4 Days)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Delivery Address (সম্পূর্ণ ঠিকানা) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="বাসা নং, রোড নং, এলাকা, থানা ও জেলা..."
                className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xs focus:ring-1 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Order Notes (ঐচ্ছিক মন্তব্য)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="স্পেশাল কোনো নির্দেশনা থাকলে লিখুন"
                className="w-full text-xs px-3.5 py-2 border border-neutral-200 rounded-xs focus:ring-1 focus:ring-black focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="p-3.5 bg-neutral-100 rounded-xs border border-neutral-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-neutral-900 block">
                Cash on Delivery (ক্যাশ অন ডেলিভারি)
              </span>
              <p className="text-[11px] text-neutral-600 mt-0.5">
                অর্ডারের জন্য কোনো অগ্রিম টাকা দেওয়ার প্রয়োজন নেই। পণ্য হাতে পেয়ে ডেলিভারি ম্যানের কাছে মূল্য পরিশোধ করুন।
              </p>
            </div>
          </div>

          {/* Order Summary Breakdown */}
          <div className="border border-neutral-200 rounded-xs p-4 bg-neutral-50/70 space-y-2 text-xs">
            <span className="font-bold text-neutral-900 block uppercase tracking-wider text-[11px]">
              Order Summary ({items.length} items)
            </span>

            <div className="max-h-36 overflow-y-auto space-y-2 py-1 pr-1">
              {items.map((it) => (
                <div key={`${it.product.id}-${it.size}`} className="flex items-center justify-between text-neutral-700">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{it.quantity}x</span>
                    <span className="line-clamp-1">{it.product.name}</span>
                    <span className="text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded-xs">
                      {it.size}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {(it.product.salePrice * it.quantity).toLocaleString("en-US")}&nbsp;৳
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-2 space-y-1">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString("en-US")}&nbsp;৳</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Delivery Charge</span>
                <span>{deliveryFee.toLocaleString("en-US")}&nbsp;৳</span>
              </div>
              <div className="flex justify-between text-neutral-900 font-bold text-sm pt-1 border-t border-neutral-200">
                <span>Total Payable (সর্বমোট)</span>
                <span className="text-[#c19b65]">{total.toLocaleString("en-US")}&nbsp;৳</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#161616] hover:bg-black text-white font-bold py-3.5 px-4 text-xs uppercase tracking-widest rounded-xs transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <span>অর্ডার প্রসেস হচ্ছে...</span>
            ) : (
              <span>Confirm Order (অর্ডার নিশ্চিত করুন) - {total.toLocaleString("en-US")} ৳</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
