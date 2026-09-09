import React from "react";

export default function ShopLoading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner Skeleton */}
      <div className="bg-[#161616] py-14 border-b border-neutral-800 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-3 w-32 bg-neutral-800 rounded mx-auto mb-2" />
          <div className="h-8 w-64 bg-neutral-800 rounded mx-auto mb-3" />
          <div className="h-4 w-96 bg-neutral-800 rounded mx-auto" />
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col">
              <div className="aspect-[3/4] bg-neutral-100 rounded-xs mb-3" />
              <div className="h-3 w-16 bg-neutral-100 rounded mb-1.5" />
              <div className="h-4 w-full bg-neutral-100 rounded mb-2" />
              <div className="h-4 w-24 bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
