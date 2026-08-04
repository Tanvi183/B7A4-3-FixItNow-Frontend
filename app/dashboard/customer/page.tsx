"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiCalendar, FiClock, FiCheckCircle, FiAlertTriangle,
  FiCreditCard, FiRefreshCw, FiStar, FiLoader, FiInbox,
  FiTool, FiSearch, FiX, FiTrash2
} from "react-icons/fi";

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, {
  label: string;
  badge: string;
  dot: string;
}> = {
  requested:            { label: "Pending Review",         badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",    dot: "bg-amber-500" },
  admin_rejected:       { label: "Rejected by Admin",       badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",           dot: "bg-red-500" },
  assigned:             { label: "Technician Assigned",     badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",       dot: "bg-blue-500" },
  technician_declined:  { label: "Technician Declined",     badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", dot: "bg-orange-500" },
  technician_accepted:  { label: "Technician Coming",       badge: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",       dot: "bg-teal-500" },
  in_progress:          { label: "In Progress",             badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", dot: "bg-emerald-500" },
  work_completed:       { label: "Awaiting Your Approval",  badge: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400", dot: "bg-purple-500" },
  customer_disputed:    { label: "Under Review",            badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",       dot: "bg-rose-500" },
  payment_pending:      { label: "Payment Due",             badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400", dot: "bg-yellow-500" },
  paid:                 { label: "Paid",                    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400", dot: "bg-indigo-500" },
  completed:            { label: "Completed",               badge: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",       dot: "bg-gray-400" },
  cancellation_requested: { label: "Cancellation Pending",    badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", dot: "bg-orange-500" },
  cancelled:            { label: "Cancelled",               badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",            dot: "bg-red-500" },
  // Legacy status support
  REQUESTED:            { label: "Pending Review",         badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",    dot: "bg-amber-500" },
  ACCEPTED:             { label: "Technician Coming",      badge: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",        dot: "bg-teal-500" },
  DECLINED:             { label: "Declined",               badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",            dot: "bg-red-500" },
  PAID:                 { label: "Paid",                   badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400", dot: "bg-indigo-500" },
  IN_PROGRESS:          { label: "In Progress",            badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", dot: "bg-emerald-500" },
  COMPLETED:            { label: "Completed",              badge: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",        dot: "bg-gray-400" },
  CANCELLED:            { label: "Cancelled",              badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",            dot: "bg-red-500" },
};

function getStatusConf(status: string) {
  return STATUS_CONFIG[status] ?? { label: status, badge: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400", dot: "bg-gray-400" };
}

interface Booking {
  id: string;
  status: string;
  date?: string;
  scheduledDate?: string;
  createdAt?: string;
  price?: number;
  totalAmount?: number;
  cancellationOffer?: number;
  service?: { name: string; basePrice?: number; description?: string };
  technician?: { user?: { name: string; email?: string } };
  adminNote?: string;
  technicianNote?: string;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, from, to }: { label: string; value: number; icon: React.ReactNode; from: string; to: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-stroke bg-white p-5 shadow-sm dark:border-strokedark dark:bg-boxdark">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${from} ${to} text-white shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
        <p className="text-sm text-body dark:text-bodydark2">{label}</p>
      </div>
    </div>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, onAction, actionLoading, onDelete }: {
  booking: Booking;
  onAction: (id: string, endpoint: string, payload?: any) => void;
  actionLoading: string | null;
  onDelete: (id: string) => void;
}) {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const isLoading = actionLoading === booking.id;
  const conf = getStatusConf(booking.status);
  const date = booking.scheduledDate || booking.date || booking.createdAt;
  const price = booking.totalAmount ?? booking.price ?? booking.service?.basePrice ?? 0;

  return (
    <div className="group flex flex-col rounded-2xl border border-stroke bg-white shadow-sm hover:shadow-md dark:border-strokedark dark:bg-boxdark transition-all duration-200">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-stroke/50 px-6 py-4 dark:border-strokedark/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3C50E0] to-[#6577F3] shadow-sm">
            <FiTool className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-black dark:text-white leading-tight">
              {booking.service?.name || "Service Booking"}
            </h4>
            <p className="text-xs text-body dark:text-bodydark2 mt-0.5">
              #{booking.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${conf.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
          {conf.label}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {booking.technician?.user?.name && (
            <div className="flex items-center gap-2 text-body dark:text-bodydark2">
              <FiCheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
              <span className="truncate">{booking.technician.user.name}</span>
            </div>
          )}
          {date && (
            <div className="flex items-center gap-2 text-body dark:text-bodydark2">
              <FiCalendar className="h-4 w-4 shrink-0" />
              <span>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          )}
          {price > 0 && (
            <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
              <FiCreditCard className="h-4 w-4 shrink-0" />
              <span>${Number(price).toFixed(2)}</span>
            </div>
          )}
        </div>

        {booking.adminNote && (
          <div className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
            <span className="font-semibold">Admin note:</span> {booking.adminNote}
          </div>
        )}
        {booking.technicianNote && (
          <div className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-100 dark:border-amber-500/20">
            <span className="font-semibold">Technician note:</span> {booking.technicianNote}
          </div>
        )}

        {/* ─── Contextual Actions ─── */}
        <div className="mt-auto flex flex-wrap gap-2 pt-2 border-t border-stroke/50 dark:border-strokedark/50">
          {/* work_completed: customer approves or disputes */}
          {(booking.status === "work_completed") && (
            <>
              <button
                onClick={() => onAction(booking.id, `bookings/${booking.id}/customer-confirm`, { action: "approve" })}
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-60 transition-all active:scale-95 cursor-pointer"
              >
                {isLoading ? <FiLoader className="h-3.5 w-3.5 animate-spin" /> : <FiCheckCircle className="h-3.5 w-3.5" />}
                Approve Work
              </button>
              <button
                onClick={() => onAction(booking.id, `bookings/${booking.id}/customer-confirm`, { action: "dispute" })}
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600 disabled:opacity-60 transition-all active:scale-95 cursor-pointer"
              >
                <FiAlertTriangle className="h-3.5 w-3.5" />
                Dispute
              </button>
            </>
          )}

          {/* payment_pending: Pay via Stripe */}
          {(booking.status === "payment_pending" || booking.status === "ACCEPTED") && (
            <PayButton booking={booking} price={price} />
          )}

          {/* completed: Leave a review */}
          {(booking.status === "completed" || booking.status === "COMPLETED") && (
            <Link
              href={`/dashboard/customer/reviews/new?bookingId=${booking.id}&technicianName=${encodeURIComponent(booking.technician?.user?.name || "")}`}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition-all active:scale-95 cursor-pointer"
            >
              <FiStar className="h-3.5 w-3.5" />
              Leave Review
            </Link>
          )}

          {/* requested: Customer can cancel directly */}
          {["requested", "REQUESTED"].includes(booking.status) && (
            <div className="flex w-full items-center justify-between">
              <span className="text-xs text-body dark:text-bodydark2 italic">Waiting for admin to review your request…</span>
              <button
                onClick={() => onAction(booking.id, `bookings/${booking.id}/customer-cancel`)}
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm border border-red-100 hover:bg-red-100 disabled:opacity-60 transition-all cursor-pointer dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/20"
              >
                {isLoading ? <FiLoader className="h-3 w-3 animate-spin" /> : <FiX className="h-3 w-3" />}
                Cancel Booking
              </button>
            </div>
          )}

          {/* assigned, technician_accepted, in_progress: Customer can apply for cancellation */}
          {["assigned", "technician_declined", "technician_accepted", "in_progress", "IN_PROGRESS"].includes(booking.status) && (
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-body dark:text-bodydark2 italic">
                {["assigned", "technician_declined"].includes(booking.status) ? "Awaiting technician response…" : "Your technician is on the job!"}
              </span>
              <button
                onClick={() => setCancelModalOpen(true)}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 shadow-sm border border-orange-100 hover:bg-orange-100 disabled:opacity-60 transition-all cursor-pointer dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500/20"
              >
                {isLoading ? <FiLoader className="h-3 w-3 animate-spin" /> : <FiAlertTriangle className="h-3 w-3" />}
                Apply for Cancellation
              </button>
            </div>
          )}

          {["cancellation_requested"].includes(booking.status) && (
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Cancellation requested with offer ${booking.cancellationOffer || 0}. Waiting for technician.</span>
          )}

          {["cancellation_approved"].includes(booking.status) && (
            <div className="flex w-full items-center justify-between">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Cancellation approved. Fee: ${booking.cancellationOffer || 0}</span>
              <button
                onClick={() => onAction(booking.id, `bookings/${booking.id}/customer-cancel`)}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm border border-red-500 hover:bg-red-600 disabled:opacity-60 transition-all cursor-pointer"
              >
                {isLoading ? <FiLoader className="h-3 w-3 animate-spin" /> : <FiX className="h-3 w-3" />}
                Finalize Cancellation
              </button>
            </div>
          )}

          {["customer_disputed"].includes(booking.status) && (
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">Dispute submitted. Admin is reviewing.</span>
          )}
          {["paid", "PAID"].includes(booking.status) && (
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Payment received. Job will be closed soon.</span>
          )}
          {["admin_rejected", "DECLINED", "CANCELLED", "cancelled"].includes(booking.status) && (
            <div className="flex w-full items-center justify-between">
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">This booking was {booking.status === "cancelled" || booking.status === "CANCELLED" ? "cancelled" : "not accepted"}.</span>
              <button
                onClick={() => onDelete(booking.id)}
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm border border-gray-200 hover:bg-gray-200 disabled:opacity-60 transition-all cursor-pointer dark:bg-meta-4 dark:border-strokedark dark:text-bodydark dark:hover:bg-meta-4/80"
              >
                {isLoading ? <FiLoader className="h-3 w-3 animate-spin" /> : <FiTrash2 className="h-3 w-3" />}
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* ── Cancellation Modal ── */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-boxdark">
            <h3 className="mb-2 text-lg font-bold text-black dark:text-white">Offer Cancellation Fee</h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              The technician is already assigned to this job. To cancel, you must offer a cancellation fee.
            </p>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">Offer Amount ($)</label>
              <input
                type="number"
                min="0"
                value={offerAmount}
                onChange={e => setOfferAmount(e.target.value)}
                placeholder="e.g. 15.00"
                className="w-full rounded-xl border border-stroke bg-gray-50 px-4 py-2.5 text-black outline-none focus:border-[#3C50E0] dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-[#3C50E0]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-meta-4 cursor-pointer"
              >
                Nevermind
              </button>
              <button
                onClick={() => {
                  onAction(booking.id, `bookings/${booking.id}/customer-cancel`, { offerAmount: Number(offerAmount) });
                  setCancelModalOpen(false);
                }}
                disabled={!offerAmount || Number(offerAmount) < 0}
                className="rounded-xl bg-[#3C50E0] px-4 py-2 text-sm font-medium text-white hover:bg-[#3C50E0]/90 disabled:opacity-60 cursor-pointer"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pay Button (Stripe) ──────────────────────────────────────────────────────
function PayButton({ booking, price }: { booking: Booking; price: number }) {
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          serviceName: booking.service?.name || "Service Booking",
          amount: price || 50,
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Could not initiate payment. Please add your Stripe keys.");
        setPaying(false);
      }
    } catch (err) {
      toast.error("Payment error. Check your Stripe configuration.");
      setPaying(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={paying}
      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#3C50E0] to-[#6577F3] px-5 py-2 text-xs font-semibold text-white shadow-md shadow-[#3C50E0]/20 hover:from-[#3C50E0]/90 hover:to-[#6577F3]/90 disabled:opacity-60 transition-all active:scale-95 cursor-pointer"
    >
      {paying ? <FiLoader className="h-3.5 w-3.5 animate-spin" /> : <FiCreditCard className="h-3.5 w-3.5" />}
      {paying ? "Redirecting…" : "Pay Now"}
    </button>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-meta-4" />
          <div>
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-meta-4 mb-1.5" />
            <div className="h-3 w-20 rounded bg-gray-100 dark:bg-meta-4" />
          </div>
        </div>
        <div className="h-6 w-28 rounded-full bg-gray-200 dark:bg-meta-4" />
      </div>
      <div className="h-3 w-full rounded bg-gray-100 dark:bg-meta-4 mb-2" />
      <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-meta-4" />
    </div>
  );
}

function CustomerDashboardContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter") || "all";
  
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(filterParam);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  // Sync state if URL changes
  useEffect(() => {
    const currentFilter = searchParams.get("filter");
    if (currentFilter) setStatusFilter(currentFilter);
  }, [searchParams]);

  const fetchBookings = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.data || data);
      } else {
        throw new Error(data.message || "Failed to load bookings");
      }
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleAction = async (bookingId: string, endpoint: string, payload?: any) => {
    setActionLoading(bookingId);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Booking updated successfully!");
        fetchBookings(true);
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!bookingToDelete) return;
    setActionLoading(bookingToDelete);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Booking removed from history!");
        fetchBookings(true);
      } else {
        toast.error(data.message || "Failed to remove booking");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
      setBookingToDelete(null);
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: bookings.length,
    active: bookings.filter(b => ["assigned", "technician_accepted", "in_progress", "ACCEPTED", "IN_PROGRESS"].includes(b.status)).length,
    pending: bookings.filter(b => ["requested", "REQUESTED", "payment_pending", "work_completed"].includes(b.status)).length,
    completed: bookings.filter(b => ["completed", "COMPLETED", "paid", "PAID"].includes(b.status)).length,
    cancelled: bookings.filter(b => ["cancelled", "CANCELLED", "admin_rejected", "DECLINED", "customer_disputed"].includes(b.status)).length,
  }), [bookings]);

  // Filter
  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch =
        (b.service?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.technician?.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase());
      if (statusFilter === "all") return matchesSearch && !["cancelled", "CANCELLED", "admin_rejected", "DECLINED", "customer_disputed"].includes(b.status);
      if (statusFilter === "ongoing") return matchesSearch && ["assigned", "technician_accepted", "in_progress", "ACCEPTED", "IN_PROGRESS", "requested", "REQUESTED", "payment_pending", "work_completed", "cancellation_requested"].includes(b.status);
      if (statusFilter === "completed") return matchesSearch && ["completed", "COMPLETED", "paid", "PAID"].includes(b.status);
      if (statusFilter === "cancelled") return matchesSearch && ["cancelled", "CANCELLED", "admin_rejected", "DECLINED", "customer_disputed"].includes(b.status);
      return matchesSearch && b.status === statusFilter;
    });
  }, [bookings, search, statusFilter]);

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3C50E0] via-[#5366e8] to-[#6577F3] px-8 py-7 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">{greeting},</p>
            <h1 className="mt-0.5 text-2xl font-bold">{user?.name || "Customer"} 👋</h1>
            <p className="mt-1 text-sm text-white/60 max-w-lg">
              Track your service bookings, approve completed work, and make secure payments — all in one place.
            </p>
          </div>
          <button
            onClick={() => fetchBookings(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm hover:bg-white/30 transition-all cursor-pointer disabled:opacity-60"
          >
            <FiRefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Bookings" value={stats.total} icon={<FiCalendar className="h-5 w-5" />} from="from-[#3C50E0]" to="to-[#6577F3]" />
        <StatCard label="Pending / Action Needed" value={stats.pending} icon={<FiClock className="h-5 w-5" />} from="from-amber-400" to="to-orange-500" />
        <StatCard label="Active Jobs" value={stats.active} icon={<FiTool className="h-5 w-5" />} from="from-emerald-500" to="to-teal-500" />
        <StatCard label="Completed" value={stats.completed} icon={<FiCheckCircle className="h-5 w-5" />} from="from-gray-500" to="to-gray-600" />
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-stroke p-5 shadow-sm dark:bg-boxdark dark:border-strokedark">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by service, technician or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stroke bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3C50E0] focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-[#3C50E0]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { v: "all", label: "All" },
            { v: "ongoing", label: "My Bookings (Active)" },
            { v: "completed", label: "Completed" },
            { v: "cancelled", label: "Cancelled" },
          ].map(tab => (
            <button
              key={tab.v}
              onClick={() => setStatusFilter(tab.v)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                statusFilter === tab.v
                  ? "bg-[#3C50E0] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-meta-4 dark:text-bodydark2 dark:hover:bg-meta-4/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Booking List ── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stroke bg-white py-16 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <FiInbox className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-black dark:text-white">No bookings found</h3>
          <p className="mt-1 text-sm text-body dark:text-bodydark2">
            {search ? "Try a different search term" : "Your bookings will appear here once you make one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((booking, idx) => (
            <div
              key={booking.id}
              className="animate-in slide-in-from-bottom-2 fade-in"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both" }}
            >
              <BookingCard
                booking={booking}
                onAction={handleAction}
                onDelete={(id) => setBookingToDelete(id)}
                actionLoading={actionLoading}
              />
            </div>
          ))}
        </div>
      )}
      {/* ── Delete Confirmation Modal ── */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-boxdark dark:border dark:border-strokedark animate-in zoom-in-95 duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4 dark:bg-red-500/20 dark:text-red-400">
              <FiAlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Remove Booking?</h3>
            <p className="text-sm text-body dark:text-bodydark2 mb-6">
              Are you sure you want to permanently remove this cancelled booking from your history? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBookingToDelete(null)}
                className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all dark:bg-meta-4 dark:text-white dark:hover:bg-meta-4/80"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading === bookingToDelete}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-all disabled:opacity-60"
              >
                {actionLoading === bookingToDelete ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiTrash2 className="h-4 w-4" />}
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboard() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><FiLoader className="h-8 w-8 animate-spin text-blue-600" /></div>}>
      <CustomerDashboardContent />
    </Suspense>
  );
}
