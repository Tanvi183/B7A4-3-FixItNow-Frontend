"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="flex items-center justify-center w-24 h-24 bg-red-50 text-red-500 rounded-full mb-8">
        <AlertOctagon size={48} strokeWidth={1.5} />
      </div>
      
      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
        Something went wrong!
      </h2>
      
      <p className="text-lg text-slate-500 max-w-md mx-auto mb-10">
        We encountered an unexpected error while processing your request. Please try again or return to the home page.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-slate-700 bg-slate-100 rounded-full hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
        >
          <Home size={18} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
