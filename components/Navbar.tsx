"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Search, User, ArrowRight, Menu, X, Wrench, LayoutDashboard, LogOut, Briefcase, Settings, Star } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

type NavLink = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

const navLinksData: NavLink[] = [
  { label: "Home",         href: "/"                             },
  { label: "Services",     href: "/services", hasDropdown: true  },
  { label: "Technicians",  href: "/technicians"                  },
  { label: "How It Works", href: "/how-it-works"                  },
  { label: "About Us",     href: "/about"                        },
  { label: "Contact",      href: "/contact"                      },
];

export function Navbar() {
  const pathname = usePathname();
  const navLinks = navLinksData.map(link => ({
    ...link,
    active: pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/" && link.href !== "/#how-it-works")
  }));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout, setUser } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* ── Sticky wrapper: always full-width ── */
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        // When scrolled, add vertical padding so pill "floats" with space above
        paddingTop: scrolled ? 10 : 0,
        paddingBottom: scrolled ? 10 : 0,
        // Horizontal padding matches .container's 48px gutter at lg
        paddingLeft: scrolled ? 20 : 0,
        paddingRight: scrolled ? 20 : 0,
        background: scrolled ? "transparent" : "#fff",
        borderBottom: scrolled ? "none" : "1px solid #F1F5F9",
        transition: "padding 350ms cubic-bezier(.4,0,.2,1), background 350ms cubic-bezier(.4,0,.2,1), border-color 350ms cubic-bezier(.4,0,.2,1)",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        /* Hide nav links on tablets (1024px and below) */
        @media (max-width: 1024px) {
          .nav-links-container { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
          .navbar-inner { padding: 12px 32px !important; height: auto !important; }
        }
        /* Hide right controls only on mobile (640px and below) */
        @media (max-width: 640px) {
          .right-controls-container { display: none !important; }
          .navbar-inner { padding: 12px 20px !important; }
        }
        /* Hide logo text on very small screens (like 320px devices) to make room for icons */
        @media (max-width: 360px) {
          .logo-text { display: none !important; }
        }
      `}</style>
      {/*
        Inner container:
        - FLAT state : max-width 1280px + matching container padding → aligns with page content
        - SCROLLED   : narrows to 1200px, gets pill shape + shadow
      */}
      <nav
        className="navbar-inner"
        style={{
          maxWidth: scrolled ? 1380 : 1440,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(255, 255, 255, 0.85)" : "#fff",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          // Flat: no rounding, no shadow — blends with page
          borderRadius: scrolled ? 999 : 0,
          boxShadow: scrolled
            ? "0 4px 30px rgba(15,23,42,.12), 0 1px 6px rgba(15,23,42,.06)"
            : "none",
          border: scrolled ? "1px solid #F1F5F9" : "none",
          // Flat: tall open bar matching .container horizontal padding; Scrolled: compact pill padding
          height: scrolled ? "auto" : 76,
          padding: scrolled ? "10px 16px 10px 20px" : "0 64px",
          transition:
            "border-radius 350ms cubic-bezier(.4,0,.2,1), " +
            "box-shadow 350ms cubic-bezier(.4,0,.2,1), " +
            "padding 350ms cubic-bezier(.4,0,.2,1), " +
            "max-width 350ms cubic-bezier(.4,0,.2,1), " +
            "height 350ms cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            marginRight: 32,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
              border: "1.5px solid #BFDBFE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              style={{ width: 20, height: 20, color: "#2563EB" }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
            <div
              style={{
                position: "absolute",
                bottom: -3,
                right: -3,
                width: 16,
                height: 16,
                background: "#2563EB",
                borderRadius: "50%",
                border: "2.5px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Wrench style={{ width: 8, height: 8, color: "#fff" }} />
            </div>
          </div>
          <div className="logo-text">
            <p style={{ lineHeight: 1.1, margin: 0 }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 19, fontWeight: 700, color: "#0F172A" }}>FixIt</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 19, fontWeight: 800, color: "#2563EB" }}>Now</span>
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#94A3B8", lineHeight: 1, margin: "3px 0 0" }}>
              Home Services, Done Right
            </p>
          </div>
        </Link>

        {/* ── Nav Links ── */}
        <div className="nav-links-container" style={{ display: "flex", alignItems: "center", flex: 1, gap: 2 }}>
          {navLinks.map((link) => (
            <div key={link.label} className="relative group">
              <Link
                href={link.href}
                className={`flex items-center gap-1.5 ${link.active ? "text-white" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/50"}`}
                style={{
                  padding: link.active ? "9px 20px" : "9px 16px",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  fontWeight: link.active ? 600 : 500,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  borderRadius: 999,
                  background: link.active
                    ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
                    : "transparent",
                  boxShadow: link.active ? "0 4px 14px rgba(37,99,235,.28)" : "none",
                  position: "relative",
                  transition: "all 250ms ease",
                }}
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown style={{ width: 14, height: 14, opacity: link.active ? 1 : 0.55 }} className="group-hover:translate-y-[1px] transition-transform" />
                )}
                {/* Blue dot under active item when floating */}
                {link.active && scrolled && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: -9,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 5,
                      height: 5,
                      background: "#2563EB",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </Link>
              {link.hasDropdown && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50"
                  style={{ width: "max-content" }}
                >
                  {/* Caret */}
                  <div style={{
                    position: "absolute", top: 3, left: "50%",
                    transform: "translateX(-50%) rotate(45deg)",
                    width: 10, height: 10, background: "#fff",
                    borderLeft: "1px solid #E2E8F0", borderTop: "1px solid #E2E8F0", zIndex: 1,
                  }} />
                  {/* Panel */}
                  <div style={{
                    position: "relative", zIndex: 2,
                    background: "#fff", border: "1px solid #E2E8F0",
                    borderRadius: 16, boxShadow: "0 8px 24px rgba(15,23,42,0.09)",
                    padding: "6px",
                  }}>
                    <Link
                      href="/all-services"
                      style={{
                        display: "block",
                        padding: "9px 16px",
                        fontSize: 14,
                        fontFamily: "var(--font-body)",
                        fontWeight: 500,
                        color: "#475569",
                        textDecoration: "none",
                        borderRadius: 999,
                        whiteSpace: "nowrap",
                        transition: "all 250ms ease",
                      }}
                      className="hover:bg-blue-50/50 hover:text-blue-600"
                    >
                      All Services
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Right Controls ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 12 }}>
          <button
            aria-label="Search"
            className="hover:bg-slate-50 hover:border-slate-300 hover:scale-105"
            style={{
              width: 40, height: 40,
              borderRadius: "50%",
              border: "1.5px solid #E2E8F0",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 200ms ease",
              flexShrink: 0,
            }}
          >
            <Search style={{ width: 16, height: 16, color: "#64748B" }} />
          </button>

          {!isMounted ? (
            <div style={{ width: 180, height: 40, background: "#F1F5F9", borderRadius: 999 }} className="animate-pulse" />
          ) : isAuthenticated ? (
            <div className="relative right-controls-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="hover:scale-[1.02] hover:shadow-xl group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 18px",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  color: "#475569",
                  textDecoration: "none",
                  borderRadius: 999,
                  border: "1.5px solid #E2E8F0",
                  background: "#fff",
                  whiteSpace: "nowrap",
                  transition: "all 250ms ease",
                }}
              >
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                  {user?.name.charAt(0) || "U"}
                </div>
                <span>{user?.name || "Account"}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 mb-2">
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <div className="mt-1 inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {user?.role}
                    </div>
                  </div>
                  
                  {user?.role === "CUSTOMER" && (
                    <>
                      <Link href="/dashboard/customer" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link href="/dashboard/customer" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <Briefcase size={16} /> My Bookings
                      </Link>
                    </>
                  )}

                  {user?.role === "TECHNICIAN" && (
                    <>
                      <Link href="/dashboard/technician" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <LayoutDashboard size={16} /> Provider Dashboard
                      </Link>
                      <Link href="/dashboard/technician/bookings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <Wrench size={16} /> My Jobs
                      </Link>
                    </>
                  )}

                  {user?.role === "ADMIN" && (
                    <>
                      <Link href="/dashboard/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <Settings size={16} /> Admin Panel
                      </Link>
                    </>
                  )}

                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={() => {
                        import('sweetalert2').then((module) => {
                          const Swal = module.default;
                          setDropdownOpen(false);
                          Swal.fire({
                            title: 'Are you sure?',
                            text: "You will be logged out of your account.",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#0ea5e9',
                            cancelButtonColor: '#ef4444',
                            confirmButtonText: 'Yes, log me out!'
                          }).then((result) => {
                            if (result.isConfirmed) {
                              logout();
                              window.location.href = "/login";
                            }
                          });
                        });
                      }}
                      className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link
                href="/login"
                className="right-controls-container hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  color: "#475569",
                  textDecoration: "none",
                  borderRadius: 999,
                  border: "1.5px solid #E2E8F0",
                  background: "#fff",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 250ms ease",
                }}
              >
                <User style={{ width: 16, height: 16 }} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                Log In
              </Link>

              <Link
                href="/register"
                className="right-controls-container hover:scale-[1.02] hover:shadow-xl group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "11px 24px",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  boxShadow: "0 8px 24px rgba(37,99,235,.28)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 250ms ease",
                }}
              >
                Get Started
                <ArrowRight style={{ width: 14, height: 14 }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav-mobile-toggle"
            style={{ display: "none", padding: 8, background: "none", border: "none", cursor: "pointer", color: "#475569" }}
          >
            {mobileOpen ? <X style={{ width: 28, height: 28 }} /> : <Menu style={{ width: 28, height: 28 }} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div style={{ maxWidth: 1280, margin: "8px auto 0", padding: "0 20px" }}>
          <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px rgba(15,23,42,.12)", border: "1px solid #F1F5F9", padding: "16px 20px 20px" }}>
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.hasDropdown ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F8FAFC" }}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      style={{ padding: "12px 0", flex: 1, fontSize: 14, fontWeight: link.active ? 600 : 500, color: link.active ? "#2563EB" : "#475569", textDecoration: "none" }}
                    >
                      {link.label}
                    </Link>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        const dropdownContent = document.getElementById(`mobile-dropdown-${link.label}`);
                        if (dropdownContent) {
                          dropdownContent.style.display = dropdownContent.style.display === "none" ? "block" : "none";
                        }
                      }}
                      style={{ padding: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: link.active ? "#2563EB" : "#475569" }}
                    >
                      <ChevronDown style={{ width: 14, height: 14 }} />
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", fontSize: 14, fontWeight: link.active ? 600 : 500, color: link.active ? "#2563EB" : "#475569", textDecoration: "none", borderBottom: "1px solid #F8FAFC" }}
                  >
                    {link.label}
                  </Link>
                )}
                
                {/* Mobile Dropdown Sub-menu */}
                {link.hasDropdown && (
                  <div id={`mobile-dropdown-${link.label}`} style={{ display: "none", paddingLeft: "16px", paddingBottom: "4px", background: "#f8fafc", borderBottom: "1px solid #F8FAFC" }}>
                    <Link
                      href="/all-services"
                      onClick={() => setMobileOpen(false)}
                      style={{ display: "block", padding: "12px 0", fontSize: 13, fontWeight: 500, color: "#475569", textDecoration: "none" }}
                    >
                      All Services
                    </Link>
                  </div>
                )}
              </div>
            ))}
            {isAuthenticated ? (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-3 px-2 py-1 mb-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {user?.name.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                
                {user?.role === "CUSTOMER" && (
                  <>
                    <Link href="/dashboard/customer" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-700 hover:text-blue-600">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link href="/dashboard/customer?filter=ongoing" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-700 hover:text-blue-600">
                      <Briefcase size={16} /> My Bookings
                    </Link>
                    <Link href="/dashboard/customer?filter=completed" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-700 hover:text-blue-600">
                      <Star size={16} /> Completed Work
                    </Link>
                  </>
                )}

                {user?.role === "TECHNICIAN" && (
                  <>
                    <Link href="/dashboard/technician" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-700 hover:text-blue-600">
                      <LayoutDashboard size={16} /> Provider Dashboard
                    </Link>
                    <Link href="/dashboard/technician/jobs" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-700 hover:text-blue-600">
                      <Wrench size={16} /> My Jobs
                    </Link>
                  </>
                )}

                {user?.role === "ADMIN" && (
                  <>
                    <Link href="/dashboard/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-700 hover:text-blue-600">
                      <LayoutDashboard size={16} /> Admin Panel
                    </Link>
                    <Link href="/dashboard/admin/manage" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-700 hover:text-blue-600">
                      <Settings size={16} /> Manage Platform
                    </Link>
                  </>
                )}

                <button 
                  onClick={() => { 
                    import('sweetalert2').then((module) => {
                      const Swal = module.default;
                      setMobileOpen(false);
                      Swal.fire({
                        title: 'Are you sure?',
                        text: "You will be logged out of your account.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#0ea5e9',
                        cancelButtonColor: '#ef4444',
                        confirmButtonText: 'Yes, log me out!'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          logout();
                          window.location.href = "/login";
                        }
                      });
                    });
                  }}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 text-sm font-bold text-red-600 bg-red-50 rounded-full"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <Link href="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: "center", padding: "11px 0", fontSize: 13, fontWeight: 600, color: "#475569", border: "1.5px solid #E2E8F0", borderRadius: 999, textDecoration: "none" }}>Log In</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: "center", padding: "11px 0", fontSize: 13, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", borderRadius: 999, textDecoration: "none" }}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
