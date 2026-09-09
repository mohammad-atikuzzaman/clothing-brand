import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-2 border-neutral-200 border-t-[#c19b65] rounded-full animate-spin mb-4" />
      <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
        Loading Izhaan Lifestyle...
      </span>
    </div>
  );
}
