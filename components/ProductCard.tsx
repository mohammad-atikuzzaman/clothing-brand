"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Eye, Check } from "lucide-react";
import { Product } from "@/data/products";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "40");
  const [showSizes, setShowSizes] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    if (!inWishlist) {
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.info(`${product.name} removed from wishlist.`);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showSizes && product.sizes.length > 1) {
      setShowSizes(true);
      return;
    }
    addItem(product, selectedSize, 1);
    toast.success(`Added ${product.name} (Size: ${selectedSize}) to Bag!`, {
      action: {
        label: "View Bag",
        onClick: () => openCart(),
      },
    });
    setShowSizes(false);
  };

  return (
    <div className="group flex flex-col bg-white border border-neutral-100 hover:border-neutral-300 transition-all duration-300 rounded-xs overflow-hidden">
      {/* Product Image Box */}
      <div
        className="relative w-full aspect-[3/4] bg-neutral-100 overflow-hidden cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-[#c19b65] text-white font-bold text-xs w-11 h-11 rounded-full flex items-center justify-center shadow-md">
            -{product.discountPercentage}%
          </div>
        )}

        {/* Quick Action Floating Buttons (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleWishlistToggle}
            className={`w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
              inWishlist ? "text-red-500 hover:bg-red-50" : "text-neutral-700 hover:text-black"
            }`}
            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Size Selector Overlay on Hover */}
        {showSizes && (
          <div
            className="absolute inset-x-0 bottom-0 bg-black/90 p-3 flex flex-col items-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[10px] text-neutral-300 uppercase tracking-widest mb-2 font-medium">
              Select Size
            </span>
            <div className="flex gap-2 mb-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-8 h-8 rounded-xs text-xs font-semibold flex items-center justify-center transition-colors ${
                    selectedSize === size
                      ? "bg-[#c19b65] text-black font-bold"
                      : "bg-neutral-800 text-white hover:bg-neutral-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={handleQuickAdd}
              className="w-full bg-white hover:bg-neutral-200 text-black py-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Add to Bag (Size {selectedSize})
            </button>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between text-center">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
            {product.category}
          </span>
          <h3
            onClick={() => onQuickView(product)}
            className="text-sm font-semibold text-neutral-900 mt-1 hover:text-[#c19b65] cursor-pointer line-clamp-1 transition-colors"
          >
            {product.name}
          </h3>

          {/* Pricing in BDT */}
          <div className="mt-2 flex items-center justify-center space-x-2">
            <span className="text-xs text-neutral-400 line-through">
              {product.regularPrice.toLocaleString("en-US")}&nbsp;৳
            </span>
            <span className="text-sm font-bold text-neutral-900">
              {product.salePrice.toLocaleString("en-US")}&nbsp;৳
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#161616] hover:bg-neutral-800 text-white py-2.5 px-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center space-x-1.5 rounded-xs"
          >
            <span>{showSizes ? `Confirm Size ${selectedSize}` : "Select Options"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
