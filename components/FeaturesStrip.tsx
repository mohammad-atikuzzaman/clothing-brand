import React from "react";
import { Sparkles, Compass, ShieldCheck } from "lucide-react";

export const FeaturesStrip: React.FC = () => {
  const features = [
    {
      number: "01.",
      title: "PREMIUM QUALITY",
      desc: "Carefully curated fabrics with intricate embroideries and bespoke finishing.",
      icon: Sparkles,
    },
    {
      number: "02.",
      title: "MODERN YET TRADITIONAL",
      desc: "Wear the heritage. Own the trend. Designed for timeless elegance and comfort.",
      icon: Compass,
    },
    {
      number: "03.",
      title: "CASH ON DELIVERY",
      desc: "Check your product at your doorstep and pay safely nationwide across Bangladesh.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="border-t border-b border-neutral-200 bg-neutral-50/70 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-start space-x-4">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#c19b65]">
                  {f.number}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs sm:text-sm font-bold tracking-wider text-neutral-900 uppercase">
                      {f.title}
                    </h4>
                    <Icon className="w-4 h-4 text-neutral-500" />
                  </div>
                  <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
