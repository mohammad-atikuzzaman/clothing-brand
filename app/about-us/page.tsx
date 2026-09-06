import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShieldCheck, Award, HeartHandshake, Sparkles, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us | Izhaan Lifestyle",
  description: "Learn about Izhaan Lifestyle - Wear the heritage, own the trend. Dedicated to bringing finest premium Panjabis across Bangladesh.",
};

export default function AboutUsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#161616] text-white py-14 sm:py-20 border-b border-neutral-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-2">
            The Izhaan Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-wider">
            About Izhaan Lifestyle
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-3 max-w-xl mx-auto leading-relaxed">
            Wear the heritage. Own the trend. Providing timeless Panjabi craftsmanship from Dhaka to every corner of Bangladesh.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "About Us" }]} />

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-10">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-[#c19b65] uppercase tracking-widest block">
              Our Vision & Craft
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-neutral-900 leading-tight">
              Where Bengali Tradition Meets Modern Refinement
            </h2>
            <div className="w-12 h-0.5 bg-[#c19b65] my-2" />
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Izhaan Lifestyle was founded with a singular ambition: to redefine ethnic elegance for the modern Bangladeshi gentleman. In a fast-paced world, the Panjabi remains our proudest cultural emblem — a symbol of identity, grace, and spiritual joy.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              From our flagship signature jacquards to pure combed breathable cottons, every fiber is selected for its drape, durability, and skin-comfort. We believe high-grade tailoring should not be a luxury reserved for a few, but an accessible pride for everyone across Bangladesh.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-neutral-200 shadow-md">
              <Image
                src="https://izhaanlifestyle.com/wp-content/uploads/2025/12/3.jpg"
                alt="Izhaan Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Brand Pillars */}
        <div className="my-16 py-12 border-y border-neutral-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold text-[#c19b65] uppercase tracking-widest block mb-1">
              Why Choose Izhaan
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 uppercase">
              The Izhaan Distinction
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-neutral-50 rounded-xs border border-neutral-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase">Artisanal Tailoring</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Handcrafted band collars, hidden placket finishes, and custom metallic buttons.
              </p>
            </div>

            <div className="p-6 bg-neutral-50 rounded-xs border border-neutral-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase">Premium Combed Yarns</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Breathable fabrics engineered specifically for comfort in Bangladesh&apos;s climate.
              </p>
            </div>

            <div className="p-6 bg-neutral-50 rounded-xs border border-neutral-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase">Cash on Delivery</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                100% transparent shopping with parcel inspection before paying the courier.
              </p>
            </div>

            <div className="p-6 bg-neutral-50 rounded-xs border border-neutral-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center mx-auto mb-3">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase">Customer First</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                7 days replacement guarantee and dedicated WhatsApp customer service.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-[#161616] text-white p-8 sm:p-12 rounded-xs text-center my-12">
          <h3 className="text-xl sm:text-3xl font-serif font-bold uppercase tracking-wider mb-2">
            Ready to Own the Trend?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mb-6">
            Explore our Signature Line and Core Classics collections today with flat 50% festive offers.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#c19b65] hover:bg-[#af8b55] text-black px-6 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xs transition-colors shadow-md"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
