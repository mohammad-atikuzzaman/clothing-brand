import React from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShieldCheck, Truck, CreditCard, Banknote } from "lucide-react";

export const metadata = {
  title: "Payment Policy | Izhaan Lifestyle",
  description: "Payment and Cash on Delivery policy of Izhaan Lifestyle Panjabi.",
};

export default function PaymentPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="bg-[#161616] text-white py-12 border-b border-neutral-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-1">
            Safe & Convenient
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold uppercase tracking-wider">
            Payment Policy
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Payment Policy" }]} />

        <div className="mt-8 space-y-8 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          {/* Highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 border border-neutral-200 rounded-xs bg-neutral-50/50 flex items-start gap-3">
              <Banknote className="w-6 h-6 text-[#c19b65] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block text-sm">Cash on Delivery (COD)</strong>
                <p className="text-xs text-neutral-500 mt-1">
                  Pay cash directly to the courier delivery agent only after receiving your parcel at your doorstep.
                </p>
              </div>
            </div>

            <div className="p-5 border border-neutral-200 rounded-xs bg-neutral-50/50 flex items-start gap-3">
              <CreditCard className="w-6 h-6 text-[#c19b65] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block text-sm">bKash / Nagad Mobile Banking</strong>
                <p className="text-xs text-neutral-500 mt-1">
                  Available for customers wishing to pay digitally prior to or during delivery.
                </p>
              </div>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              1. Cash on Delivery (COD)
            </h2>
            <p>
              At Izhaan Lifestyle, Cash on Delivery is our default and most popular payment method across all 64 districts in Bangladesh. We believe in customer trust and convenience: you do not need to make any advance payments before placing your order.
            </p>
            <p>
              When the courier delivers your Panjabi, you may inspect the package and pay the exact invoice amount in cash to the rider.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              2. Shipping & Delivery Charges
            </h2>
            <p>
              Delivery charges are standardized nationwide:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Inside Dhaka City:</strong> ৳70 (Estimated delivery within 24 to 48 hours).</li>
              <li><strong>Outside Dhaka (All Bangladesh):</strong> ৳130 (Estimated delivery within 48 to 96 hours).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              3. Mobile Financial Services (bKash / Nagad)
            </h2>
            <p>
              If you prefer electronic payment via bKash or Nagad, you may complete the transaction to our official merchant or personal accounts. Always ensure your Order ID is provided as the transaction reference.
            </p>
            <p>
              For bKash payment assistance, contact our hotline directly at <strong>01811-496175</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              4. Order Cancellation Policy
            </h2>
            <p>
              Orders can be freely cancelled before they are dispatched from our Dhaka fulfillment center. Once a parcel is handed over to the courier partner, cancellation may incur courier return fees.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
