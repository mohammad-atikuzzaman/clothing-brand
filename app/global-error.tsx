"use client";

import React, { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c19b65] block mb-2">
            Critical Error
          </span>
          <h1 className="text-2xl font-bold mb-3">Application Encountered an Error</h1>
          <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
            We are unable to display this page right now. Please refresh the browser or try again in a few moments.
          </p>
          <button
            onClick={() => reset()}
            className="bg-[#161616] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer hover:bg-black transition-colors"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
