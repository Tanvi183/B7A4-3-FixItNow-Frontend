"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";
import {
  FiBriefcase, FiClock, FiDollarSign, FiCalendar, FiArrowRight,
  FiCheckCircle, FiXCircle, FiPlay, FiFlag, FiLoader, FiTool, FiRefreshCw, FiInbox
} from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  requested:            { label: "Requested",           badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",     dot: "bg-amber-500" },
  assigned:             { label: "Assigned to You",     badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",        dot: "bg-blue-500" },
  technician_accepted:  { label: "Accepted",            badge: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",        dot: "bg-teal-500" },
  in_progress:          { label: "In Progress",         badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", dot: "bg-emerald-500" },
  work_completed:       { label: "Work Marked Done",    badge: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400", dot: "bg-purple-500" },
  payment_pending:      { label: "Payment Pending",     badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400", dot: "bg-yellow-500" },
  paid:                 { label: "Paid",                badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400", dot: "bg-indigo-500" },
  completed:            { label: "Completed",           badge: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",        dot: "bg-gray-400" },
  customer_disputed:    { label: "Customer Disputed",   badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",        dot: "bg-rose-500" },
  technician_declined:  { label: "You Declined",        badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", dot: "bg-orange-500" },
  admin_rejected:       { label: "Rejected",            badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",           dot: "bg-red-500" },
  // Legacy
  REQUESTED:  { label: "Requested",    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",    dot: "bg-amber-500" },
  ACCEPTED:   { label: "Accepted",     badge: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",        dot: "bg-teal-500" },
  IN_PROGRESS:{ label: "In Progress",  badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", dot: "bg-emerald-500" },
  COMPLETED:  { label: "Completed",    badge: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",        dot: "bg-gray-400" },
  PAID:       { label: "Paid",         badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400", dot: "bg-indigo-500" },
  DECLINED:   { label: "Declined",     badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",           dot: "bg-red-500" },
  CANCELLED:  { label: "Cancelled",    badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",           dot: "bg-red-500" },
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
  customer?: { user?: { name: string; email?: string } };
  service?: { name: string; basePrice?: number };
}

// ─── Action Button Set ────────────────────────────────────────────────────────
function BookingActions({ booking, onAction, isLoading }: {
  booking: Booking;
  onAction: (id: string, endpoint: string, payload?: any) => void;
  isLoading: boolean;
}) {
  const { status, id } = booking;

  if (["assigned", "REQUESTED"].includes(status)) {
    return (
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onAction(id, `bookings/${id}/technician-response`, { action: "accept" })}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-60 transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          {isLoading ? <FiLoader className="animate-spin h-3.5 w-3.5" /> : <FiCheckCircle className="h-3.5 w-3.5" />}
          Accept
        </button>
        <button
          onClick={() => onAction(id, `bookings/${id}/technician-response`, { action: "decline" })}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-60 transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          <FiXCircle className="h-3.5 w-3.5" />
          Decline
        </button>
      </div>
    );
  }

  if (["technician_accepted", "ACCEPTED"].includes(status)) {
    return (
      <button
        onClick={() => onAction(id, `bookings/${id}/start`)}
        disabled={isLoading}
        className="flex items-center gap-1.5 rounded-xl bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 disabled:opacity-60 transition-all active:scale-95 cursor-pointer shadow-sm"
      >
        {isLoading ? <FiLoader className="animate-spin h-3.5 w-3.5" /> : <FiPlay className="h-3.5 w-3.5" />}
        Start Job
      </button>
    );
  }

  if (["in_progress", "IN_PROGRESS"].includes(status)) {
    return (
      <button
        onClick={() => onAction(id, `bookings/${id}/complete`)}
        disabled={isLoading}
        className="flex items-center gap-1.5 rounded-xl bg-purple-500 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-600 disabled:opacity-60 transition-all active:scale-95 cursor-pointer shadow-sm"
      >
        {isLoading ? <FiLoader className="animate-spin h-3.5 w-3.5" /> : <FiFlag className="h-3.5 w-3.5" />}
        Mark as Done
      </button>
    );
  }

  if (["work_completed"].includes(status)) {
    return <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Awaiting customer approval…</span>;
  }

  if (["payment_pending"].includes(status)) {
    return <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Customer is processing payment…</span>;
  }

  if (["paid", "PAID"].includes(status)) {
    return <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Payment received! Closing soon.</span>;
  }

  if (["completed", "COMPLETED"].includes(status)) {
    return <span className="text-xs text-gray-500 dark:text-gray-400 italic">This job is closed.</span>;
  }

  return null;
}

// ─── Booking Row ──────────────────────────────────────────────────────────────
function BookingRow({ booking, onAction, actionLoading }: {
  booking: Booking;
  onAction: (id: string, endpoint: string, payload?: any) => void;
  actionLoading: string | null;
}) {
  const conf = getStatusConf(booking.status);
  const date = booking.scheduledDate || booking.date || booking.createdAt;
  const price = booking.totalAmount ?? booking.price ?? booking.service?.basePrice ?? 0;
  const isLoading = actionLoading === booking.id;

  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4 hover:border-[#3C50E0]/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all duration-200">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white dark:bg-boxdark shadow-sm">
          <FiCalendar className="h-5 w-5 text-[#3C50E0]" />
        </div>
        <div className="min-w-0">
          <h5 className="font-semibold text-black dark:text-white truncate">
            {booking.service?.name || "Service Booking"}
          </h5>
          <p className="text-sm text-body dark:text-bodydark2 truncate">
            Client: {booking.customer?.user?.name || "Unknown"}
            {date && ` • ${new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        {price > 0 && (
          <p className="hidden sm:block font-bold text-emerald-600 dark:text-emerald-400">${Number(price).toFixed(2)}</p>
        )}
        <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${conf.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
          {conf.label}
        </span>
        <BookingActions booking={booking} onAction={onAction} isLoading={isLoading} />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TechnicianDashboard() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBookings(data.data);
      } else {
        // Try technician-specific endpoint
        const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/technicians/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data2 = await res2.json();
        if (data2.success && Array.isArray(data2.data)) setBookings(data2.data);
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
        toast.success("Booking updated!");
        fetchBookings(true);
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  // Stats
  const stats = useMemo(() => {
    let pendingRequests = 0, activeJobs = 0, totalEarnings = 0;
    bookings.forEach(b => {
      if (["assigned", "REQUESTED"].includes(b.status)) pendingRequests++;
      if (["technician_accepted", "in_progress", "ACCEPTED", "IN_PROGRESS"].includes(b.status)) activeJobs++;
      if (["paid", "completed", "PAID", "COMPLETED"].includes(b.status)) totalEarnings += Number(b.totalAmount ?? b.price ?? b.service?.basePrice ?? 0);
    });
    return { pendingRequests, activeJobs, totalEarnings };
  }, [bookings]);

  const newRequests = bookings.filter(b => ["assigned", "REQUESTED"].includes(b.status));
  const activeJobs = bookings.filter(b => ["technician_accepted", "in_progress", "work_completed", "ACCEPTED", "IN_PROGRESS"].includes(b.status));
  const pastJobs = bookings.filter(b => ["paid", "completed", "PAID", "COMPLETED", "customer_disputed", "payment_pending"].includes(b.status));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3C50E0] to-[#6577F3] p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0] || "Technician"}! 👋</h2>
            <p className="mt-2 text-indigo-100 max-w-lg text-sm leading-relaxed">
              Here's your job queue. Accept new requests, start active jobs, and mark work as done — all from here.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => fetchBookings(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm hover:bg-white/30 transition-all cursor-pointer disabled:opacity-60"
            >
              <FiRefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/dashboard/technician/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm hover:bg-white/30 transition-all"
            >
              Update Profile
            </Link>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark group hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 mb-4 group-hover:scale-110 transition-transform">
            <FiClock className="h-6 w-6" />
          </div>
          <h4 className="text-3xl font-bold text-black dark:text-white">{stats.pendingRequests}</h4>
          <span className="text-sm font-medium text-body dark:text-bodydark2">Pending Requests</span>
        </div>
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark group hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
            <FiBriefcase className="h-6 w-6" />
          </div>
          <h4 className="text-3xl font-bold text-black dark:text-white">{stats.activeJobs}</h4>
          <span className="text-sm font-medium text-body dark:text-bodydark2">Active Jobs</span>
        </div>
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark group hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <FiDollarSign className="h-6 w-6" />
          </div>
          <h4 className="text-3xl font-bold text-black dark:text-white">${stats.totalEarnings.toFixed(2)}</h4>
          <span className="text-sm font-medium text-body dark:text-bodydark2">Total Earnings</span>
        </div>
      </div>

      {/* ── New Requests ── */}
      {!loading && (
        <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
          <div className="border-b border-stroke px-6 py-5 dark:border-strokedark flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-black dark:text-white">New Requests</h3>
              {newRequests.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">{newRequests.length}</span>
              )}
            </div>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="h-8 w-full animate-pulse rounded bg-gray-100 dark:bg-meta-4" />
            ) : newRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FiInbox className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm font-medium text-body dark:text-bodydark2">No new requests right now</p>
              </div>
            ) : (
              <div className="space-y-3">
                {newRequests.map(b => (
                  <BookingRow key={b.id} booking={b} onAction={handleAction} actionLoading={actionLoading} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Active Jobs ── */}
      {!loading && activeJobs.length > 0 && (
        <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
          <div className="border-b border-stroke px-6 py-5 dark:border-strokedark flex items-center gap-2">
            <h3 className="font-semibold text-black dark:text-white">Active Jobs</h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">{activeJobs.length}</span>
          </div>
          <div className="p-4 space-y-3">
            {activeJobs.map(b => (
              <BookingRow key={b.id} booking={b} onAction={handleAction} actionLoading={actionLoading} />
            ))}
          </div>
        </div>
      )}

      {/* ── Past/Closed Jobs ── */}
      {!loading && pastJobs.length > 0 && (
        <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
          <div className="border-b border-stroke px-6 py-5 dark:border-strokedark">
            <h3 className="font-semibold text-black dark:text-white">Closed Jobs</h3>
          </div>
          <div className="p-4 space-y-3">
            {pastJobs.slice(0, 5).map(b => (
              <BookingRow key={b.id} booking={b} onAction={handleAction} actionLoading={actionLoading} />
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex h-32 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C50E0] border-t-transparent" />
        </div>
      )}
    </div>
  );
}
