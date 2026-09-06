"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-5 z-40 flex flex-col items-end">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-3 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* WhatsApp */}
          <a
            href="https://wa.me/8801811496175?text=Hello%20Izhaan%20Lifestyle,%20I%20would%20like%20to%20inquire%20about%20a%20Panjabi."
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-full shadow-lg text-xs font-semibold tracking-wide transition-all transform hover:scale-105"
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              💬
            </span>
            <span>WhatsApp Us</span>
          </a>

          {/* Facebook Messenger */}
          <a
            href="https://m.me/izhaanclothing"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 bg-[#0084FF] hover:bg-[#0074E0] text-white px-3.5 py-2.5 rounded-full shadow-lg text-xs font-semibold tracking-wide transition-all transform hover:scale-105"
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold">
              ⚡
            </span>
            <span>Facebook Messenger</span>
          </a>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-[#161616] border border-[#c19b65] text-[#c19b65] hover:bg-[#c19b65] hover:text-black shadow-xl flex items-center justify-center transition-all transform hover:scale-105 focus:outline-none"
        aria-label="Contact Support via Chat"
        title="Need Help? Chat with us"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
        )}
      </button>
    </div>
  );
};
