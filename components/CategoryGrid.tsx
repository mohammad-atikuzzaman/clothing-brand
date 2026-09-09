"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/data/products";
import { SerializedCategory } from "@/actions/category";

interface CategoryGridProps {
  categories?: SerializedCategory[];
  onSelectCategory?: (category: string) => void;
  activeCategory?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories: propCategories,
  onSelectCategory,
  activeCategory,
}) => {
  const displayCategories =
    propCategories && propCategories.length > 0
      ? propCategories.slice(0, 3)
      : (CATEGORIES.slice(0, 3) as any[]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayCategories.map((category) => {
          const isSelected = activeCategory === category.name;
          return (
            <Link
              key={category.id || category.slug}
              href={`/product-category/${category.slug}`}
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(category.name);
                }
              }}
              className={`group relative h-64 sm:h-80 overflow-hidden rounded-xs border transition-all duration-300 block ${
                isSelected
                  ? "border-[#c19b65] shadow-lg ring-2 ring-[#c19b65]/50"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  loading="eager"
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6">
                <span className="text-[11px] font-semibold text-[#c19b65] uppercase tracking-widest mb-1">
                  {category.tagline || "Izhaan Exclusive"}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase tracking-wide group-hover:text-neutral-200 transition-colors">
                  {category.name}
                </h3>
                <div className="mt-3 flex items-center text-xs font-semibold uppercase tracking-wider text-neutral-300 group-hover:text-white">
                  <span>Explore Collection</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
