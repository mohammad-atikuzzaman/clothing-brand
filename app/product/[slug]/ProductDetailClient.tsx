"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/fpixel";
import {
  Heart,
  ShieldCheck,
  Truck,
  RefreshCw,
  Ruler,
  Star,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { PANJABI_SIZE_CHART } from "@/data/products";
import { SerializedProduct } from "@/actions/product";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useUIStore } from "@/store/useUIStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface ProductDetailClientProps {
  product: SerializedProduct;
  relatedProducts: SerializedProduct[];
  prevProduct?: SerializedProduct | null;
  nextProduct?: SerializedProduct | null;
}

export function ProductDetailClient({
  product,
  relatedProducts,
  prevProduct,
  nextProduct,
}: ProductDetailClientProps) {
  const router = useRouter();

  const { addItem, openCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { openSizeGuide } = useUIStore();

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.length > 0 ? product.sizes[0] : "40"
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"desc" | "size" | "delivery" | "reviews">("desc");

  const inWishlist = isInWishlist(product.id);

  // Meta Pixel ViewContent tracking
  useEffect(() => {
    try {
      trackEvent("ViewContent", {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        content_type: "product",
        value: product.salePrice || product.regularPrice,
        currency: "BDT",
      });
    } catch {
      // Non-blocking
    }
  }, [product.id, product.name, product.category, product.salePrice, product.regularPrice]);

  // Gallery image list (combining main image and gallery images)
  const images =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : [product.image];

  const handleAddToCart = () => {
    addItem(product as any, selectedSize, quantity);
    toast.success(`Added ${quantity}x ${product.name} (Size: ${selectedSize}) to Bag!`);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(product as any, selectedSize, quantity);
    router.push("/checkout");
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product as any);
    if (!inWishlist) {
      toast.success(`${product.name} added to Wishlist!`);
    } else {
      toast.info(`${product.name} removed from Wishlist.`);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Top bar with Breadcrumbs & Next/Prev Navigation */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3 mb-6">
          <Breadcrumbs
            items={[
              { label: "Shop", href: "/shop" },
              { label: product.category, href: `/product-category/${product.categorySlug}` },
              { label: product.name },
            ]}
          />

          <div className="hidden sm:flex items-center space-x-3 text-xs text-neutral-500">
            {prevProduct && (
              <Link
                href={`/product/${prevProduct.slug}`}
                className="flex items-center hover:text-[#c19b65] transition-colors"
                title={`Previous: ${prevProduct.name}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </Link>
            )}
            {nextProduct && (
              <Link
                href={`/product/${nextProduct.slug}`}
                className="flex items-center hover:text-[#c19b65] transition-colors"
                title={`Next: ${nextProduct.name}`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Product Showcase: Left Gallery, Right Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery Column (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[580px] scrollbar-none flex-shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 sm:w-20 aspect-[3/4] rounded-xs overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === img
                        ? "border-[#c19b65] shadow-xs"
                        : "border-neutral-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} preview ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Stage */}
            <div className="relative flex-1 aspect-[3/4] max-h-[620px] bg-neutral-100 rounded-xs overflow-hidden border border-neutral-200">
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Discount Badge */}
              {product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-[#c19b65] text-white font-bold text-xs w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                  -{product.discountPercentage}%
                </div>
              )}

              {/* Share & Wishlist overlay buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={handleWishlistToggle}
                  className={`w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center transition-colors ${
                    inWishlist ? "text-red-500" : "text-neutral-700 hover:text-black"
                  }`}
                  aria-label="Toggle Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
                  aria-label="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Details Column (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <Link
                  href={`/product-category/${product.categorySlug}`}
                  className="font-bold text-[#c19b65] uppercase tracking-widest hover:underline"
                >
                  {product.category}
                </Link>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-neutral-900 mt-2 tracking-wide">
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-700">
                  {product.rating} ({product.reviewsCount} customer reviews)
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs text-emerald-600 font-semibold">
                  {product.inStock ? "In Stock (Nationwide Delivery)" : "Out of Stock"}
                </span>
              </div>

              {/* Price Display */}
              <div className="mt-5 p-4 bg-neutral-50 rounded-xs border border-neutral-100 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-neutral-900">
                  {formatPrice(product.salePrice)}
                </span>
                {product.regularPrice > product.salePrice && (
                  <>
                    <span className="text-base text-neutral-400 line-through">
                      {formatPrice(product.regularPrice)}
                    </span>
                    <span className="ml-auto text-xs bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-xs uppercase tracking-wider">
                      Save {formatPrice(product.regularPrice - product.salePrice)} ({product.discountPercentage}% Off)
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              {/* Quick specs */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs py-3 border-y border-neutral-100">
                <div>
                  <span className="text-neutral-400 font-medium">Fabric: </span>
                  <span className="text-neutral-800 font-semibold">{product.fabric}</span>
                </div>
                <div>
                  <span className="text-neutral-400 font-medium">Fit Type: </span>
                  <span className="text-neutral-800 font-semibold">{product.fit}</span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Select Size:
                  </span>
                  <button
                    type="button"
                    onClick={() => openSizeGuide()}
                    className="flex items-center gap-1.5 text-xs text-[#c19b65] hover:underline font-semibold"
                  >
                    <Ruler className="w-4 h-4" />
                    <span>View Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-11 px-4 border text-xs font-bold rounded-xs transition-all ${
                        selectedSize === size
                          ? "border-[#161616] bg-[#161616] text-white shadow-xs"
                          : "border-neutral-300 text-neutral-800 hover:border-neutral-900 bg-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-neutral-300 rounded-xs bg-white w-32 justify-between">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-12 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="font-semibold text-neutral-900 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-12 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-[#161616] hover:bg-black disabled:bg-neutral-400 text-white py-3.5 px-6 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4 text-[#c19b65]" />
                  <span>{product.inStock ? "Add to Bag" : "Out of Stock"}</span>
                </button>

                {/* Buy Now (Direct Checkout) */}
                {product.inStock && (
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#c19b65] hover:bg-[#af8b55] text-black py-3.5 px-6 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-colors shadow-md font-sans cursor-pointer"
                  >
                    <span>Buy Now (Cash on Delivery)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Highlights & Guarantees */}
              <div className="mt-8 p-4 bg-neutral-50 rounded-xs border border-neutral-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <Truck className="w-4 h-4 text-[#c19b65] flex-shrink-0" />
                  <span><strong>Delivery:</strong> Inside Dhaka ৳70 (24-48 hrs), Outside Dhaka ৳130 (48-96 hrs)</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <ShieldCheck className="w-4 h-4 text-[#c19b65] flex-shrink-0" />
                  <span><strong>Cash on Delivery:</strong> Pay cash after receiving your Panjabi</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <RefreshCw className="w-4 h-4 text-[#c19b65] flex-shrink-0" />
                  <span><strong>Exchange:</strong> 7 days hassle-free size replacement support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Product Details: Description, Size Chart, Delivery, Reviews */}
        <div className="mt-16 sm:mt-20 border-t border-neutral-200 pt-10">
          <div className="flex items-center justify-center border-b border-neutral-200 pb-0 flex-wrap gap-4 sm:gap-8">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === "desc"
                  ? "border-[#c19b65] text-neutral-900"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Description & Craft
            </button>
            <button
              onClick={() => setActiveTab("size")}
              className={`pb-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === "size"
                  ? "border-[#c19b65] text-neutral-900"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Size Chart (ইঞ্চি)
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`pb-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === "delivery"
                  ? "border-[#c19b65] text-neutral-900"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Delivery & Returns
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === "reviews"
                  ? "border-[#c19b65] text-neutral-900"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Reviews ({product.reviewsCount})
            </button>
          </div>

          <div className="py-8 max-w-4xl mx-auto text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {activeTab === "desc" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
                  About {product.name}
                </h3>
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                  <div className="bg-neutral-50 p-4 rounded-xs">
                    <strong className="block text-neutral-900 mb-1">Fabric Composition</strong>
                    <p className="text-xs">{product.fabric}. Designed to maintain luster and breathability.</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-xs">
                    <strong className="block text-neutral-900 mb-1">Care & Wash</strong>
                    <p className="text-xs">Dry wash or delicate gentle machine wash with mild detergent. Do not bleach.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "size" && (
              <div>
                <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wide mb-3">
                  Panjabi Size Chart (Inches)
                </h3>
                <div className="overflow-x-auto border border-neutral-200 rounded-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-800 font-bold uppercase">
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-4">Chest</th>
                        <th className="py-3 px-4">Length</th>
                        <th className="py-3 px-4">Sleeve</th>
                        <th className="py-3 px-4">Collar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {PANJABI_SIZE_CHART.map((row) => (
                        <tr key={row.size} className="hover:bg-neutral-50">
                          <td className="py-3 px-4 font-bold text-neutral-900">{row.size}</td>
                          <td className="py-3 px-4">{row.chest}</td>
                          <td className="py-3 px-4">{row.length}</td>
                          <td className="py-3 px-4">{row.sleeve}</td>
                          <td className="py-3 px-4">{row.collar}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
                  Shipping & Return Policy
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-xs">
                  <li><strong>Dhaka City Delivery:</strong> 24 to 48 Hours. Delivery Charge: ৳70.</li>
                  <li><strong>Outside Dhaka Delivery:</strong> 48 to 96 Hours (Nationwide Courier). Delivery Charge: ৳130.</li>
                  <li><strong>Cash on Delivery (COD):</strong> Check your parcel in front of the courier rider before payment.</li>
                  <li><strong>7-Day Replacement:</strong> If size does not fit, contact us immediately on WhatsApp for an effortless replacement.</li>
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-neutral-50 p-6 rounded-xs border border-neutral-100">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-neutral-900">{product.rating}</span>
                    <div className="flex text-amber-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-0.5 block">Overall Score</span>
                  </div>
                  <div className="h-12 w-px bg-neutral-200 mx-2" />
                  <p className="text-xs text-neutral-600">
                    &ldquo;100% genuine buyer reviews. Izhaan Lifestyle ensures supreme fabric quality and immaculate placket embroidery on every single Panjabi.&rdquo;
                  </p>
                </div>

                {/* Sample reviews */}
                <div className="space-y-4 pt-2">
                  <div className="border-b border-neutral-100 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-800 text-xs">Tanvir Ahmed</span>
                      <span className="text-[11px] text-neutral-400">Verified Buyer • Dhaka</span>
                    </div>
                    <div className="flex text-amber-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Excellent fitting and fabric feel! Wore it to Jummah prayer and got multiple compliments. The metallic button detail is sublime.
                    </p>
                  </div>
                  <div className="border-b border-neutral-100 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-800 text-xs">Shafiqul Islam</span>
                      <span className="text-[11px] text-neutral-400">Verified Buyer • Chittagong</span>
                    </div>
                    <div className="flex text-amber-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Delivery was super fast via COD. Size 42 fit me perfectly as per their size chart. Will definitely buy another from Signature line!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-neutral-200 pt-12 pb-6">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[10px] font-bold text-[#c19b65] uppercase tracking-widest block mb-1">
                Matching Recommendations
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 uppercase">
                Related Products
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
