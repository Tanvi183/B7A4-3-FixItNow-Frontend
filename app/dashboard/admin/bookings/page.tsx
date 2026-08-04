"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getCookie } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import {
  FiSearch, FiRefreshCw, FiCalendar, FiUser, FiTool, FiLoader,
  FiCheckCircle, FiXCircle, FiAlertTriangle, FiInbox, FiChevronDown
} from "react-icons/fi";

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  requested:           { label: "Requested",          badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",     dot: "bg-amber-500 animate-pulse" },
  admin_rejected:      { label: "Rejected",           badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",            dot: "bg-red-500" },
  assigned:            { label: "Assigned",           badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",        dot: "bg-blue-500" },
  technician_declined: { label: "Tech Declined",      badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", dot: "bg-orange-500" },
  technician_accepted: { label: "Tech Accepted",      badge: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",        dot: "bg-teal-500" },
  in_progress:         { label: "In Progress",        badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", dot: "bg-emerald-500" },
  work_completed:      { label: "Work Done",          badge: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400", dot: "bg-purple-500" },
  customer_disputed:   { label: "Disputed",           badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",        dot: "bg-rose-500 animate-pulse" },
  payment_pending:     { label: "Payment Pending",    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400", dot: "bg-yellow-500" },
  paid:                { label: "Paid",               badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400", dot: "bg-indigo-500" },
  completed:           { label: "Completed",          badge: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",        dot: "bg-gray-400" },
  cancellation_requested: { label: "Cancel Requested",   badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", dot: "bg-orange-500 animate-pulse" },
  cancellation_approved:  { label: "Cancel Approved",    badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", dot: "bg-orange-500" },
  cancelled:           { label: "Cancelled",          badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",             dot: "bg-red-500" },
  // Legacy
  REQUESTED:  { label: "Requested",   badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",     dot: "bg-amber-500 animate-pulse" },
  ACCEPTED:   { label: "Accepted",    badge: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",         dot: "bg-teal-500" },
  IN_PROGRESS:{ label: "In Progress", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", dot: "bg-emerald-500" },
  COMPLETED:  { label: "Completed",   badge: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",         dot: "bg-gray-400" },
  PAID:       { label: "Paid",        badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",  dot: "bg-indigo-500" },
  DECLINED:   { label: "Declined",    badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",             dot: "bg-red-500" },
  CANCELLED:  { label: "Cancelled",   badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",             dot: "bg-red-500" },
};

function getStatusConf(status: string) {
  return STATUS_CONFIG[status] ?? { label: status, badge: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400", dot: "bg-gray-400" };
}

interface Technician { id: string; userId: string; user?: { name: string; email?: string }; isApproved?: boolean; services?: { id: string; category?: { name: string } }[]; }
interface Booking {
  id: string;
  status: string;
  createdAt?: string;
  scheduledDate?: string;
  date?: string;
  price?: number;
  totalAmount?: number;
  cancellationOffer?: number | string | null;
  cancellationReason?: string | null;
  customer?: { user?: { name: string; email?: string } };
  technician?: { user?: { name: string } };
  service?: { id: string; name: string; basePrice?: number; categoryId?: string; category?: { name: string } };
  adminNote?: string;
}

// ─── Assign Technician Dropdown ───────────────────────────────────────────────
function AssignDropdown({ booking, technicians, onAssign, isLoading, label = "Assign Tech", showAll = false }: {
  booking: Booking;
  technicians: Technician[];
  onAssign: (bookingId: string, technicianId: string) => void;
  isLoading: boolean;
  label?: string;
  showAll?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState("");

  const filteredTechnicians = useMemo(() => {
    // Only allow assigning approved technicians
    const approvedTechs = technicians.filter(t => t.isApproved);
    
    if (showAll) return approvedTechs; // For reassignment, show all approved techs

    // Filter by matching service category
    return approvedTechs.filter(t => {
      const bookingCategory = booking.service?.category?.name;
      if (!bookingCategory) return true;
      return t.services?.some(s => s.category?.name === bookingCategory);
    });
  }, [technicians, booking, showAll]);

  return (
    <div className="relative">
      <button
        onClick={() => { setSelectedTech(""); setOpen(o => !o); }}
        className="flex items-center gap-1.5 rounded-xl bg-[#3C50E0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3C50E0]/90 transition-all active:scale-95 cursor-pointer shadow-sm"
      >
        <FiUser className="h-3.5 w-3.5" />
        {label}
        <FiChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-[999] w-72 rounded-xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-[#1e2340] dark:ring-white/10 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3 border-b border-stroke dark:border-strokedark">
            <p className="text-xs font-semibold text-black dark:text-white mb-2">
              Select a Technician {filteredTechnicians.length > 0 ? `(${filteredTechnicians.length} available)` : ""}
            </p>
            {filteredTechnicians.length === 0 ? (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-700">
                No technicians found for this category.
              </div>
            ) : (
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
                {filteredTechnicians.map(t => {
                  const isSelected = selectedTech === t.userId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTech(t.userId)}
                      className={`flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? "bg-[#3C50E0]/10 text-[#3C50E0] dark:bg-[#3C50E0]/20 dark:text-white font-medium" 
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-meta-4 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                          isSelected ? "bg-[#3C50E0] text-white shadow-sm" : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}>
                          {t.user?.name?.charAt(0) || "T"}
                        </div>
                        <span className="truncate">{t.user?.name || t.userId}</span>
                      </div>
                      {isSelected && <FiCheckCircle className="h-4 w-4 text-[#3C50E0]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="p-3 flex gap-2">
            <button
              onClick={() => { if (selectedTech) { onAssign(booking.id, selectedTech); setOpen(false); } else toast.error("Please select a technician"); }}
              disabled={isLoading || filteredTechnicians.length === 0}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#3C50E0] py-2 text-xs font-semibold text-white hover:bg-[#3C50E0]/90 transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:active:scale-100 cursor-pointer"
            >
              {isLoading ? "Assigning…" : "Confirm Assign"}
            </button>
            <button onClick={() => setOpen(false)} className="rounded-xl bg-gray-100 dark:bg-meta-4 px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-meta-4/80 transition-colors cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Booking Row ──────────────────────────────────────────────────────────────
function BookingRow({ booking, technicians, onAction, onAssign, actionLoading, idx }: {
  booking: Booking;
  technicians: Technician[];
  onAction: (id: string, endpoint: string, payload?: any) => void;
  onAssign: (bookingId: string, technicianId: string) => void;
  actionLoading: string | null;
  idx: number;
}) {
  const conf = getStatusConf(booking.status);
  const date = booking.scheduledDate || booking.date || booking.createdAt;
  const price = booking.cancellationOffer ?? booking.totalAmount ?? booking.price ?? booking.service?.basePrice ?? 0;
  const isLoading = actionLoading === booking.id;

  const originalPrice = booking.price ?? booking.service?.basePrice ?? 0;

  return (
    <tr
      className="group relative hover:bg-[#3C50E0]/5 border-b border-stroke dark:border-strokedark transition-all duration-200 animate-in slide-in-from-bottom-2 fade-in"
      style={{ animationDelay: `${idx * 30}ms`, animationFillMode: "both", zIndex: 100 - idx }}
    >
      {/* Booking ID + Service */}
      <td className="py-4 px-5">
        <p className="font-semibold text-black dark:text-white text-sm">{booking.service?.name || "Service Booking"}</p>
        <p className="text-xs text-body dark:text-bodydark2 font-mono mt-0.5">#{booking.id.slice(0, 8).toUpperCase()}</p>
      </td>

      {/* Customer */}
      <td className="py-4 px-5">
        <p className="text-sm font-medium text-black dark:text-white">{booking.customer?.user?.name || "—"}</p>
        <p className="text-xs text-body dark:text-bodydark2">{booking.customer?.user?.email || ""}</p>
      </td>

      {/* Assigned Technician */}
      <td className="py-4 px-5">
        {booking.technician?.user?.name ? (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#3C50E0] to-[#6577F3] text-[10px] font-bold text-white shadow-sm">
              {booking.technician.user.name.charAt(0)}
            </div>
            <span className="text-sm font-medium text-black dark:text-white">{booking.technician.user.name}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">Unassigned</span>
        )}
      </td>

      {/* Date */}
      <td className="py-4 px-5">
        <div className="flex items-center gap-1.5 text-sm text-body dark:text-bodydark2">
          <FiCalendar className="h-4 w-4 shrink-0" />
          {date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
        </div>
      </td>

      {/* Price */}
      <td className="py-4 px-5">
        {Number(price) > 0 ? (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">${Number(price).toFixed(2)}</span>
            {!!booking.cancellationOffer && (
              <>
                <span className="text-[10px] text-orange-500 font-medium">Cancellation Fee</span>
                {originalPrice > 0 && <span className="text-[10px] text-gray-400 font-medium line-through">Orig: ${Number(originalPrice).toFixed(2)}</span>}
              </>
            )}
          </div>
        ) : <span className="text-xs text-gray-400">—</span>}
      </td>

      {/* Status */}
      <td className="py-4 px-5 align-top">
        <div className="flex flex-col items-start gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${conf.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
            {conf.label}
          </span>
          {booking.cancellationReason && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[150px] leading-tight break-words border-l-2 border-orange-300 dark:border-orange-500/50 pl-2">
              <span className="font-semibold text-orange-500 dark:text-orange-400 block mb-0.5">Note:</span>
              {booking.cancellationReason}
            </div>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-5">
        <div className="flex items-center justify-end gap-2">
          {/* requested or technician_declined: Admin assigns or rejects */}
          {(["requested", "REQUESTED", "technician_declined"].includes(booking.status)) && (
            <>
              <AssignDropdown booking={booking} technicians={technicians} onAssign={onAssign} isLoading={isLoading} />
              <button
                onClick={() => onAction(booking.id, `bookings/${booking.id}/admin-review`, { action: "reject" })}
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-60 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                {isLoading ? <FiLoader className="animate-spin h-3.5 w-3.5" /> : <FiXCircle className="h-3.5 w-3.5" />}
                Reject
              </button>
            </>
          )}

          {/* customer_disputed: admin mediates */}
          {["customer_disputed"].includes(booking.status) && (
            <button
              onClick={() => onAction(booking.id, `bookings/${booking.id}/admin-review`, { action: "resolve" })}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-60 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              {isLoading ? <FiLoader className="animate-spin h-3.5 w-3.5" /> : <FiAlertTriangle className="h-3.5 w-3.5" />}
              Resolve Dispute
            </button>
          )}

          {/* cancellation_requested: admin just observes, technician approves */}
          {["cancellation_requested"].includes(booking.status) && (
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium mr-2">Waiting on Tech</span>
          )}

          {["assigned"].includes(booking.status) && (
            <AssignDropdown 
              booking={booking} 
              technicians={technicians} 
              onAssign={onAssign} 
              isLoading={isLoading} 
              label="Reassign Tech"
              showAll={true}
            />
          )}

          {["technician_accepted", "in_progress", "work_completed", "payment_pending"].includes(booking.status) && (
            <span className="text-xs text-body dark:text-bodydark2 italic">In progress…</span>
          )}

          {["paid", "PAID", "completed", "COMPLETED"].includes(booking.status) && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <FiCheckCircle className="h-3.5 w-3.5" /> Closed
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
function Tab({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
        active ? "bg-[#3C50E0] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-meta-4 dark:text-bodydark2 dark:hover:bg-meta-4/80"
      }`}
    >
      {label}
      {count > 0 && (
        <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${active ? "bg-white/25 text-white" : "bg-gray-300 text-gray-700 dark:bg-meta-4 dark:text-white"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const token = getCookie("accessToken");
      const h = { Authorization: `Bearer ${token}` };
      const [bRes, tRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, { headers: h }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/technicians`, { headers: h }),
      ]);
      const [bData, tData] = await Promise.all([bRes.json(), tRes.json()]);
      if (bData.success && Array.isArray(bData.data)) setBookings(bData.data);
      if (tData.success && Array.isArray(tData.data)) setTechnicians(tData.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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
        fetchData(true);
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssign = async (bookingId: string, technicianId: string) => {
    setActionLoading(bookingId);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/admin-review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "reassign", technicianId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Technician assigned successfully!");
        fetchData(true);
      } else {
        toast.error(data.message || "Failed to assign technician");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  // Counts per tab
  const counts = useMemo(() => ({
    all: bookings.length,
    requested: bookings.filter(b => ["requested", "REQUESTED"].includes(b.status)).length,
    active: bookings.filter(b => ["assigned", "technician_accepted", "in_progress", "work_completed", "payment_pending", "ACCEPTED", "IN_PROGRESS"].includes(b.status)).length,
    disputed: bookings.filter(b => b.status === "customer_disputed").length,
    completed: bookings.filter(b => ["completed", "paid", "COMPLETED", "PAID"].includes(b.status) && !b.cancellationOffer).length,
    cancel_pending: bookings.filter(b => ["cancellation_requested", "cancellation_approved"].includes(b.status)).length,
    direct_cancel: bookings.filter(b => ["cancelled", "CANCELLED", "admin_rejected", "technician_declined"].includes(b.status) && !b.cancellationOffer).length,
    fee_cancel: bookings.filter(b => (["cancelled", "CANCELLED", "paid", "PAID"].includes(b.status) && !!b.cancellationOffer)).length,
  }), [bookings]);

  const totalCancellationFees = useMemo(() => {
    return bookings
      .filter(b => (["paid", "PAID", "completed", "COMPLETED", "cancelled", "CANCELLED"].includes(b.status) && !!b.cancellationOffer))
      .reduce((sum, b) => sum + Number(b.cancellationOffer || 0), 0);
  }, [bookings]);

  const filtered = useMemo(() => {
    let list = bookings;
    if (activeTab === "requested") list = list.filter(b => ["requested", "REQUESTED", "technician_declined"].includes(b.status));
    else if (activeTab === "active") list = list.filter(b => ["assigned", "technician_accepted", "in_progress", "work_completed", "payment_pending", "ACCEPTED", "IN_PROGRESS"].includes(b.status));
    else if (activeTab === "disputed") list = list.filter(b => b.status === "customer_disputed");
    else if (activeTab === "completed") list = list.filter(b => ["completed", "paid", "COMPLETED", "PAID"].includes(b.status) && !b.cancellationOffer);
    else if (activeTab === "cancel_pending") list = list.filter(b => ["cancellation_requested", "cancellation_approved"].includes(b.status));
    else if (activeTab === "direct_cancel") list = list.filter(b => ["cancelled", "CANCELLED", "admin_rejected", "technician_declined"].includes(b.status) && !b.cancellationOffer);
    else if (activeTab === "fee_cancel") list = list.filter(b => (["cancelled", "CANCELLED", "paid", "PAID"].includes(b.status) && !!b.cancellationOffer));

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        (b.service?.name || "").toLowerCase().includes(q) ||
        (b.customer?.user?.name || "").toLowerCase().includes(q) ||
        (b.technician?.user?.name || "").toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, activeTab, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e2340] via-[#2a3175] to-[#1e2340] p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Bookings Management
              <span className="flex h-7 items-center justify-center rounded-full bg-indigo-500/30 px-3 text-xs font-bold text-indigo-200 border border-indigo-400/20">
                {bookings.length} Total
              </span>
            </h2>
            <p className="mt-2 text-indigo-200/80 max-w-lg text-sm leading-relaxed">
              Review incoming requests, assign technicians, resolve disputes, and track all bookings across the platform.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search bookings…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full sm:w-64 rounded-xl border border-white/10 bg-black/20 py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/40 outline-none backdrop-blur-md transition-all focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md hover:bg-black/30 transition-all cursor-pointer disabled:opacity-60"
            >
              <FiRefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-[80px]" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]" />
      </div>

      {/* ── Attention cards ── */}
      {!loading && (counts.requested > 0 || counts.disputed > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {counts.requested > 0 && (
            <div onClick={() => setActiveTab("requested")} className="flex items-center gap-4 rounded-2xl border-2 border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10 p-5 cursor-pointer hover:shadow-md transition-all">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                <FiCalendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{counts.requested}</p>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-300">Requests needing assignment</p>
              </div>
            </div>
          )}
          {counts.disputed > 0 && (
            <div onClick={() => setActiveTab("disputed")} className="flex items-center gap-4 rounded-2xl border-2 border-rose-300 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10 p-5 cursor-pointer hover:shadow-md transition-all">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm">
                <FiAlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-700 dark:text-rose-400">{counts.disputed}</p>
                <p className="text-sm font-medium text-rose-600 dark:text-rose-300">Disputes needing resolution</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-2">
        <Tab label="All" count={counts.all} active={activeTab === "all"} onClick={() => setActiveTab("all")} />
        <Tab label="Requested" count={counts.requested} active={activeTab === "requested"} onClick={() => setActiveTab("requested")} />
        <Tab label="Active" count={counts.active} active={activeTab === "active"} onClick={() => setActiveTab("active")} />
        <Tab label="Disputed" count={counts.disputed} active={activeTab === "disputed"} onClick={() => setActiveTab("disputed")} />
        <Tab label="Completed" count={counts.completed} active={activeTab === "completed"} onClick={() => setActiveTab("completed")} />
        <Tab label="Cancel Pending" count={counts.cancel_pending} active={activeTab === "cancel_pending"} onClick={() => setActiveTab("cancel_pending")} />
        <Tab label="Direct Cancelled" count={counts.direct_cancel} active={activeTab === "direct_cancel"} onClick={() => setActiveTab("direct_cancel")} />
        <Tab label="Fee Cancelled" count={counts.fee_cancel} active={activeTab === "fee_cancel"} onClick={() => setActiveTab("fee_cancel")} />
      </div>

      {activeTab === "fee_cancel" && (
        <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/30 dark:bg-orange-500/10">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">Total Cancellation Fees Collected</span>
            <span className="text-xs text-orange-600 dark:text-orange-300">Revenue generated from finalized cancellations</span>
          </div>
          <span className="text-xl font-bold text-orange-700 dark:text-orange-400">${totalCancellationFees.toFixed(2)}</span>
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-stroke dark:bg-meta-4 dark:border-strokedark">
                {["Service / ID", "Customer", "Technician", "Date", "Price", "Status", "Actions"].map(col => (
                  <th key={col} className="py-4 px-5 text-left text-xs font-semibold uppercase tracking-wider text-body dark:text-bodydark2">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-stroke dark:border-strokedark animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="py-4 px-5">
                        <div className="h-4 rounded bg-gray-100 dark:bg-meta-4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-body dark:text-bodydark2">
                      <FiInbox className="w-10 h-10 opacity-30" />
                      <p className="font-medium">No bookings found</p>
                      <p className="text-sm opacity-70">Try adjusting your filter or search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((booking, idx) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    technicians={technicians}
                    onAction={handleAction}
                    onAssign={handleAssign}
                    actionLoading={actionLoading}
                    idx={idx}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
