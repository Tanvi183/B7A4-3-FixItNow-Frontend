"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Star, MapPin, X } from "lucide-react";
import Link from "next/link";

// Mock Technicians Data
const mockTechnicians = [
  {
    id: "TECH-001",
    name: "Michael Chen",
    role: "Master Electrician",
    rating: "4.9",
    reviews: 124,
    hourlyRate: 65,
    location: "Downtown",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    skills: ["Wiring", "Smart Home"],
    availability: "Available Today"
  },
  {
    id: "TECH-002",
    name: "Sarah Jenkins",
    role: "Senior Plumber",
    rating: "4.8",
    reviews: 89,
    hourlyRate: 55,
    location: "North Suburbs",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    skills: ["Pipe Repair", "Heaters"],
    availability: "Tomorrow"
  },
  {
    id: "TECH-003",
    name: "David Wilson",
    role: "HVAC Specialist",
    rating: "4.7",
    reviews: 156,
    hourlyRate: 75,
    location: "All Areas",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    skills: ["AC Repair", "Heating"],
    availability: "Available Today"
  },
  {
    id: "TECH-004",
    name: "Emily Davis",
    role: "Professional Cleaner",
    rating: "5.0",
    reviews: 210,
    hourlyRate: 35,
    location: "Eastside",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    skills: ["Deep Cleaning", "Move-in/out"],
    availability: "Available Today"
  }
];

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

export default function TechniciansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Custom Dropdown states
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Highest Rated");
  const [areaOpen, setAreaOpen] = useState(false);
  const [serviceArea, setServiceArea] = useState("Select location");

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
                  {["Select location", "Downtown", "North Suburbs", "Eastside", "All Areas"].map(area => (
                    <div
                      key={area}
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

          <h2 className="as-main-title">All Professionals <span style={{ color: "#94a3b8", fontSize: 16, fontWeight: 500 }}>({mockTechnicians.length})</span></h2>

          <div className="as-grid">
            {mockTechnicians.map((tech) => (
              <div className="as-card" key={tech.id}>
                <div className="as-card-img">
                  <Image 
                    src={tech.image} 
                    alt={tech.name} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.9)", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600, color: "#1E293B" }}>
                    {tech.availability}
                  </div>
                </div>
                <div className="as-card-content">
                  <h3 className="as-card-title">{tech.name}</h3>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>{tech.role}</p>
                  
                  <div className="as-card-rating">
                    <Star className="as-card-rating-star" size={16} fill="currentColor" />
                    <span style={{ fontWeight: 600, color: "#1E293B" }}>{tech.rating}</span>
                    <span className="as-card-rating-count">({tech.reviews})</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                    <MapPin size={14} /> {tech.location}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div className="as-card-price">
                      ${tech.hourlyRate}<span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>/hr</span>
                    </div>
                    <Link href={`/technicians/${tech.id}`} style={{ textDecoration: "none" }}>
                      <button className="as-card-btn">View Profile</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>

      </div>
    </div>
  );
}
