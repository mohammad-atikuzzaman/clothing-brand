"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ShieldCheck,
  Truck,
  RefreshCw,
  ExternalLink,
  Ruler,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Zap,
  CheckCircle2,
} from "lucide-react";
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
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const { addItem, openCart, openCheckout } = useCartStore();

  // Reset state on product change
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "40");
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [product]);

  // Lock background scroll and listen for Escape key
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [product, onClose]);

  if (!product) return null;

  // Prepare images list (fallback to main product image)
  const images =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : [product.image];

  const currentImage = images[activeImageIndex] || product.image;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    toast.success(`Added ${quantity}x ${product.name} (Size ${selectedSize}) to bag!`);
    onClose();
    openCart();
  };

  const handleBuyNowCOD = () => {
    addItem(product, selectedSize, quantity);
    onClose();
    openCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative bg-white w-full max-w-5xl max-h-[92vh] rounded-xs shadow-2xl z-10 flex flex-col md:flex-row overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-white/95 hover:bg-neutral-100 text-neutral-800 flex items-center justify-center shadow-md transition-all hover:scale-105 border border-neutral-200"
          aria-label="Close quick view"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: Image Showcase & Gallery */}
        <div className="w-full md:w-[48%] lg:w-[46%] bg-[#f9f8f6] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200 shrink-0">
          {/* Main Display Image */}
          <div className="relative aspect-[3/4] w-full max-h-[380px] md:max-h-[460px] rounded-xs overflow-hidden bg-neutral-200/60 shadow-xs group">
            <Image
              src={currentImage}
              alt={`${product.name} - View ${activeImageIndex + 1}`}
              fill
              priority
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 45vw"
            />

            {/* Discount Badge */}
            {product.discountPercentage > 0 && (
              <span className="absolute top-3 left-3 bg-[#c19b65] text-white font-bold text-xs px-2.5 py-1 rounded-xs shadow-md tracking-wider uppercase">
                {product.discountPercentage}% OFF
              </span>
            )}

            {/* Next/Prev Navigation Buttons (if multiple images) */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md transition-all hover:scale-110 opacity-90 hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md transition-all hover:scale-110 opacity-90 hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Counter indicator */}
                <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-xs tracking-wider">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Gallery Row */}
          {images.length > 1 && (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-18 sm:w-16 sm:h-20 rounded-xs overflow-hidden border-2 transition-all shrink-0 bg-neutral-200 ${
                    activeImageIndex === idx
                      ? "border-[#c19b65] ring-2 ring-[#c19b65]/40 shadow-xs scale-102"
                      : "border-neutral-300 opacity-60 hover:opacity-100 hover:border-neutral-400"
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <Image
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover object-top"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Full Product Information & Actions */}
        <div className="w-full md:w-[52%] lg:w-[54%] flex flex-col justify-between overflow-y-auto max-h-[92vh] p-5 sm:p-7 md:p-8 bg-white">
          <div className="space-y-4">
            {/* Top Meta: Category + SKU */}
            <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2">
              <span className="text-[11px] font-bold text-[#c19b65] uppercase tracking-[0.2em]">
                {product.category}
              </span>
              <span className="text-[11px] font-mono text-neutral-400 uppercase">
                SKU: {product.sku}
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-neutral-900 leading-tight">
                {product.name}
              </h2>

              {/* Rating and Reviews */}
              <div className="mt-2 flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-neutral-800">{product.rating.toFixed(1)}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-500">
                  ({product.reviewsCount} customer reviews)
                </span>
              </div>
            </div>

            {/* Price Row with Savings */}
            <div className="flex items-baseline flex-wrap gap-3 py-2 border-y border-neutral-100">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900">
                {formatPrice(product.salePrice)}
              </span>
              {product.regularPrice > product.salePrice && (
                <>
                  <span className="text-base sm:text-lg text-neutral-400 line-through">
                    {formatPrice(product.regularPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200">
                    Save {formatPrice(product.regularPrice - product.salePrice)}
                  </span>
                </>
              )}
            </div>

            {/* Stock Availability */}
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-emerald-800">
                In Stock — Available for Instant Delivery
              </span>
            </div>

            {/* Fabric & Fit Highlight Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-neutral-50 p-3 rounded-xs border border-neutral-200/70">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                  Fabric
                </span>
                <span className="font-semibold text-neutral-800">{product.fabric}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                  Fitting
                </span>
                <span className="font-semibold text-neutral-800">{product.fit}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
                Description
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Select Size:{" "}
                  <span className="text-[#c19b65] font-extrabold">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => openSizeGuide()}
                  className="inline-flex items-center gap-1 text-xs text-[#c19b65] hover:text-[#a07e4d] font-semibold hover:underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[46px] h-10 px-3.5 border text-xs font-bold rounded-xs transition-all flex items-center justify-center ${
                        isSelected
                          ? "border-[#161616] bg-[#161616] text-white shadow-sm"
                          : "border-neutral-300 text-neutral-700 bg-white hover:border-neutral-700 hover:text-black"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="pt-1 flex items-center gap-4">
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="inline-flex items-center border border-neutral-300 rounded-xs bg-neutral-50">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition-colors font-bold text-sm"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition-colors font-bold text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs & Guarantees */}
          <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2.5">
            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#161616] hover:bg-black text-white py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-all rounded-xs shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#c19b65] group-hover:scale-110 transition-transform" />
                <span>Add to Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNowCOD}
                className="w-full bg-[#c19b65] hover:bg-[#b08b56] text-black py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-all rounded-xs shadow-sm flex items-center justify-center gap-2 font-serif group cursor-pointer"
              >
                <Zap className="w-4 h-4 text-black group-hover:scale-110 transition-transform fill-black" />
                <span>Cash on Delivery (Buy Now)</span>
              </button>
            </div>

            {/* Direct Link to Full Product Page */}
            <div className="text-center pt-1">
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-semibold transition-colors py-1 group"
              >
                <span>View Complete Product Details & Full Sizing</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#c19b65] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-3 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center text-[10px] text-neutral-600">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-[#c19b65] mb-1" />
                <span className="font-semibold text-neutral-800">100% Original</span>
                <span className="text-neutral-400">Authentic Izhaan</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-[#c19b65] mb-1" />
                <span className="font-semibold text-neutral-800">Nationwide COD</span>
                <span className="text-neutral-400">Cash on Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-4 h-4 text-[#c19b65] mb-1" />
                <span className="font-semibold text-neutral-800">7 Days Return</span>
                <span className="text-neutral-400">Hassle-Free Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
