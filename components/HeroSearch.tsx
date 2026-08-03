"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Goal, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";



export function HeroSearch() {
  const router = useRouter();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  
  const [selectedState, setSelectedState] = useState("All Locations");
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  
  const [categories, setCategories] = useState<string[]>(["All Services"]);
  const [locations, setLocations] = useState<string[]>(["All Locations"]);
  
  const locationRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    // Fetch categories and technicians for dynamic data
    const fetchData = async () => {
      try {
        const [catRes, techRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/technicians`)
        ]);
        
        const catData = await catRes.json();
        const techData = await techRes.json();
        
        if (catData.success && Array.isArray(catData.data)) {
          setCategories(["All Services", ...catData.data.map((c: any) => c.name)]);
        }
        
        if (techData.success && Array.isArray(techData.data)) {
          const uniqueLocs = Array.from(new Set(techData.data.map((t: any) => t.location).filter(Boolean))) as string[];
          setLocations(["All Locations", ...uniqueLocs]);
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };
    
    fetchData();
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== "All Services") {
      params.set("q", selectedCategory);
    }
    
    if (selectedState !== "All Locations") {
      params.set("loc", selectedState);
    }
    
    router.push(`/technicians?${params.toString()}`);
  };

  return (
    <div className="hero-search-wrapper">
      {/* Category Dropdown */}
      <div style={{ position: "relative", flex: 1.5 }} ref={categoryRef}>
        <div 
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="hero-search-input-group" 
          style={{ cursor: "pointer", width: "100%", paddingRight: 10, position: "relative" }}
        >
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Search style={{ width: 18, height: 18, color: "#0F172A" }} />
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: selectedCategory === "All Services" ? "#94A3B8" : "#334155" }}>
              {selectedCategory}
            </span>
            {isCategoryOpen ? <ChevronUp style={{ width: 16, height: 16, color: "#94A3B8" }} /> : <ChevronDown style={{ width: 16, height: 16, color: "#94A3B8" }} />}
          </div>
        </div>

        {isCategoryOpen && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            width: "100%",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 10px 40px rgba(15,23,42,.15)",
            border: "1px solid #F1F5F9",
            zIndex: 50,
            padding: "8px 0",
            maxHeight: "300px",
            overflowY: "auto"
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsCategoryOpen(false);
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
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="hero-search-divider" />
      
      {/* Location Dropdown */}
      <div style={{ position: "relative", flex: 1 }} ref={locationRef}>
        <button 
          onClick={() => setIsLocationOpen(!isLocationOpen)}
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
          {isLocationOpen ? <ChevronUp style={{ width: 16, height: 16 }} /> : <ChevronDown style={{ width: 16, height: 16 }} />}
        </button>

        {isLocationOpen && (
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
            maxHeight: "300px",
            overflowY: "auto"
          }}>
            {locations.map((state) => (
              <button
                key={state}
                onClick={() => {
                  setSelectedState(state);
                  setIsLocationOpen(false);
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

      <button className="hero-search-btn" onClick={handleSearch}>
        Find Professionals
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}
