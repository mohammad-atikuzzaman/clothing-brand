import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer id="footer-section" className="bg-[#161616] text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div>
              <span className="text-2xl font-serif font-bold text-white tracking-[0.25em] uppercase block">
                IZHAAN
              </span>
              <span className="text-[9px] text-[#c19b65] tracking-[0.2em] font-light uppercase">
                Lifestyle
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Wear the heritage. Own the trend. Providing the finest quality Panjabi craftsmanship from Dhaka to the entirety of Bangladesh at reasonable prices.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://facebook.com"
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
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#c19b65] hover:text-black flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://wa.me"
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
              <li>
                <a href="#products-section" className="hover:text-white transition-colors">
                  Signature Line (এক্সক্লুসিভ)
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-white transition-colors">
                  Core Classics (ক্লাসিক কালেকশন)
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-white transition-colors">
                  Smart Casuals (ক্যাজুয়াল পাঞ্জাবি)
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-white transition-colors">
                  ZAQWAN Edition
                </a>
              </li>
              <li>
                <a href="#products-section" className="text-[#c19b65] hover:underline font-semibold">
                  Flat 50% Off Fest
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-neutral-800 pb-2">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c19b65]" />
                <span>100% Cash on Delivery</span>
              </li>
              <li>
                <a href="#about-section" className="hover:text-white transition-colors">
                  About Izhaan Lifestyle
                </a>
              </li>
              <li>
                <span className="text-neutral-500">Delivery Time: 24-48 Hours (Dhaka)</span>
              </li>
              <li>
                <span className="text-neutral-500">Delivery Time: 48-96 Hours (All BD)</span>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Return & Exchange Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-neutral-800 pb-2">
              Contact Us
            </h4>
            <div className="flex items-start space-x-3 text-xs text-neutral-400">
              <MapPin className="w-4 h-4 text-[#c19b65] flex-shrink-0 mt-0.5" />
              <span>Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-neutral-400">
              <Phone className="w-4 h-4 text-[#c19b65] flex-shrink-0" />
              <span>+880 1800-000000 / 01700-000000</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-neutral-400">
              <Mail className="w-4 h-4 text-[#c19b65] flex-shrink-0" />
              <span>support@izhaanlifestyle.com</span>
            </div>
            <div className="pt-2 text-[11px] text-neutral-400">
              Customer Support Hours: <br />
              <strong className="text-neutral-200">10:00 AM – 10:00 PM (Daily)</strong>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Izhaan Lifestyle. All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1 rounded-xs font-mono text-[11px]">
              Cash on Delivery Available
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
