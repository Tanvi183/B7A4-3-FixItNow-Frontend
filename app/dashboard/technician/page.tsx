"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";
import {
  FiBriefcase, FiClock, FiDollarSign, FiCalendar, FiArrowRight,
  FiCheckCircle, FiXCircle, FiPlay, FiFlag, FiLoader, FiTool, FiRefreshCw, FiInbox, FiSearch
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
  cancellation_requested: { label: "Cancel Requested",   badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", dot: "bg-orange-500 animate-pulse" },
  cancellation_approved:  { label: "Cancel Approved",    badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", dot: "bg-orange-500" },
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
  cancellationOffer?: number;
  cancellationReason?: string;
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

  if (["cancellation_requested"].includes(status)) {
    return (
      <div className="flex flex-col gap-2">
        {booking.cancellationReason && (
          <div className="rounded-xl bg-orange-50 px-3 py-2 text-xs text-orange-800 dark:bg-orange-500/10 dark:text-orange-300 border border-orange-100 dark:border-orange-500/20 italic">
            <span className="font-semibold not-italic">Note:</span> {booking.cancellationReason}
          </div>
        )}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="mr-2 text-xs font-semibold text-orange-600 dark:text-orange-400">Offer: ${booking.cancellationOffer || 0}</span>
          <button
            onClick={() => onAction(id, `bookings/${id}/cancellation-response`, { action: "accept" })}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-60 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            {isLoading ? <FiLoader className="animate-spin h-3.5 w-3.5" /> : <FiCheckCircle className="h-3.5 w-3.5" />}
            Accept
          </button>
          <button
            onClick={() => onAction(id, `bookings/${id}/cancellation-response`, { action: "reject" })}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-60 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <FiXCircle className="h-3.5 w-3.5" />
            Reject
          </button>
        </div>
      </div>
    );
  }

  if (["cancellation_approved"].includes(status)) {
    return <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Cancellation fee accepted. Waiting for customer.</span>;
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
    let pendingRequests = 0, activeJobs = 0, jobEarnings = 0, cancellationEarnings = 0;
    let completedJobsCount = 0, feeCancelledCount = 0, techDeclinedCount = 0;

    bookings.forEach(b => {
      if (["assigned", "REQUESTED", "cancellation_requested"].includes(b.status)) pendingRequests++;
      if (["technician_accepted", "in_progress", "ACCEPTED", "IN_PROGRESS"].includes(b.status)) activeJobs++;
      
      if (["paid", "completed", "PAID", "COMPLETED"].includes(b.status)) {
        jobEarnings += Number(b.totalAmount ?? b.price ?? b.service?.basePrice ?? 0);
        completedJobsCount++;
      } else if (["cancelled", "CANCELLED"].includes(b.status) && b.cancellationOffer) {
        // Cancellation fees that were paid successfully
        cancellationEarnings += Number(b.cancellationOffer);
        feeCancelledCount++;
      } else if (["technician_declined"].includes(b.status)) {
        techDeclinedCount++;
      }
    });
    return { 
      pendingRequests, activeJobs, jobEarnings, cancellationEarnings, totalEarnings: jobEarnings + cancellationEarnings,
      completedJobsCount, feeCancelledCount, techDeclinedCount
    };
  }, [bookings]);

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch =
        (b.service?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.customer?.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase());
      
      if (statusFilter === "all") return matchesSearch && b.status !== "technician_declined";
      if (statusFilter === "new") return matchesSearch && ["assigned", "REQUESTED", "cancellation_requested"].includes(b.status);
      if (statusFilter === "active") return matchesSearch && ["technician_accepted", "in_progress", "ACCEPTED", "IN_PROGRESS"].includes(b.status);
      if (statusFilter === "completed") return matchesSearch && ["work_completed", "payment_pending", "paid", "completed", "PAID", "COMPLETED", "cancellation_approved", "cancelled"].includes(b.status);
      if (statusFilter === "declined") return matchesSearch && ["technician_declined"].includes(b.status);
      
      return matchesSearch;
    });
  }, [bookings, search, statusFilter]);

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark group hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <FiCheckCircle className="h-6 w-6" />
            </div>
            <h4 className="text-3xl font-bold text-black dark:text-white">{stats.completedJobsCount}</h4>
            <span className="text-sm font-medium text-body dark:text-bodydark2">Completed Jobs</span>
          </div>
          <div className="mt-5 pt-4 border-t border-stroke dark:border-strokedark flex justify-between text-xs">
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400">Cancel w/ Fee</span>
              <span className="font-semibold text-orange-500 dark:text-orange-400 mt-0.5">{stats.feeCancelledCount}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-gray-500 dark:text-gray-400">Declined Self</span>
              <span className="font-semibold text-red-500 dark:text-red-400 mt-0.5">{stats.techDeclinedCount}</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark group hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <h4 className="text-3xl font-bold text-black dark:text-white">${stats.totalEarnings.toFixed(2)}</h4>
            <span className="text-sm font-medium text-body dark:text-bodydark2">Total Earnings</span>
          </div>
          <div className="mt-5 pt-4 border-t border-stroke dark:border-strokedark flex justify-between text-xs">
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400">Job Fees</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">${stats.jobEarnings.toFixed(2)}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-gray-500 dark:text-gray-400">Cancel Fees</span>
              <span className="font-semibold text-orange-500 dark:text-orange-400 mt-0.5">${stats.cancellationEarnings.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white border border-stroke p-5 shadow-sm dark:bg-boxdark dark:border-strokedark">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by service, client or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stroke bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3C50E0] focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-[#3C50E0]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { v: "all", label: "All" },
            { v: "new", label: "New Requests" },
            { v: "active", label: "Active Jobs" },
            { v: "completed", label: "Completed" },
            { v: "declined", label: "Declined" },
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
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-meta-4" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stroke bg-white py-16 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <FiInbox className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-black dark:text-white">No jobs found</h3>
          <p className="mt-1 text-sm text-body dark:text-bodydark2">
            {search ? "Try a different search term" : "You have no jobs matching this criteria."}
          </p>
        </div>
      ) : statusFilter === "all" && !search ? (
        <div className="space-y-6">
          {/* Grouped view for "All" tab */}
          {(() => {
            const newRequests = filtered.filter(b => ["assigned", "REQUESTED", "cancellation_requested"].includes(b.status));
            const activeJobs = filtered.filter(b => ["technician_accepted", "in_progress", "work_completed", "ACCEPTED", "IN_PROGRESS"].includes(b.status));
            const closedJobs = filtered.filter(b => ["paid", "completed", "PAID", "COMPLETED", "customer_disputed", "payment_pending", "cancellation_approved", "cancelled"].includes(b.status));

            return (
              <>
                {newRequests.length > 0 && (
                  <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
                    <div className="border-b border-stroke px-6 py-5 dark:border-strokedark flex items-center justify-between bg-gray-50/50 dark:bg-meta-4/20">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-black dark:text-white">New Requests</h3>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">{newRequests.length}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {newRequests.map(b => (
                        <BookingRow key={b.id} booking={b} onAction={handleAction} actionLoading={actionLoading} />
                      ))}
                    </div>
                  </div>
                )}

                {activeJobs.length > 0 && (
                  <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
                    <div className="border-b border-stroke px-6 py-5 dark:border-strokedark flex items-center gap-2 bg-gray-50/50 dark:bg-meta-4/20">
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

                {closedJobs.length > 0 && (
                  <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
                    <div className="border-b border-stroke px-6 py-5 dark:border-strokedark bg-gray-50/50 dark:bg-meta-4/20">
                      <h3 className="font-semibold text-black dark:text-white">Closed Jobs</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {closedJobs.map(b => (
                        <BookingRow key={b.id} booking={b} onAction={handleAction} actionLoading={actionLoading} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b, idx) => (
            <div
              key={b.id}
              className="animate-in slide-in-from-bottom-2 fade-in"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both" }}
            >
              <BookingRow booking={b} onAction={handleAction} actionLoading={actionLoading} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
