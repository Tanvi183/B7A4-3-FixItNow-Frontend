"use client";

import React, { useEffect, useState } from "react";
import { FiStar, FiTrash2, FiMessageCircle, FiSearch, FiCalendar } from "react-icons/fi";
import { getCookie } from "@/stores/useAuthStore";
import toast from "react-hot-toast";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer?: {
    user: {
      name: string;
      email: string;
    };
  };
  technician?: {
    user: {
      name: string;
    };
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const token = getCookie("accessToken");
      // Could be /reviews or /admin/reviews depending on backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      } else {
        // Fallback or just empty array
        setReviews([]);
      }
    } catch (error) {
      toast.error("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
    
    setDeletingId(id);
    const token = getCookie("accessToken");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Review deleted successfully");
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        toast.error(result.message || "Failed to delete review");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = reviews.filter(r => 
    (r.comment || "").toLowerCase().includes(search.toLowerCase()) || 
    (r.customer?.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.technician?.user?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 relative animate-in fade-in duration-500">
      {/* ── Premium Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#78350f] via-[#b45309] to-[#78350f] p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Platform Reviews
              <span className="flex h-7 items-center justify-center rounded-full bg-amber-500/30 px-3 text-xs font-bold text-amber-200 border border-amber-400/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                {reviews.length} Total
              </span>
            </h2>
            <p className="mt-2 text-amber-100/80 max-w-lg text-sm leading-relaxed">
              Monitor customer feedback and ensure high-quality service across the platform. Moderate inappropriate reviews directly from this panel.
            </p>
          </div>
          
          <div className="relative group w-full sm:w-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 rounded-xl border border-white/10 bg-black/20 py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/40 outline-none backdrop-blur-md transition-all focus:border-amber-400/50 focus:bg-black/40 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>
        </div>
        
        {/* Decorative background shapes */}
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-amber-400/20 blur-[80px]" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-orange-400/20 blur-[80px]" />
      </div>

      {/* ── Reviews Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-meta-4 rounded-full" />
                <div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-meta-4 rounded mb-1" />
                  <div className="h-3 w-16 bg-gray-100 dark:bg-meta-4/50 rounded" />
                </div>
              </div>
              <div className="h-4 w-full bg-gray-100 dark:bg-meta-4/50 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-100 dark:bg-meta-4/50 rounded" />
            </div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stroke bg-white py-16 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-meta-4 mb-4">
            <FiMessageCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-black dark:text-white">No Reviews Found</h4>
          <p className="text-sm text-body dark:text-bodydark2 mt-1">
            {search ? "Try adjusting your search terms." : "There are currently no reviews on the platform."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review, idx) => {
            const ratingStr = String(review.rating || 0);
            return (
              <div 
                key={review.id} 
                className="group relative flex flex-col rounded-2xl border border-stroke bg-white p-6 shadow-sm hover:shadow-xl dark:border-strokedark dark:bg-boxdark transition-all duration-300 hover:-translate-y-1.5 animate-in slide-in-from-bottom-4 fade-in"
                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
              >
                
                {/* Delete button (hidden until hover) */}
                <button 
                  onClick={() => handleDelete(review.id)}
                  disabled={deletingId === review.id}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-meta-4 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition-all duration-300 disabled:opacity-50"
                  title="Delete Review"
                >
                  {deletingId === review.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-meta-1 border-t-transparent" />
                  ) : (
                    <FiTrash2 className="w-4 h-4" />
                  )}
                </button>

                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(star => (
                    <FiStar 
                      key={star} 
                      className={`h-4 w-4 ${star <= (review.rating || 0) ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-300 dark:text-strokedark"}`} 
                    />
                  ))}
                  <span className="ml-2 text-sm font-semibold text-black dark:text-white">
                    {ratingStr}.0
                  </span>
                </div>
                
                <p className="text-sm text-body dark:text-bodydark2 flex-1 italic mb-6">
                  "{review.comment}"
                </p>

                <div className="mt-auto border-t border-stroke pt-4 dark:border-strokedark flex justify-between items-end">
                  <div>
                    <p className="text-xs font-semibold text-black dark:text-white">
                      From: {review.customer?.user?.name || "Anonymous"}
                    </p>
                    <p className="text-[11px] text-primary font-medium mt-0.5">
                      To: {review.technician?.user?.name || "Technician"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                    <FiCalendar className="w-3 h-3" />
                    {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
