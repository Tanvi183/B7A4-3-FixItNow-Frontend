"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, Search, Clock, X, Calendar, Loader2, CheckCircle } from "lucide-react";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import PremiumDatePicker from "@/components/PremiumDatePicker";

interface ServiceGridProps {
  services: any[];
}

const getFallbackImage = (idx: number) => {
  const fallbacks = ["/cleaning.png", "/light_install.png", "/painting.png"];
  return fallbacks[idx % fallbacks.length];
};

const TIME_SLOTS = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

export default function ServiceGrid({ services }: ServiceGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const { user } = useAuthStore();

  // Bookings the user has already made (to detect active state per service)
  const [activeBookingsMap, setActiveBookingsMap] = useState<Record<string, string>>({});

  // Modal state
  const [modalSvc, setModalSvc] = useState<any>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // ── Load user bookings to detect already-requested services ──────────────
  const loadBookings = useCallback(async () => {
    if (!user) return;
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const bookings: any[] = data.data || data || [];
      const map: Record<string, string> = {};
      bookings.forEach((b) => {
        if (!["cancelled", "completed", "paid", "CANCELLED", "COMPLETED", "PAID", "admin_rejected", "DECLINED", "customer_disputed"].includes(b.status)) {
          map[b.serviceId] = b.status;
        }
      });
      setActiveBookingsMap(map);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  }, [user]);

  useEffect(() => {
    const token = getCookie("accessToken");
    if (token) loadBookings();
  }, [user, loadBookings]);

  // ── Open modal ────────────────────────────────────────────────────────────
  const openModal = (svc: any) => {
    // user from Zustand OR check the cookie directly (handles hydration race)
    const token = getCookie("accessToken");
    if (!user && !token) {
      toast.error("Please log in to book a service");
      window.location.href = `/login?redirect=/all-services`;
      return;
    }
    setModalSvc(svc);
    setDate("");
    setTime("");
  };

  // ── Close modal ───────────────────────────────────────────────────────────
  const closeModal = () => {
    if (submitting) return;
    setModalSvc(null);
  };

  // ── Submit booking ────────────────────────────────────────────────────────
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Please select a date and time slot");
      return;
    }
    setSubmitting(true);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: modalSvc.id,
          bookingDate: new Date(date).toISOString(),
          timeSlot: time,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      // Mark this service as requested immediately (no page reload needed)
      setActiveBookingsMap((prev) => ({ ...prev, [modalSvc.id]: "requested" }));
      toast.success("Request sent to Admin! You'll be notified once accepted.");
      setModalSvc(null);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const visibleServices = services.slice(0, visibleCount);
  const hasMore = visibleCount < services.length;

  if (services.length === 0) {
    return (
      <div className="as-grid">
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "64px 20px",
            background: "#fff",
            borderRadius: 24,
            border: "1px dashed #cbd5e1",
          }}
        >
          <Search style={{ width: 48, height: 48, color: "#cbd5e1", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
            No services found
          </h3>
          <p style={{ color: "#64748B", fontSize: 15 }}>
            Try adjusting your filters or browsing a different category.
          </p>
          <button
            onClick={() => (window.location.href = "/all-services")}
            className="btn-outline"
            style={{ marginTop: 24 }}
          >
            Clear all filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Service Cards ─────────────────────────────────────────────────── */}
      <div className="as-grid">
        {visibleServices.map((svc, idx) => {
          const activeStatus = activeBookingsMap[svc.id];
          let statusLabel = "";
          if (activeStatus) {
            if (["requested", "REQUESTED"].includes(activeStatus)) statusLabel = "Pending";
            else if (["assigned"].includes(activeStatus)) statusLabel = "Assigned";
            else if (["technician_accepted", "ACCEPTED"].includes(activeStatus)) statusLabel = "Tech Coming";
            else if (["in_progress", "IN_PROGRESS"].includes(activeStatus)) statusLabel = "In Progress";
            else if (["work_completed", "payment_pending"].includes(activeStatus)) statusLabel = "Payment Pending";
            else if (["cancellation_requested", "cancellation_approved"].includes(activeStatus)) statusLabel = "Cancelling...";
            else statusLabel = "Active";
          }
          return (
            <div key={svc.id || idx} className="as-card">
              <div className="as-card-img">
                <Image
                  src={getFallbackImage(idx)}
                  alt={svc.name}
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="as-card-content">
                <h3 className="as-card-title">{svc.name}</h3>
                <div className="as-card-rating">
                  <Star style={{ width: 16, height: 16 }} className="as-card-rating-star" fill="currentColor" />
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>5.0</span>
                  <span className="as-card-rating-count">(120 reviews)</span>
                </div>

                <div className="as-card-footer">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Starting from</span>
                    <div className="as-card-price" style={{ marginBottom: 0 }}>
                      ${Number(svc.basePrice).toFixed(2)}
                    </div>
                  </div>

                  {activeStatus ? (
                    <button
                      className="as-card-btn"
                      disabled
                      style={{
                        background: "#f1f5f9",
                        color: "#64748b",
                        border: "1px solid #e2e8f0",
                        cursor: "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      <Clock size={14} style={{ marginRight: 6 }} />
                      {statusLabel}
                    </button>
                  ) : (
                    <button
                      className="as-card-btn"
                      onClick={() => openModal(svc)}
                      style={{ cursor: "pointer" }}
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: 48, marginBottom: 24 }}>
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="btn-outline"
            style={{ padding: "14px 32px", fontSize: 15, borderRadius: 12 }}
          >
            Load More Services
          </button>
        </div>
      )}

      {/* ── Booking Modal ──────────────────────────────────────────────────── */}
      {modalSvc && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.55)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
              animation: "fadeInUp 0.2s ease",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <div>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>
                  Book Service
                </h3>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: "4px 0 0" }}>
                  {modalSvc.name}
                </p>
              </div>
              <button
                onClick={closeModal}
                disabled={submitting}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleBooking} style={{ padding: 24 }}>
              {/* Service Info */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>
                  Service Price
                </span>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>
                  ${Number(modalSvc.basePrice).toFixed(2)}
                </span>
              </div>

              {/* Date Picker */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  <Calendar size={15} style={{ color: "#2563EB" }} />
                  Select Date
                </label>
                <PremiumDatePicker 
                  value={date} 
                  onChange={(newDate) => setDate(newDate)} 
                  minDate={new Date(today + "T00:00:00")}
                />
              </div>

              {/* Time Slot */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  <Clock size={15} style={{ color: "#2563EB" }} />
                  Select Time Slot
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      style={{
                        padding: "10px 8px",
                        border: `1.5px solid ${time === slot ? "#2563EB" : "#e2e8f0"}`,
                        borderRadius: 10,
                        background: time === slot ? "#eff6ff" : "#fff",
                        color: time === slot ? "#2563EB" : "#475569",
                        fontSize: 12,
                        fontWeight: time === slot ? 600 : 400,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {!time && (
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
                    Please select a time slot above
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !date || !time}
                style={{
                  width: "100%",
                  padding: "14px",
                  background:
                    submitting || !date || !time
                      ? "#cbd5e1"
                      : "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: submitting || !date || !time ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "background 0.2s",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Send Request to Admin
                  </>
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 12 }}>
                You'll pay once the admin reviews and accepts your request.
              </p>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
