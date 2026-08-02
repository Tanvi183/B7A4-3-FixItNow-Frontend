"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Star, MapPin, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

const categories = [
  "Electrical works",
  "Plumbing",
  "HVAC",
  "Cleaning",
  "Carpentry",
  "General Maintenance"
];

const rates = [
  "All Rates",
  "Under $40/hr",
  "$40 - $60/hr",
  "$60 - $80/hr",
  "$80+ /hr"
];

// Helper to get a realistic fallback image based on name
const getFallbackImage = (name: string) => {
  if (name.includes("Michael")) return "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop";
  if (name.includes("Sarah")) return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop";
  if (name.includes("David")) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop";
  if (name.includes("Emily")) return "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop";
  // Default fallback
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&size=400`;
};

export default function TechniciansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Custom Dropdown states
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Highest Rated");
  const [areaOpen, setAreaOpen] = useState(false);
  const [serviceArea, setServiceArea] = useState("Select location");

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/technicians`);
        const data = await res.json();
        
        if (data.success) {
          setTechnicians(data.data);
        } else {
          toast.error("Failed to load professionals.");
        }
      } catch (error) {
        console.error("Error fetching technicians:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTechnicians();
  }, []);

  // Extract unique locations from backend data
  const uniqueLocations = Array.from(new Set(technicians.map(t => t.location).filter(Boolean)));
  const locationOptions = ["Select location", "All Areas", ...uniqueLocations];

  // Compute filtered list
  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = tech.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For categories, checking if the technician has any service in this category or if their bio mentions it
    const matchesCategory = selectedCategory === "All" || 
      tech.services?.some((s: any) => s.category?.name === selectedCategory) ||
      tech.bio?.includes(selectedCategory);
      
    const matchesArea = serviceArea === "Select location" || serviceArea === "All Areas" || tech.location === serviceArea;

    return matchesSearch && matchesCategory && matchesArea;
  });

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div className="all-services-layout">
        
        {/* SIDEBAR */}
        <aside className="all-services-sidebar">
          
          <div className="filter-section">
            <h3 className="filter-title">Filter</h3>
            <label className="filter-toggle">
              <div className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </div>
              <span>Available Today</span>
            </label>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Specialization</h3>
            <div className="filter-list">
              <label className="filter-label">
                <input 
                  type="radio" 
                  name="category" 
                  checked={selectedCategory === "All"} 
                  onChange={() => setSelectedCategory("All")}
                />
                <span>All Specializations</span>
              </label>
              {categories.map((cat, i) => (
                <label key={i} className="filter-label">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Hourly Rate</h3>
            <div className="filter-list">
              {rates.map((rate, i) => (
                <label key={i} className="filter-label">
                  <input type="checkbox" defaultChecked={i === 0} />
                  <span>{rate}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section" style={{ marginBottom: 0 }}>
            <h3 className="filter-title">Service Area</h3>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setAreaOpen(!areaOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  background: "#fff",
                  color: "#475569",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <span style={{ fontSize: 14 }}>{serviceArea}</span>
                <svg style={{ width: 16, height: 16, color: "#94a3b8", transform: areaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {areaOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  width: "100%",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  zIndex: 20,
                  overflow: "hidden"
                }}>
                  {locationOptions.map(area => (
                    <div
                      key={area as string}
                      onClick={() => {
                        setServiceArea(area);
                        setAreaOpen(false);
                      }}
                      style={{
                        padding: "8px 12px",
                        fontSize: 14,
                        color: serviceArea === area ? "#2563EB" : "#475569",
                        background: serviceArea === area ? "#F8FAFC" : "#fff",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = serviceArea === area ? "#F8FAFC" : "#fff")}
                    >
                      {area}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="all-services-main">
          
          <div className="as-topbar">
            <div className="as-search-container">
              <Search style={{ width: 18, height: 18, color: "#94a3b8" }} />
              <input 
                type="text" 
                placeholder="Search professionals by name..." 
                className="as-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="as-sort">
              <span>Sort by :</span>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    width: 160,
                    padding: "8px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    background: "#fff",
                    color: "#475569",
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <span style={{ fontSize: 14 }}>{sortBy}</span>
                  <svg style={{ width: 16, height: 16, color: "#94a3b8", transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {sortOpen && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    width: "100%",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    zIndex: 20,
                    overflow: "hidden"
                  }}>
                    {["Highest Rated", "Lowest Price", "Most Reviewed"].map(option => (
                      <div
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setSortOpen(false);
                        }}
                        style={{
                          padding: "8px 12px",
                          fontSize: 14,
                          color: sortBy === option ? "#2563EB" : "#475569",
                          background: sortBy === option ? "#F8FAFC" : "#fff",
                          cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = sortBy === option ? "#F8FAFC" : "#fff")}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="as-active-filters">
            <div className="as-active-filter-chip">
              Specialization: {selectedCategory} <X size={14} onClick={() => setSelectedCategory("All")} />
            </div>
          </div>

          <h2 className="as-main-title">All Professionals <span style={{ color: "#94a3b8", fontSize: 16, fontWeight: 500 }}>({filteredTechnicians.length})</span></h2>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 0" }}>
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-slate-500 font-medium">Loading professionals...</p>
            </div>
          ) : filteredTechnicians.length > 0 ? (
            <div className="as-grid">
              {filteredTechnicians.map((tech) => (
                <div className="as-card" key={tech.id}>
                <div className="as-card-img">
                  <Image 
                    src={getFallbackImage(tech.user?.name || "")} 
                    alt={tech.user?.name || "Professional"} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.9)", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600, color: "#1E293B" }}>
                    {tech.availabilitySlots?.[0] || "Available"}
                  </div>
                </div>
                <div className="as-card-content">
                  <h3 className="as-card-title">{tech.user?.name}</h3>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>{tech.bio}</p>
                  
                  <div className="as-card-rating">
                    <Star className="as-card-rating-star" size={16} fill="currentColor" />
                    <span style={{ fontWeight: 600, color: "#1E293B" }}>{Number(tech.averageRating || 5.0).toFixed(1)}</span>
                    <span className="as-card-rating-count">({tech.reviewCount || 0} reviews)</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                    <MapPin size={14} /> {tech.location || "City Wide"}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div className="as-card-price">
                      ${Number(tech.pricingRate).toFixed(2)}<span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>/hr</span>
                    </div>
                    <Link href={`/technicians/${tech.id}`} style={{ textDecoration: "none" }}>
                      <button className="as-card-btn">View Profile</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div style={{ textAlign: "center", padding: "100px 0", color: "#64748b" }}>
              <p>No professionals found matching your filters.</p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setServiceArea("Select location"); }}
                style={{ marginTop: 16, padding: "8px 16px", background: "#2563EB", color: "#fff", borderRadius: 8, cursor: "pointer", border: "none" }}
              >
                Clear Filters
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
