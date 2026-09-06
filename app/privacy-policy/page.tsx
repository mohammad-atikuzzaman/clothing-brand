import React from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = {
  title: "Privacy Policy | Izhaan Lifestyle",
  description: "Privacy and customer data protection policy of Izhaan Lifestyle.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="bg-[#161616] text-white py-12 border-b border-neutral-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-1">
            Customer Security
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold uppercase tracking-wider">
            Privacy Policy
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

        <div className="mt-8 space-y-6 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              1. Information We Collect
            </h2>
            <p>
              When you place an order with Izhaan Lifestyle (izhaanlifestyle.com), we collect information necessary to fulfill your Cash on Delivery parcel. This includes your full name, contact phone number, shipping address, and delivery city across Bangladesh.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              2. How We Use Your Information
            </h2>
            <p>
              We utilize customer details exclusively for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Processing, packaging, and dispatching your ordered Panjabis.</li>
              <li>SMS and telephone order confirmation by our verification agents.</li>
              <li>Handing over contact coordinates to our trusted courier delivery partners (Steadfast, Pathao, RedX, eCourier).</li>
              <li>Informing you regarding order tracking status or sizing replacements.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              3. Protection of Personal Data
            </h2>
            <p>
              Izhaan Lifestyle maintains strict confidentiality standards. We never sell, lease, or distribute our customer telephone numbers or shipping details to any third-party advertisers. All order logs are secured and encrypted.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
              4. Contact Regarding Privacy
            </h2>
            <p>
              If you have any questions or wish to request data removal, please contact our administrative team at <strong>izhaanlifestyle@gmail.com</strong> or WhatsApp us at <strong>01811-496175</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
