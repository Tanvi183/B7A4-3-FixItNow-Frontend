import Image from "next/image";
import Link from "next/link";
import { Search, Star, X } from "lucide-react";
import ServiceGrid from "@/components/ServiceGrid";
import CustomSelect from "@/components/CustomSelect";
import { Filter } from "lucide-react";

export const metadata = {
  title: "All Services | FixItNow",
  description: "Browse all reliable home repair and maintenance services.",
};

const getFallbackImage = (idx: number) => {
  const fallbacks = ["/cleaning.png", "/light_install.png", "/painting.png"];
  return fallbacks[idx % fallbacks.length];
};



const prices = [
  "All Prices",
  "$10 to $20",
  "$21 to $30",
  "$31 to $40",
  "$41 to $50",
  "$51 and above"
];

export default async function AllServicesPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  let services: any[] = [];
  let categories: any[] = [];
  const resolvedParams = await searchParams;
  let selectedCategory = resolvedParams?.category || "";
  
  try {
    const [svcRes, catRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, { next: { revalidate: 60 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { next: { revalidate: 60 } })
    ]);
    
    const svcData = await svcRes.json();
    const catData = await catRes.json();
    
    if (svcData.success) services = svcData.data;
    if (catData.success) {
      // Only show categories that have at least one service
      categories = catData.data.filter((cat: any) => services.some((svc: any) => svc.categoryId === cat.id));
    }
  } catch (error) {
    console.error("Failed to fetch data", error);
  }

  const activeServices = selectedCategory ? services.filter((svc: any) => svc.categoryId === selectedCategory) : services;

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Premium Hero Banner */}
      <div className="premium-hero">
        <div className="premium-hero-bg"></div>
        <div className="premium-hero-glow"></div>
        <div className="premium-hero-content">
          <h1 className="premium-hero-title">
            Explore All Services
          </h1>
          <p className="premium-hero-subtitle">
            Find the perfect professional for your home repair and maintenance needs. Quality service, guaranteed.
          </p>
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
              <span>Accepting new customers</span>
            </label>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">All Categories</h3>
            <div className="filter-list">
              <Link href="/all-services" style={{ textDecoration: 'none', color: 'inherit' }} className="filter-label">
                <input type="radio" name="category" readOnly checked={!selectedCategory} style={{ pointerEvents: 'none' }} />
                <span>All Specializations</span>
              </Link>
              {categories.map((cat: any, i: number) => (
                <Link key={cat.id || i} href={`/all-services?category=${cat.id}`} style={{ textDecoration: 'none', color: 'inherit' }} className="filter-label">
                  <input type="radio" name="category" readOnly checked={selectedCategory === cat.id} style={{ pointerEvents: 'none' }} />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Price</h3>
            <div className="filter-list">
              {prices.map((price, i) => (
                <label key={i} className="filter-label">
                  <input type="checkbox" defaultChecked={i === 2} />
                  <span>{price}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section" style={{ marginBottom: 0 }}>
            <h3 className="filter-title">Location</h3>
            <CustomSelect 
              options={["New York", "Los Angeles", "Chicago", "Miami", "Austin"]}
              value="New York"
              placeholder="Select location"
            />
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="all-services-main">
          
          <div className="as-topbar">
            <div className="as-search-container">
              <Search style={{ width: 18, height: 18, color: "#94a3b8" }} />
              <input type="text" placeholder="Search for any service..." className="as-search-input" />
            </div>
            
            <div className="as-sort-filter-row">
              <div className="as-sort">
                <span style={{ color: "#64748b" }}>Sort by:</span>
                <CustomSelect 
                  options={["Featured", "Price: Low to High", "Price: High to Low", "Newest"]}
                  value="Featured"
                />
              </div>
              
              <label htmlFor="mobile-sidebar-toggle" className="mobile-filter-btn">
                <Filter size={18} /> Filters
              </label>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
             <h2 className="as-main-title">
               {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || "Services" : "All Services"} 
               <span>{activeServices.length} results</span>
             </h2>
          </div>

          <ServiceGrid services={activeServices} />

        </main>
      </div>
    </div>
  );
}
