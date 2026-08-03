"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Star, MapPin, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CustomSelect from "@/components/CustomSelect";
import { Filter } from "lucide-react";


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

function TechniciansContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const initialLoc = searchParams.get("loc") || "Select location";
  const initialCategory = searchParams.get("category") || "All";

  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Custom Dropdown states
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Highest Rated");
  const [areaOpen, setAreaOpen] = useState(false);
  const [serviceArea, setServiceArea] = useState(initialLoc);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [techRes, catRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/technicians`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
        ]);
        
        const techData = await techRes.json();
        const catData = await catRes.json();
        
        if (techData.success) {
          setTechnicians(techData.data);
        } else {
          toast.error("Failed to load professionals.");
        }
        
        if (catData.success && Array.isArray(catData.data)) {
          const techCategoryNames = new Set<string>();
          if (techData.success && Array.isArray(techData.data)) {
            techData.data.forEach((tech: any) => {
              tech.services?.forEach((s: any) => {
                if (s.category?.name) techCategoryNames.add(s.category.name);
              });
              if (tech.bio) {
                catData.data.forEach((c: any) => {
                  if (tech.bio.includes(c.name)) techCategoryNames.add(c.name);
                });
              }
            });
          }
          
          const filteredCategories = catData.data
            .map((c: any) => c.name)
            .filter((catName: string) => techCategoryNames.has(catName));
            
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
      {/* Premium Hero Banner */}
      <div className="premium-hero">
        <div className="premium-hero-bg"></div>
        <div className="premium-hero-glow"></div>
        <div className="premium-hero-content">
          <h1 className="premium-hero-title">Our Professionals</h1>
          <p className="premium-hero-subtitle">Discover top-rated experts ready to handle your home service needs.</p>
        </div>
      </div>
      
      <div className="all-services-layout">
        <input type="checkbox" id="mobile-sidebar-toggle" style={{ display: "none" }} />
        
        <label htmlFor="mobile-sidebar-toggle" className="mobile-sidebar-overlay"></label>

        {/* SIDEBAR */}
        <aside className="all-services-sidebar">
          <label htmlFor="mobile-sidebar-toggle" className="mobile-sidebar-close">
            <X size={24} />
          </label>
          
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
            <CustomSelect 
              options={locationOptions}
              value={serviceArea}
              onChange={(val) => setServiceArea(val)}
            />
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
            
            <div className="as-sort-filter-row">
              <div className="as-sort">
                <span style={{ color: "#64748b" }}>Sort by :</span>
                <CustomSelect 
                  options={["Highest Rated", "Lowest Price", "Most Reviewed"]}
                  value={sortBy}
                  onChange={(val) => setSortBy(val)}
                  className="w-40"
                />
              </div>

              <label htmlFor="mobile-sidebar-toggle" className="mobile-filter-btn">
                <Filter size={18} /> Filters
              </label>
            </div>
          </div>

          <div className="as-active-filters">
            <div className="as-active-filter-chip">
              Specialization: {selectedCategory} <X size={14} onClick={() => setSelectedCategory("All")} />
            </div>
          </div>

          <h2 className="as-main-title">All Professionals <span>{filteredTechnicians.length} results</span></h2>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 0" }}>
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-slate-500 font-medium">Loading professionals...</p>
            </div>
          ) : filteredTechnicians.length > 0 ? (
            <div className="as-grid">
              {filteredTechnicians.map((tech, index) => (
                <div className="as-card" key={tech.id}>
                <div className="as-card-img">
                  <Image 
                    src={getFallbackImage(tech.user?.name || "")} 
                    alt={tech.user?.name || "Professional"} 
                    fill 
                    priority={index < 4}
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.9)", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600, color: "#1E293B" }}>
                    {tech.availabilitySlots?.[0] || "Available"}
                  </div>
                </div>
                <div className="as-card-content">
                  <h3 className="as-card-title">{tech.user?.name}</h3>
                  <p className="as-card-bio">{tech.bio}</p>
                  
                  <div className="as-card-rating">
                    <Star className="as-card-rating-star" size={16} fill="currentColor" />
                    <span style={{ fontWeight: 600, color: "#1E293B" }}>{Number(tech.averageRating || 5.0).toFixed(1)}</span>
                    <span className="as-card-rating-count">({tech.reviewCount || 0} reviews)</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                    <MapPin size={14} /> {tech.location || "City Wide"}
                  </div>

                  <div className="as-card-footer">
                    <div className="as-card-price">
                      ${Number(tech.pricingRate).toFixed(2)}<span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>/hr</span>
                    </div>
                    <Link href={`/technicians/${tech.id}`} className="as-card-btn" style={{ textDecoration: "none" }}>
                      View Profile
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

export default function TechniciansPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    }>
      <TechniciansContent />
    </Suspense>
  );
}
