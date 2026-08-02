"use client";
import Link from "next/link";
import { Home } from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { label: "Home",         href: "/" },
    { label: "Services",     href: "/services" },
    { label: "Technicians",  href: "/technicians" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "About Us",     href: "/about" },
  ],
  "For Customers": [
    { label: "Help Center",          href: "#" },
    { label: "FAQs",                 href: "#" },
    { label: "Reviews",              href: "#" },
    { label: "Earnings",             href: "#" },
    { label: "Cancellation Policy",  href: "#" },
  ],
  "For Professionals": [
    { label: "Become a Technician", href: "#" },
    { label: "Guide Lines",          href: "#" },
    { label: "Earnings",             href: "#" },
    { label: "Support",              href: "#" },
  ],
};

const socials = [
  { label: "Facebook",  href: "#", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
  { label: "Twitter",   href: "#", path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" },
  { label: "Instagram", href: "#", path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.5 2.5h9a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-9a5 5 0 0 1-5-5v-9a5 5 0 0 1 5-5z" },
  { label: "LinkedIn",  href: "#", path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
];

export function Footer() {
  return (
    <footer style={{ background: "#0B0F19", borderTop: "1px solid #1E293B", position: "relative", overflow: "hidden" }}>
      {/* Decorative subtle glow */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)" }} />
      <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "200px", background: "rgba(59, 130, 246, 0.05)", filter: "blur(80px)", borderRadius: "50%", pointerEvents: "none" }} />
      
      <style>{`
        .footer-link {
          color: #94A3B8;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
        }
        .footer-link:hover {
          color: #F8FAFC;
          transform: translateX(4px);
        }
        .social-link {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: #1E293B;
          border: 1px solid #334155;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .social-link:hover {
          background: #2563EB;
          border-color: #2563EB;
          transform: translateY(-2px);
        }
        .social-link:hover svg {
          stroke: #fff !important;
        }
      `}</style>
      
      <div className="container" style={{ paddingTop: 80, paddingBottom: 64, position: "relative", zIndex: 1 }}>
        <div className="footer-grid">
          
          {/* Brand & Description (Takes up more space on large screens) */}
          <div className="brand-col">
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #3B82F6, #1D4ED8)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}>
                <Home style={{ width: 20, height: 20, color: "#fff" }} />
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>FixItNow</span>
            </Link>
            <p style={{ color: "#94A3B8", fontSize: 15, lineHeight: 1.8, marginBottom: 32, maxWidth: 320 }}>
              Your trusted home service platform. Connecting you with skilled, verified, and highly-rated professionals for all your home needs.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: 12 }}>
              {socials.map(({ label, href, path }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="social-link"
                >
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "#94A3B8", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", transition: "stroke 0.2s ease" }}>
                    <path d={path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, color: "#F8FAFC", marginBottom: 24, letterSpacing: "0.02em" }}>{title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16, padding: 0, margin: 0 }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid #1E293B", background: "#080B13" }}>
        <div className="container footer-bottom">
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <div style={{ display: "flex", gap: 32 }}>
            <Link href="#" style={{ color: "#64748B", fontSize: 14, textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#F8FAFC")} onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}>Privacy Policy</Link>
            <Link href="#" style={{ color: "#64748B", fontSize: 14, textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#F8FAFC")} onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
