"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { FiCheckCircle, FiArrowRight, FiDownload } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import { getCookie } from "@/stores/useAuthStore";
import toast from "react-hot-toast";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("bookingId");
  const [updating, setUpdating] = useState(true);

  useEffect(() => {
    // Optionally trigger a status update to your backend here to mark the booking as PAID
    // if your backend isn't using Stripe webhooks.
    const markAsPaid = async () => {
      if (!bookingId) return setUpdating(false);
      try {
        const token = getCookie("accessToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: "PAID" })
        });
        
        if (res.ok) {
          console.log("Booking marked as PAID successfully.");
        }
      } catch (err) {
        console.error("Failed to update booking status", err);
      } finally {
        setUpdating(false);
      }
    };

    if (sessionId) {
      markAsPaid();
    } else {
      setUpdating(false);
    }
  }, [sessionId, bookingId]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-[#1a1f35]">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-[#1e2340] dark:ring-white/10">
          
          {/* Header Area */}
          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 p-8 text-center text-white">
            <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -top-16 -left-16 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 shadow-inner backdrop-blur-md">
                <FiCheckCircle className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Payment Successful!</h1>
              <p className="mt-2 text-sm text-emerald-100">
                Your transaction has been processed securely.
              </p>
            </div>
          </div>

          {/* Body Area */}
          <div className="p-8">
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-black/20">
                <span className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</span>
                <span className="text-sm font-mono font-medium text-black dark:text-white truncate max-w-[150px]">
                  {sessionId ? sessionId.split('_')[1] : 'TRX-102934'}
                </span>
              </div>
              {bookingId && (
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-black/20">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Booking Ref</span>
                  <span className="text-sm font-mono font-medium text-black dark:text-white">
                    #{bookingId.slice(0, 8)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Link 
                href="/dashboard/customer" 
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3C50E0] to-[#6577F3] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#3C50E0]/20 hover:from-[#3C50E0]/90 hover:to-[#6577F3]/90 transition-all active:scale-95"
              >
                Go to Dashboard
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center dark:bg-[#1a1f35]"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3C50E0] border-t-transparent" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
