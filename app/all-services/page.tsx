import ServicesHero from "@/components/ServicesHero";
import Image from "next/image";
import { Search, Star, X } from "lucide-react";

export const metadata = {
  title: "All Services | FixItNow",
  description: "Browse all reliable home repair and maintenance services.",
};

const mockServices = [
  { img: "/cleaning.png", title: "Home Complete Cleaning Solutions", rating: "4.9", count: 156, price: 35 },
  { img: "/light_install.png", title: "Setup Kitchen Appliances Easily", rating: "4.9", count: 156, price: 35 },
  { img: "/painting.png", title: "Sparkle Ease Cleaning Solutions", rating: "4.9", count: 156, price: 35 },
  { img: "/cleaning.png", title: "Setup Kitchen Appliances Easily", rating: "4.9", count: 156, price: 35 },
  { img: "/light_install.png", title: "Home Complete Cleaning Solutions", rating: "4.9", count: 156, price: 35 },
  { img: "/painting.png", title: "Sparkle Ease Cleaning Solutions", rating: "4.9", count: 156, price: 35 },
];

const categories = [
  "House section",
  "Carpentry",
  "Electrical works",
  "Plumbing",
  "Furniture works",
  "Painting",
  "Assembling",
  "Landscaping",
  "General Maintenance"
];

const prices = [
  "All Prices",
  "$10 to $20",
  "$21 to $30",
  "$31 to $40",
  "$41 to $50",
  "$51 and above"
];

export default function AllServicesPage() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <ServicesHero />

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
              {categories.map((cat, i) => (
                <label key={i} className="filter-label">
                  <input type="radio" name="category" defaultChecked={i === 0} />
                  <span>{cat}</span>
                </label>
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
            {mockServices.map((svc, idx) => (
              <div key={idx} className="as-card">
                <div className="as-card-img">
                  <Image 
                    src={svc.img} 
                    alt={svc.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="as-card-content">
                  <h3 className="as-card-title">{svc.title}</h3>
                  <div className="as-card-rating">
                    <Star style={{ width: 14, height: 14 }} className="as-card-rating-star" fill="currentColor" />
                    <span>{svc.rating}</span>
                    <span className="as-card-rating-count">({svc.count} reviews)</span>
                  </div>
                  <p className="as-card-price">${svc.price}</p>
                  <button className="as-card-btn">View details</button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
