"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Goal, ChevronDown, ChevronUp } from "lucide-react";

const states = [
  "All States",
  "New South Wales (NSW)",
  "Queensland (QLD)",
  "South Australia (SA)",
  "Tasmania (TAS)",
  "Victoria (VIC)",
  "Western Australia (WA)"
];

export function HeroSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("All States");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 999,
      boxShadow: "0 12px 40px rgba(15,23,42,.08)",
      padding: "8px 8px 8px 24px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      maxWidth: 680,
      border: "1px solid #F1F5F9",
      marginBottom: 32,
    }}>
      {/* Search Service */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1.2 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Search style={{ width: 18, height: 18, color: "#0F172A" }} />
        </div>
        <div>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>e.g. Plumbing, Cleaning</p>
        </div>
      </div>
      
      <div style={{ width: 1, height: 40, background: "#E2E8F0" }} />
      
      {/* Location Dropdown */}
      <div style={{ position: "relative", flex: 1 }} ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 10, 
            background: "#EFF6FF", // Light blue to match website theme
            padding: "12px 18px", 
            borderRadius: 999, 
            border: "none",
            cursor: "pointer",
            width: "100%",
            justifyContent: "space-between",
            color: "#2563EB" // Primary blue to match website theme
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Goal style={{ width: 18, height: 18 }} />
            <span style={{ fontSize: 15, fontWeight: 600 }}>
              {selectedState.includes('(') ? selectedState.split('(')[1].replace(')', '') : selectedState}
            </span>
          </div>
          {isOpen ? <ChevronUp style={{ width: 16, height: 16 }} /> : <ChevronDown style={{ width: 16, height: 16 }} />}
        </button>

        {isOpen && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            width: "240px",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 10px 40px rgba(15,23,42,.15)",
            border: "1px solid #F1F5F9",
            zIndex: 50,
            padding: "8px 0",
            overflow: "hidden"
          }}>
            {states.map((state) => (
              <button
                key={state}
                onClick={() => {
                  setSelectedState(state);
                  setIsOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 20px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#475569",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {state}
              </button>
            ))}
          </div>
        )}
      </div>

      <button style={{
        background: "#2563EB",
        color: "#fff",
        border: "none",
        padding: "14px 28px",
        borderRadius: 999,
        fontWeight: 600,
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
      }}>
        Find Professionals
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}
