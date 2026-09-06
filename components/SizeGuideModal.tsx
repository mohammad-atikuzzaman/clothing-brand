"use client";

import React from "react";
import { X, Ruler } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { PANJABI_SIZE_CHART } from "@/data/products";

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide } = useUIStore();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={closeSizeGuide}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white text-neutral-900 rounded-sm shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-[#161616] text-white">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#c19b65]" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-serif">
              Izhaan Panjabi Size Guide
            </h3>
          </div>
          <button
            onClick={closeSizeGuide}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
            All measurements below are given in <strong>inches</strong>. If you are between two sizes, we recommend choosing the larger size for a relaxed traditional fit.
          </p>

          <div className="overflow-x-auto border border-neutral-200 rounded-xs mb-6">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-800 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest</th>
                  <th className="py-2.5 px-3">Length</th>
                  <th className="py-2.5 px-3">Sleeve</th>
                  <th className="py-2.5 px-3">Collar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {PANJABI_SIZE_CHART.map((row) => (
                  <tr key={row.size} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-neutral-900 bg-neutral-50/50">
                      {row.size}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700">{row.chest}</td>
                    <td className="py-2.5 px-3 text-neutral-700">{row.length}</td>
                    <td className="py-2.5 px-3 text-neutral-700">{row.sleeve}</td>
                    <td className="py-2.5 px-3 text-neutral-700">{row.collar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200/80 rounded-xs p-3 text-[11px] text-amber-900 leading-relaxed">
            <strong>Need help with fitting?</strong> Feel free to WhatsApp us at <strong>01811-496175</strong> with your height and weight. Our sizing specialists will assist you instantly.
          </div>

          <button
            onClick={closeSizeGuide}
            className="w-full mt-5 bg-[#161616] text-white py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-[#c19b65] hover:text-black transition-colors rounded-xs"
          >
            Got It, Close
          </button>
        </div>
      </div>
    </div>
  );
};
