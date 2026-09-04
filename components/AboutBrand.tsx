import React from "react";
import Image from "next/image";

export const AboutBrand: React.FC = () => {
  return (
    <section id="about-section" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image side */}
          <div className="relative aspect-[4/3] rounded-xs overflow-hidden shadow-lg border border-neutral-200">
            <Image
              src="https://izhaanlifestyle.com/wp-content/uploads/2025/12/3.jpg"
              alt="Izhaan Craftsmanship"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xs text-white px-4 py-2 text-xs uppercase tracking-widest font-semibold border-l-2 border-[#c19b65]">
              Handcrafted in Bangladesh
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-5">
            <span className="text-xs font-bold text-[#c19b65] uppercase tracking-[0.25em] block">
              About Izhaan Lifestyle
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-neutral-900 leading-tight">
              Wear The Heritage. <br />
              Own The Trend.
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Izhaan Lifestyle was created with a singular vision: to celebrate the timeless elegance of authentic Bangladeshi ethnic menswear while tailoring it for contemporary lifestyle and refined taste.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Every Panjabi in our Signature, Core Classic, and Smart Casual ranges is crafted from handpicked combed cotton, breathable jacquards, and premium blended fabrics. Finished with subtle embroidery and precision tailoring, each piece guarantees royal comfort for your daily routines, Friday prayers, or grand festive celebrations.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 border-t border-neutral-100">
              <div>
                <span className="text-2xl font-serif font-bold text-neutral-900 block">50,000+</span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider">Satisfied Customers</span>
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-neutral-900 block">64 Districts</span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider">Nationwide Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
