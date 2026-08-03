"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Search, Clock } from "lucide-react";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";

interface ServiceGridProps {
  services: any[];
}

const getFallbackImage = (idx: number) => {
  const fallbacks = ["/cleaning.png", "/light_install.png", "/painting.png"];
  return fallbacks[idx % fallbacks.length];
};

export default function ServiceGrid({ services }: ServiceGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const { user, isHydrated } = useAuthStore();
  const [userBookings, setUserBookings] = useState<any[]>([]);

  useEffect(() => {
    if (isHydrated && user) {
      const fetchMyBookings = async () => {
        try {
          const token = getCookie("accessToken");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) {
            setUserBookings(data.data || data);
          }
        } catch (err) {
          console.error("Failed to fetch user bookings", err);
        }
      };
      fetchMyBookings();
    }
  }, [user, isHydrated]);

  const visibleServices = services.slice(0, visibleCount);
  const hasMore = visibleCount < services.length;

  if (services.length === 0) {
    return (
      <div className="as-grid">
        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "64px 20px", background: "#fff", borderRadius: 24, border: "1px dashed #cbd5e1" }}>
          <Search style={{ width: 48, height: 48, color: "#cbd5e1", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>No services found</h3>
          <p style={{ color: "#64748B", fontSize: 15 }}>Try adjusting your filters or browsing a different category.</p>
          <button onClick={() => window.location.href='/all-services'} className="btn-outline" style={{ marginTop: 24 }}>Clear all filters</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="as-grid">
        {visibleServices.map((svc, idx) => {
          const pendingBooking = userBookings.find(b => b.serviceId === svc.id && b.status === "requested");
          
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
                {pendingBooking ? (
                  <button className="as-card-btn" disabled style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", cursor: "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <Clock size={14} /> Pending
                  </button>
                ) : (
                  <a href={`/checkout/${svc.id}`} className="as-card-btn" style={{ textDecoration: 'none', textAlign: 'center', display: 'block' }}>Book Now</a>
                )}
              </div>
            </div>
          </div>
        )})}
      </div>

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: 48, marginBottom: 24 }}>
          <button 
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="btn-outline"
            style={{ padding: "14px 32px", fontSize: 15, borderRadius: 12 }}
          >
            Load More Services
          </button>
        </div>
      )}
    </>
  );
}
