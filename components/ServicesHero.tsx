"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Lock,
  BadgeCheck,
} from "lucide-react";

const trustFeatures = [
  { icon: ShieldCheck, title: "Verified", subtitle: "Professionals" },
  { icon: Lock, title: "Secure", subtitle: "Payments" },
  { icon: BadgeCheck, title: "100% Satisfaction", subtitle: "Guarantee" },
];

const locations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
];

export default function ServicesHero() {
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  return (
    <section className="services-hero-section">
      <div className="container">
        <div className="services-hero-grid">
          {/* Left */}
          <div className="services-hero-left">
            <p className="services-hero-label">OUR SERVICES</p>
            <h1 className="services-hero-heading">
              All your home <br /> services in one place
            </h1>
            <p className="services-hero-desc">
              From small fixes to major tasks, find trusted professionals for every home need. Quality service, every time.
            </p>

            {/* Search Block */}
            <div className="services-search-block">
              <div className="services-search-input-wrap">
                <input
                  type="text"
                  placeholder="Search for a service..."
                  className="services-search-input"
                />
                <button className="services-search-btn">
                  <Search style={{ width: 18, height: 18, color: "#fff" }} />
                </button>
              </div>

              <div className="services-location-wrap">
                <div 
                  className="services-location-selector"
                  onClick={() => setLocationOpen(!locationOpen)}
                >
                  <div className="services-location-icon">
                    <MapPin style={{ width: 20, height: 20, color: "#475569" }} />
                  </div>
                  <div className="services-location-text">
                    <span className="services-location-label">Your Location</span>
                    <span className="services-location-value">{selectedLocation}</span>
                  </div>
                  <ChevronDown style={{ width: 18, height: 18, color: "#475569", marginLeft: "auto", transition: "transform 0.2s", transform: locationOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                </div>
                
                {/* Dropdown Menu */}
                {locationOpen && (
                  <div className="services-location-dropdown">
                    {locations.map((loc, i) => (
                      <div 
                        key={i} 
                        className={`services-location-option ${selectedLocation === loc ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationOpen(false);
                        }}
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="services-trust-badges">
              {trustFeatures.map((feat, i) => (
                <div key={i} className="services-trust-badge">
                  <div className="services-trust-icon">
                    <feat.icon style={{ width: 20, height: 20, color: "#2563EB" }} />
                  </div>
                  <div>
                    <p className="services-trust-title">{feat.title}</p>
                    <p className="services-trust-subtitle">{feat.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="services-hero-right">
            {/* Decorative dots */}
            <div className="services-dots">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                {Array.from({ length: 6 }).map((_, row) =>
                  Array.from({ length: 6 }).map((_, col) => (
                    <circle key={`${row}-${col}`} cx={10 + col * 22} cy={10 + row * 22} r="3" fill="#BFDBFE" />
                  ))
                )}
              </svg>
            </div>

            {/* Blue blob */}
            <div className="services-blob" />

            {/* Image */}
            <div className="services-hero-img-frame">
              <Image
                src="/person.png"
                alt="Professional technician"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "top center" }}
                priority
              />
            </div>

            {/* Floating trust badge */}
            <div className="services-floating-badge">
              <div className="services-floating-badge-icon">
                <ShieldCheck style={{ width: 20, height: 20, color: "#fff" }} />
              </div>
              <div>
                <p className="services-floating-badge-title">Reliable. Professional.</p>
                <p className="services-floating-badge-sub">Always Trusted.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
