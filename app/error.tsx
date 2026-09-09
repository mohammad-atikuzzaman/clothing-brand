"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console and Sentry
    Sentry.captureException(error);
    console.error("Root Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-16">
      <div className="max-w-md w-full text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c19b65] block mb-2">
          System Notice
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mb-3 tracking-wide">
          Something went wrong
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mb-8 leading-relaxed">
          An unexpected error occurred while processing this request. Our engineering team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-[#161616] hover:bg-black text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
