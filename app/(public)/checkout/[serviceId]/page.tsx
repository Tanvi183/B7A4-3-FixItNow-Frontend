"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import Image from "next/image";
import { Calendar, Clock, Loader2, ShieldCheck, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const { user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (isHydrated && !user) {
      toast.error("Please log in to book a service");
      router.push("/login?redirect=/checkout/" + serviceId);
    }
  }, [user, isHydrated, router, serviceId]);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        const allServices = data.data || data;
        const found = allServices.find((s: any) => s.id === serviceId);
        if (!found) throw new Error("Service not found");
        setService(found);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Service not found");
      } finally {
        setLoading(false);
      }
    };
    if (serviceId) {
      fetchService();
    }
  }, [serviceId, router]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }

    try {
      setProcessing(true);
      const token = getCookie("accessToken");
      
      // 1. Create Booking in Backend
      const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId,
          bookingDate: new Date(date).toISOString(),
          timeSlot: time,
        })
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        throw new Error(bookingData.message || "Failed to create booking");
      }

      // Backend returns data in bookingData.data usually
      const bookingId = bookingData.data?.id || bookingData.id;
      
      if (!bookingId) {
        throw new Error("Invalid booking ID returned from server");
      }

      // Success handling
      toast.success("Request sent to Admin! You can pay once it is accepted.");
      router.push("/all-services");

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong during checkout");
      setProcessing(false);
    }
  };

  if (!isHydrated || (isHydrated && !user)) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (errorMsg || !service) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Oops!</h2>
        <p className="text-slate-600">{errorMsg || "Service could not be loaded."}</p>
        <button onClick={() => router.push("/all-services")} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Request Service</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b pb-4">Schedule Your Service</h2>
              
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" /> Select Date
                    </label>
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" /> Select Time Slot
                    </label>
                    <select 
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="">Choose a time slot</option>
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t mt-8">
                  <button 
                    type="submit" 
                    disabled={processing}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {processing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Submitting Request...</>
                    ) : (
                      <><ShieldCheck className="w-5 h-5" /> Submit Request to Admin</>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                    You will be able to pay securely once the admin accepts your request.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6 border-b pb-4">Order Summary</h3>
              
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden relative flex-shrink-0">
                  <Image src={"/cleaning.png"} alt="Service" fill style={{objectFit:"cover"}} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">{service?.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{service?.description?.substring(0, 50)}...</p>
                </div>
              </div>

              <div className="space-y-4 py-4 border-t border-b border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Base Price</span>
                  <span className="font-medium">${Number(service?.basePrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-blue-600">${Number(service?.basePrice).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
