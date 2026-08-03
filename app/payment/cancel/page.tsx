import React from "react";
import Link from "next/link";
import { FiXCircle, FiArrowLeft, FiRefreshCw } from "react-icons/fi";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-[#1a1f35]">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-[#1e2340] dark:ring-white/10">
          
          {/* Header Area */}
          <div className="relative bg-gradient-to-br from-rose-500 to-red-600 p-8 text-center text-white">
            <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -top-16 -left-16 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 shadow-inner backdrop-blur-md">
                <FiXCircle className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Payment Cancelled</h1>
              <p className="mt-2 text-sm text-rose-100">
                Your transaction was not completed.
              </p>
            </div>
          </div>

          {/* Body Area */}
          <div className="p-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              It looks like you cancelled the checkout process. Don't worry, no charges were made to your account. You can safely try again whenever you're ready.
            </p>

            <div className="flex flex-col gap-3">
              <Link 
                href="/dashboard/customer" 
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 hover:from-rose-500/90 hover:to-red-600/90 transition-all active:scale-95"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
