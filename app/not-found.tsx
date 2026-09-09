import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-16">
      <div className="max-w-md w-full text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c19b65] block mb-2">
          Page Not Found
        </span>
        <h1 className="text-6xl sm:text-7xl font-serif font-bold text-neutral-900 mb-4 tracking-tight">
          404
        </h1>
        <p className="text-sm text-neutral-600 mb-8 leading-relaxed">
          The requested page could not be found or may have moved. Explore our signature collection of luxury Panjabis.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#161616] hover:bg-black text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Shop</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
