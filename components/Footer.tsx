"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, RefreshCw, Truck } from "lucide-react";
import { getCategories, SerializedCategory } from "@/actions/category";

export const Footer: React.FC = () => {
  const [categories, setCategories] = useState<SerializedCategory[]>([]);

  useEffect(() => {
    getCategories()
      .then((cats) => {
        if (Array.isArray(cats) && cats.length > 0) {
          setCategories(cats);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer id="footer-section" className="bg-[#161616] text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div>
              <Link href="/" className="inline-block">
                <span className="text-2xl font-serif font-bold text-white tracking-[0.25em] uppercase block">
                  IZHAAN
                </span>
                <span className="text-[9px] text-[#c19b65] tracking-[0.2em] font-light uppercase">
                  Lifestyle
                </span>
              </Link>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Wear the heritage. Own the trend. Providing the finest quality Panjabi craftsmanship from Dhaka to the entirety of Bangladesh at reasonable prices.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://www.facebook.com/izhaanclothing/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#c19b65] hover:text-black flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://m.me/izhaanclothing"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#0084FF] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Messenger"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.12 7.15.16.15.26.36.26.58v2.18c0 .61.64 1.01 1.19.74l2.45-1.19c.17-.08.36-.1.54-.05.77.21 1.59.32 2.44.32 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.09 13.06l-2.61-2.79-5.1 2.79 5.61-5.95 2.68 2.79 5.03-2.79-5.61 5.95z" />
                </svg>
              </a>
              <a
                href="https://wa.me/8801811496175"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-neutral-800 pb-2">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              {categories.length > 0 ? (
                categories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/product-category/${cat.slug}`}
                      className={`hover:text-[#c19b65] transition-colors ${
                        cat.slug.includes("990") ? "text-[#c19b65] font-semibold" : ""
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/product-category/signature-line" className="hover:text-[#c19b65] transition-colors">
                      Signature Line (এক্সক্লুসিভ)
                    </Link>
                  </li>
                  <li>
                    <Link href="/product-category/core-classics" className="hover:text-[#c19b65] transition-colors">
                      Core Classics (ক্লাসিক কালেকশন)
                    </Link>
                  </li>
                  <li>
                    <Link href="/product-category/smart-casuals" className="hover:text-[#c19b65] transition-colors">
                      Smart Casuals (ক্যাজুয়াল পাঞ্জাবি)
                    </Link>
                  </li>
                  <li>
                    <Link href="/product-category/zaqwan" className="hover:text-[#c19b65] transition-colors">
                      ZAQWAN Royal Edition
                    </Link>
                  </li>
                  <li>
                    <Link href="/product-category/price-990-999" className="text-[#c19b65] hover:underline font-semibold">
                      Price 990 – 999 Special Deal
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Useful Links / Customer Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-neutral-800 pb-2">
              Useful Links
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/about-us" className="hover:text-white transition-colors">
                  About Us (আমাদের সম্পর্কে)
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy (গোপনীয়তা নীতি)
                </Link>
              </li>
              <li>
                <Link href="/payment-policy" className="hover:text-white transition-colors">
                  Payment Policy (মূল্য পরিশোধ পদ্ধতি)
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-white transition-colors">
                  Terms & Conditions (শর্তাবলী ও রিটার্ন)
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  Contact Us (যোগাযোগ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-neutral-800 pb-2">
              Contact & Hours
            </h4>
            <div className="flex items-start space-x-3 text-xs text-neutral-400">
              <MapPin className="w-4 h-4 text-[#c19b65] flex-shrink-0 mt-0.5" />
              <span>Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-neutral-400">
              <Phone className="w-4 h-4 text-[#c19b65] flex-shrink-0" />
              <span>Phone: 01811-496175</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-neutral-400">
              <Mail className="w-4 h-4 text-[#c19b65] flex-shrink-0" />
              <span>izhaanlifestyle@gmail.com</span>
            </div>
            <div className="pt-2 text-[11px] text-neutral-400 space-y-1">
              <p>Customer Support Hours:</p>
              <p className="text-neutral-200 font-semibold">10:00 AM – 10:00 PM (Everyday)</p>
            </div>
          </div>
        </div>

        {/* Guarantees Row */}
        <div className="mt-10 py-6 border-y border-neutral-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#c19b65]" />
            <div>
              <p className="font-semibold text-white">100% Cash on Delivery</p>
              <p className="text-[11px] text-neutral-500">Pay after receiving the package</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#c19b65]" />
            <div>
              <p className="font-semibold text-white">Fast Nationwide Delivery</p>
              <p className="text-[11px] text-neutral-500">24-48h Dhaka, 48-96h Whole BD</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-[#c19b65]" />
            <div>
              <p className="font-semibold text-white">Easy 7-Day Exchange</p>
              <p className="text-[11px] text-neutral-500">Hassle-free size replacement</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Izhaan Lifestyle. All Rights Reserved.</p>
          <div className="flex items-center space-x-3 text-[11px]">
            <Link href="/privacy-policy" className="hover:text-neutral-300 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/payment-policy" className="hover:text-neutral-300 transition-colors">Payment</Link>
            <span>•</span>
            <Link href="/dmca" className="hover:text-neutral-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
