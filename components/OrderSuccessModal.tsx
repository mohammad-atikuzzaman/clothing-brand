"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle, PackageCheck, Truck, PhoneCall, X } from "lucide-react";
import { OrderDetails } from "./CheckoutModal";

interface OrderSuccessModalProps {
  order: OrderDetails | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white w-full max-w-lg rounded-xs shadow-2xl overflow-hidden my-6">
        {/* Top Banner */}
        <div className="bg-[#161616] text-white p-6 text-center border-b border-neutral-800">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="text-[10px] text-[#c19b65] uppercase tracking-widest font-semibold">
            Order Confirmed
          </span>
          <h2 className="text-xl font-serif font-bold mt-0.5">
            ধন্যবাদ, আপনার অর্ডারটি গ্রহণ করা হয়েছে!
          </h2>
          <p className="text-xs text-neutral-300 mt-1">
            Order ID: <span className="font-mono font-bold text-white">{order.orderId}</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Notice box */}
          <div className="p-3.5 bg-neutral-50 rounded-xs border border-neutral-200 flex items-start gap-3">
            <PhoneCall className="w-4 h-4 text-neutral-700 flex-shrink-0 mt-0.5" />
            <div className="text-neutral-700 space-y-0.5">
              <span className="font-bold text-neutral-900 block">ক্যাশ অন ডেলিভারি নিশ্চিতকরণ</span>
              <p className="text-[11px]">
                খুব শীঘ্রই আমাদের প্রতিনিধি <strong className="text-neutral-900">{order.phone}</strong> নম্বরে কল করে অর্ডারটি কনফার্ম করবেন।
              </p>
            </div>
          </div>

          {/* Delivery & Customer info */}
          <div className="border border-neutral-200 rounded-xs p-3.5 space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">গ্রাহকের নাম:</span>
              <span className="font-semibold text-neutral-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">মোবাইল নম্বর:</span>
              <span className="font-semibold text-neutral-900">{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">ডেলিভারি ঠিকানা:</span>
              <span className="font-medium text-neutral-800 text-right max-w-[240px]">
                {order.address}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">ডেলিভারি জোন:</span>
              <span className="font-semibold text-neutral-900">
                {order.deliveryArea === "inside_dhaka" ? "Inside Dhaka (৳70)" : "Outside Dhaka (৳130)"}
              </span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="border border-neutral-200 rounded-xs p-3.5 space-y-2">
            <span className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] block">
              Ordered Items
            </span>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-neutral-700">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">{it.quantity}x</span>
                    <span className="line-clamp-1">{it.name}</span>
                    <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded-xs font-semibold">
                      Size: {it.size}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {(it.price * it.quantity).toLocaleString("en-US")}&nbsp;৳
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-neutral-900 text-sm">
              <span>সর্বমোট প্রদেয় (COD Total):</span>
              <span className="text-[#c19b65]">{order.total.toLocaleString("en-US")}&nbsp;৳</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full bg-[#161616] hover:bg-black text-white font-bold py-3 px-4 text-xs uppercase tracking-wider rounded-xs transition-colors"
          >
            Continue Shopping (আরো কেনাকাটা করুন)
          </button>
        </div>
      </div>
    </div>
  );
};
