"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{
            width: 13, height: 13,
            fill: i < count ? "var(--color-star)" : "#E2E8F0",
            color: i < count ? "var(--color-star)" : "#E2E8F0",
          }}
        />
      ))}
    </div>
  );
}

const getFallbackImage = (name: string) => {
  if (name.includes("Michael")) return "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop";
  if (name.includes("Sarah")) return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop";
  if (name.includes("David")) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop";
  if (name.includes("Emily")) return "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&size=400`;
};

export function ReviewsCarousel({ reviews }: { reviews: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(0, reviews.length - 3);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3);

  return (
    <div style={{ position: "relative" }}>
      {reviews.length > 3 && (
        <>
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="carousel-arrow carousel-arrow-left" 
            style={{ 
              top: "50%", 
              transform: "translateY(-50%)", 
              zIndex: 10, 
              opacity: currentIndex === 0 ? 0.3 : 1, 
              cursor: currentIndex === 0 ? "default" : "pointer",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-bg-card)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}
          >
            <ChevronLeft style={{ width: 20, height: 20, color: "var(--color-heading)" }} />
          </button>
          
          <button 
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className="carousel-arrow carousel-arrow-right" 
            style={{ 
              top: "50%", 
              transform: "translateY(-50%)", 
              zIndex: 10,
              opacity: currentIndex === maxIndex ? 0.3 : 1, 
              cursor: currentIndex === maxIndex ? "default" : "pointer",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-bg-card)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}
          >
            <ChevronRight style={{ width: 20, height: 20, color: "var(--color-heading)" }} />
          </button>
        </>
      )}

      <div className="reviews-grid" style={{ transition: "all 0.3s ease-in-out" }}>
        {visibleReviews.map((rev: any, index: number) => {
          const rName = rev.customer?.name || rev.name || "Customer";
          const rText = rev.comment || rev.text;
          const rImage = rev.image || getFallbackImage(rName);
          const rRating = rev.rating || 5;
          const rLocation = rev.location || "Verified Customer";
          
          return (
            <div key={rev.id || index} className="premium-review-card">
              <div className="premium-review-quote-icon">"</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", overflow: "hidden", background: "var(--color-bg-section)", flexShrink: 0, border: "2px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                  <Image src={rImage} alt={rName} fill sizes="100px" style={{ objectFit: "cover", objectPosition: "top" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 800, color: "var(--color-heading)", marginBottom: 6 }}>{rName}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Stars count={rRating} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-heading)" }}>{Number(rRating).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <p style={{ color: "var(--color-body)", fontSize: 15, lineHeight: 1.6, marginBottom: 28, position: "relative", zIndex: 1 }}>
                {rText}
              </p>
              <div className="premium-verified-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                {rLocation}
              </div>
            </div>
          );
        })}
      </div>
      
      {reviews.length > 3 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 40 }}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <div 
              key={i} 
              style={{ 
                width: 8, 
                height: 8, 
                borderRadius: "50%", 
                background: i === currentIndex ? "#2563EB" : "#CBD5E1",
                cursor: "pointer",
                transition: "background 0.2s ease"
              }} 
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
