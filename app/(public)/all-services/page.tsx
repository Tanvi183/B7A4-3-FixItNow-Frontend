import Image from "next/image";
import Link from "next/link";
import { Search, Star, X } from "lucide-react";

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
              <span>Accepting new customers</span>
            </label>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">All Categories</h3>
            <div className="filter-list">
              <Link href="/all-services" style={{ textDecoration: 'none', color: 'inherit' }}>
                <label className="filter-label" style={{ cursor: "pointer" }}>
                  <input type="radio" name="category" readOnly checked={!selectedCategory} />
                  <span>All Categories</span>
                </label>
              </Link>
              {categories.map((cat: any, i: number) => (
                <Link key={cat.id || i} href={`/all-services?category=${cat.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <label className="filter-label" style={{ cursor: "pointer" }}>
                    <input type="radio" name="category" readOnly checked={selectedCategory === cat.id} />
                    <span>{cat.name}</span>
                  </label>
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
            <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E2E8F0", outline: "none", color: "#475569" }}>
              <option>Select location</option>
              <option>New York</option>
              <option>Los Angeles</option>
              <option>Chicago</option>
            </select>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="all-services-main">
          
          <div className="as-topbar">
            <div className="as-search-container">
              <Search style={{ width: 18, height: 18, color: "#94a3b8" }} />
              <input type="text" placeholder="Search" className="as-search-input" />
            </div>
            
            <div className="as-sort">
              <span>Sort by:</span>
              <select>
                <option>Highest Ratings</option>
                <option>Most Booked</option>
                <option>Newest Providers</option>
              </select>
            </div>
          </div>

          <div className="as-active-filters">
            <span style={{ fontSize: 14, color: "#64748b" }}>Active Filters:</span>
            <div className="as-active-filter-chip">
              House section <X style={{ width: 14, height: 14 }} />
            </div>
            <div className="as-active-filter-chip">
              $21 to $30 <X style={{ width: 14, height: 14 }} />
            </div>
          </div>

          <h2 className="as-main-title">Reliable home repair and maintenance services</h2>

          <div className="as-grid">
            {activeServices.length > 0 ? activeServices.map((svc: any, idx: number) => (
              <div key={svc.id || idx} className="as-card">
                <div className="as-card-img">
                  <Image 
                    src={getFallbackImage(idx)} 
                    alt={svc.name}
                    fill
                    priority={idx < 4}
                    sizes="(max-width: 768px) 100vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="as-card-content">
                  <h3 className="as-card-title">{svc.name}</h3>
                  <div className="as-card-rating">
                    <Star style={{ width: 14, height: 14 }} className="as-card-rating-star" fill="currentColor" />
                    <span>5.0</span>
                    <span className="as-card-rating-count">(0 reviews)</span>
                  </div>
                  <p className="as-card-price">${svc.basePrice}</p>
                  <button className="as-card-btn">View details</button>
                </div>
              </div>
            )) : (
              <p style={{ color: "#64748B", fontSize: 16 }}>No services available for this category.</p>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
