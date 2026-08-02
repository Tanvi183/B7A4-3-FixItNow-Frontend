"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  CalendarClock, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Clock, 
  Search,
  Filter,
  Loader2,
  Star
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

// Helper to get cookies manually
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
    case "REQUESTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-200">
          <Clock size={12} /> Pending
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 size={12} /> Completed
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-rose-50 text-rose-600 border border-rose-200">
          <XCircle size={12} /> Cancelled
        </span>
      );
    case "AWAITING_PAYMENT":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-200">
          <CreditCard size={12} /> Payment Due
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
          {status}
        </span>
      );
  }
};

export default function CustomerDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = getCookie("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [bookingsRes, reviewsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, { headers })
        ]);

        const bookingsData = await bookingsRes.json();
        const reviewsData = await reviewsRes.json();

        if (bookingsData.success) setBookings(bookingsData.data);
        if (reviewsData.success) setReviews(reviewsData.data);

      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBookings = bookings.filter(booking => 
    booking.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-heading">My Dashboard</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Manage your service bookings and reviews.</p>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-800 font-heading">Recent Bookings</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full sm:w-64 shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto min-h-[250px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">Service & ID</th>
                    <th className="px-6 py-4">Technician</th>
                    <th className="px-6 py-4">Schedule</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-lg">
                              {booking.service?.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{booking.service?.name}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{booking.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-700 font-medium">
                            {booking.service?.technician?.user?.name || "Pending Assign"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-[13px] text-slate-600 font-medium">
                            <span className="flex items-center gap-1.5"><CalendarClock size={14} className="text-slate-400" /> {format(new Date(booking.bookingDate), "MMM dd, yyyy")}</span>
                            <span className="text-slate-500 text-[11px] ml-5 mt-0.5">{booking.timeSlot}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">${Number(booking.totalAmount).toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {booking.status === "AWAITING_PAYMENT" && (
                              <button className="px-3 py-1.5 bg-blue-600 text-white text-[11px] uppercase tracking-wider font-bold rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                                Pay Now
                              </button>
                            )}
                            {booking.status === "REQUESTED" && (
                              <button className="px-3 py-1.5 bg-white border border-slate-200 text-rose-600 text-[11px] uppercase tracking-wider font-bold rounded-md hover:bg-rose-50 transition-colors">
                                Cancel
                              </button>
                            )}
                            {booking.status === "COMPLETED" && (
                              <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[11px] uppercase tracking-wider font-bold rounded-md hover:bg-slate-50 transition-colors">
                                Leave Review
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <CalendarClock size={32} className="mb-2 opacity-50" />
                          <p className="text-sm font-medium text-slate-600">No bookings found</p>
                          <p className="text-xs mt-1">You haven't made any service bookings yet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 font-heading">My Reviews</h2>
          
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">{review.booking?.service?.name || "Service"}</p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={14} 
                          className={star <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
                  <p className="text-[11px] text-slate-400 mt-auto pt-3 border-t border-slate-100">
                    Reviewed on {format(new Date(review.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center text-slate-400">
              <Star size={32} className="mb-2 opacity-30" />
              <p className="text-sm font-medium text-slate-600">No reviews yet</p>
              <p className="text-xs mt-1">Complete a booking to leave a review.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
