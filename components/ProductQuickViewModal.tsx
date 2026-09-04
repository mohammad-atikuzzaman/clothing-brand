"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("40");
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem, openCart, openCheckout } = useCartStore();

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "40");
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    toast.success(`Added ${quantity}x ${product.name} (${selectedSize}) to bag!`);
    onClose();
    openCart();
  };

  const handleBuyNowCOD = () => {
    addItem(product, selectedSize, quantity);
    onClose();
    openCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xs shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Column */}
        <div className="relative aspect-[3/4] md:h-full bg-neutral-100 min-h-[320px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {product.discountPercentage > 0 && (
            <span className="absolute top-4 left-4 bg-[#c19b65] text-white font-bold text-xs w-11 h-11 rounded-full flex items-center justify-center shadow-md">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Product Information Column */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#c19b65] uppercase tracking-widest">
              {product.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 mt-1">
              {product.name}
            </h2>

            {/* Price Row */}
            <div className="mt-3 flex items-center space-x-3">
              <span className="text-sm text-neutral-400 line-through">
                {product.regularPrice.toLocaleString("en-US")}&nbsp;৳
              </span>
              <span className="text-2xl font-bold text-neutral-900">
                {product.salePrice.toLocaleString("en-US")}&nbsp;৳
              </span>
              <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-xs">
                Save {(product.regularPrice - product.salePrice).toLocaleString("en-US")} ৳
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 mt-4 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="mt-4 pt-4 border-t border-neutral-100 space-y-1 text-xs text-neutral-600">
              <p>
                <strong className="text-neutral-900">Fabric:</strong> {product.fabric}
              </p>
              <p>
                <strong className="text-neutral-900">Fit:</strong> {product.fit}
              </p>
              <p>
                <strong className="text-neutral-900">Payment:</strong> Cash on Delivery (ক্যাশ অন ডেলিভারি)
              </p>
            </div>

            {/* Size Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Select Size (Panjabi)
                </span>
                <span className="text-[11px] text-neutral-500">Regular Standard</span>
              </div>
              <div className="flex gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-10 border rounded-xs text-xs font-bold transition-all ${
                      selectedSize === size
                        ? "border-[#161616] bg-[#161616] text-white shadow-sm"
                        : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-5 flex items-center space-x-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Quantity:
              </span>
              <div className="flex items-center border border-neutral-300 rounded-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-semibold text-neutral-900 min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-5 border-t border-neutral-200 flex flex-col gap-2.5">
            <button
              onClick={handleAddToCart}
              className="w-full bg-neutral-900 hover:bg-black text-white py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
            >
              Add to Bag (Size {selectedSize})
            </button>
            <button
              onClick={handleBuyNowCOD}
              className="w-full bg-[#c19b65] hover:bg-[#b08b55] text-black font-bold py-3 px-4 text-xs uppercase tracking-wider rounded-xs transition-colors"
            >
              Buy Now (Cash on Delivery)
            </button>

            {/* Trust badges */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-neutral-500 text-center pt-2">
              <div className="flex flex-col items-center">
                <Truck className="w-3.5 h-3.5 mb-1 text-neutral-700" />
                <span>Fast Nationwide Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-3.5 h-3.5 mb-1 text-neutral-700" />
                <span>100% Original Heritage</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-3.5 h-3.5 mb-1 text-neutral-700" />
                <span>Easy Size Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
