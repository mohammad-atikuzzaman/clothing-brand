import React from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Izhaan Lifestyle",
  description: "Terms of service and 7-day hassle-free return and exchange policy of Izhaan Lifestyle.",
};

export default function TermsConditionsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="bg-[#161616] text-white py-12 border-b border-neutral-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-1">
            Fair & Transparent
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold uppercase tracking-wider">
            Terms & Return Policy
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Terms & Conditions" }]} />

        <div className="mt-8 space-y-8 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          {/* 7-day guarantee box */}
          <div className="p-6 border border-[#c19b65]/30 rounded-xs bg-[#c19b65]/5 space-y-2">
            <div className="flex items-center gap-2 text-[#c19b65] font-bold text-sm uppercase tracking-wider">
              <RefreshCw className="w-5 h-5" />
              <span>7-Day Hassle-Free Size Replacement Policy</span>
            </div>
            <p className="text-xs text-neutral-700">
              If your Panjabi size does not fit comfortably or if you receive a damaged piece, Izhaan Lifestyle offers a fast 7-day replacement guarantee across Bangladesh.
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              1. General Terms of Use
            </h2>
            <p>
              By accessing and placing orders through Izhaan Lifestyle (izhaanlifestyle.com), you agree to comply with our commercial terms and conditions. All content, imagery, and product designs on this site are intellectual property of Izhaan Lifestyle.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              2. Exchange Eligibility & Conditions
            </h2>
            <p>
              To qualify for a free or standard size exchange:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The Panjabi must be unworn, unwashed, and in its original pristine condition.</li>
              <li>Original tags, collar stays, and packaging must remain intact.</li>
              <li>Replacement claim must be initiated within 7 calendar days of parcel delivery.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              3. How to Initiate a Replacement
            </h2>
            <p>
              Simply send a WhatsApp message to our dedicated support hotline at <strong>01811-496175</strong> with your Order ID, a photo of the received item, and the replacement size required. Our team will arrange a reverse pickup or direct courier swap right at your doorstep.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              4. Damaged or Incorrect Item Claims
            </h2>
            <p>
              In the rare event that an item has a manufacturing fault or you receive an incorrect product, Izhaan Lifestyle will bear 100% of all return and replacement courier charges.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
