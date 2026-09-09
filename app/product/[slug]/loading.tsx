import React from "react";

export default function ProductLoading() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
          {/* Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-neutral-100 rounded-xs" />
            <div className="grid grid-cols-4 gap-2">
              <div className="aspect-square bg-neutral-100 rounded-xs" />
              <div className="aspect-square bg-neutral-100 rounded-xs" />
              <div className="aspect-square bg-neutral-100 rounded-xs" />
              <div className="aspect-square bg-neutral-100 rounded-xs" />
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="space-y-5">
            <div className="h-4 w-24 bg-neutral-100 rounded" />
            <div className="h-8 w-3/4 bg-neutral-100 rounded" />
            <div className="h-6 w-32 bg-neutral-100 rounded" />
            <div className="h-20 w-full bg-neutral-100 rounded" />
            <div className="h-10 w-full bg-neutral-100 rounded" />
            <div className="h-12 w-full bg-neutral-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
