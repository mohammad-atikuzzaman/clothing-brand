"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShieldCheck, Truck, RefreshCw, ExternalLink, Ruler } from "lucide-react";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface ProductQuickViewModalProps {
  product?: Product | null;
  onClose?: () => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product: propProduct,
  onClose: propOnClose,
}) => {
  const { quickViewProduct, closeQuickView, openSizeGuide } = useUIStore();
  const product = propProduct !== undefined ? propProduct : quickViewProduct;
  const onClose = propOnClose !== undefined ? propOnClose : closeQuickView;

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
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xs shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 animate-in fade-in zoom-in-95 duration-200">
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
                {formatPrice(product.regularPrice)}
              </span>
              <span className="text-2xl font-bold text-neutral-900">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-xs">
                Save {formatPrice(product.regularPrice - product.salePrice)}
              </span>
            </div>

            {/* Brief description */}
            <p className="mt-3 text-xs text-neutral-600 leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Select Size:
                </span>
                <button
                  type="button"
                  onClick={() => openSizeGuide()}
                  className="flex items-center gap-1 text-xs text-[#c19b65] hover:underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[42px] h-10 px-3 border text-xs font-semibold rounded-xs transition-all ${
                      selectedSize === size
                        ? "border-[#161616] bg-[#161616] text-white"
                        : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="mt-5 flex items-center space-x-4">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-neutral-300 rounded-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 space-y-2.5">
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#161616] hover:bg-neutral-800 text-white py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors rounded-xs"
            >
              Add to Bag
            </button>
            <button
              onClick={handleBuyNowCOD}
              className="w-full bg-[#c19b65] hover:bg-[#b08b56] text-black py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors rounded-xs shadow-sm"
            >
              Cash on Delivery (Buy Now)
            </button>

            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <span>View Full Details & Sizing</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Guarantees */}
            <div className="pt-4 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center text-[10px] text-neutral-500">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-[#c19b65] mb-1" />
                <span>Original Product</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-[#c19b65] mb-1" />
                <span>Nationwide COD</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-4 h-4 text-[#c19b65] mb-1" />
                <span>7 Days Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
