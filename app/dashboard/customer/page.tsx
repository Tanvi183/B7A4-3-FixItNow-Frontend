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
import { X } from "lucide-react";

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

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;

    setIsSubmittingReview(true);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Review submitted successfully!");
        // Add new review to state
        setReviews([data.data, ...reviews]);
        // Close modal and reset state
        setIsReviewModalOpen(false);
        setReviewRating(5);
        setReviewComment("");
        setSelectedBookingId(null);
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmittingReview(false);
    }
  };

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
                              reviews.some(r => r.bookingId === booking.id) ? (
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Reviewed</span>
                              ) : (
                                <button 
                                  onClick={() => {
                                    setSelectedBookingId(booking.id);
                                    setIsReviewModalOpen(true);
                                  }}
                                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[11px] uppercase tracking-wider font-bold rounded-md hover:bg-slate-50 transition-colors"
                                >
                                  Leave Review
                                </button>
                              )
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
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
              <Star className="text-slate-300 mb-3" size={32} />
              <p className="text-slate-500 font-medium text-sm">You haven't left any reviews yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Leave a Review</h3>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={32} 
                        className={`transition-colors ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200 hover:text-amber-200'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Comment</label>
                <textarea
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this service..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20"
                >
                  {isSubmittingReview && <Loader2 size={16} className="animate-spin" />}
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
