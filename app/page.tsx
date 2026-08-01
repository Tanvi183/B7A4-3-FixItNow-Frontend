import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  ShieldCheck,
  CalendarCheck,
  Lock,
  ThumbsUp,
  ArrowRight,
  Star,
  CheckCircle2,
  Users,
  Quote,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Smile,
  Smartphone,
} from "lucide-react";
import { FaBolt, FaFaucet, FaPaintRoller, FaSnowflake } from "react-icons/fa";
import { GiVacuumCleaner, GiWoodBeam } from "react-icons/gi";
import { HeroSearch } from "@/components/HeroSearch";

// ─── DATA ────────────────────────────────────────────────────────────────────

const popularSearches = ["Electrical", "Cleaning", "Plumbing", "AC Repair", "Painting", "Carpentry"];

const services = [
  { icon: FaBolt,          iconBg: "#EFF6FF", iconColor: "#2563EB", title: "Electrical",  desc: "Wiring, lighting, repairs & more",           price: "$40" },
  { icon: FaFaucet,        iconBg: "#EFF6FF", iconColor: "#2563EB", title: "Plumbing",    desc: "Leak repairs, pipe fitting & installation",  price: "$35" },
  { icon: GiVacuumCleaner, iconBg: "#F0FDF4", iconColor: "#16A34A", title: "Cleaning",    desc: "Home, office & deep cleaning",                price: "$25" },
  { icon: FaPaintRoller,   iconBg: "#FAF5FF", iconColor: "#9333EA", title: "Painting",    desc: "Interior, exterior & wall painting",          price: "$45" },
  { icon: FaSnowflake,     iconBg: "#EFF6FF", iconColor: "#2563EB", title: "AC Repair",   desc: "Installation, servicing & gas refilling",    price: "$50" },
  { icon: GiWoodBeam,      iconBg: "#FFF7ED", iconColor: "#B45309", title: "Carpentry",   desc: "Custom furniture, repairs & more",            price: "$30" },
];

const trustBadges = [
  { icon: ShieldCheck, title: "Background Verified", desc: "All professionals are background checked" },
  { icon: Star,        title: "Highly Rated",        desc: "Top-rated by real customers like you" },
  { icon: Award,       title: "Experienced",         desc: "Years of experience in delivering quality service" },
  { icon: Clock,       title: "On-Time Service",     desc: "Punctual and reliable every time" },
];

const steps = [
  { n: "01", title: "Choose a Service",  desc: "Browse services and find the perfect match for your needs.", image: "/step1_girl.png" },
  { n: "02", title: "Book & Schedule",   desc: "Pick a date and time that works for you and book instantly.", image: "/step2_calendar.png" },
  { n: "03", title: "Get It Done",       desc: "Sit back and relax while our pro handles the job.",           image: "/step3_technician.png" },
];

const stats = [
  { value: "25K+",  label: "Happy Customers",      icon: Users,         color: "#C084FC", bg: "rgba(192, 132, 252, 0.15)", border: "rgba(192, 132, 252, 0.4)" },
  { value: "5K+",   label: "Verified Technicians", icon: HardHat,       color: "#60A5FA", bg: "rgba(96, 165, 250, 0.15)",  border: "rgba(96, 165, 250, 0.4)" },
  { value: "50K+",  label: "Bookings Completed",   icon: CalendarCheck, color: "#34D399", bg: "rgba(52, 211, 153, 0.15)",  border: "rgba(52, 211, 153, 0.4)" },
  { value: "4.9/5", label: "Average Rating",       icon: Smile,         color: "#FBBF24", bg: "rgba(251, 191, 36, 0.15)",  border: "rgba(251, 191, 36, 0.4)" },
];

const technicians = [
  { name: "James Carter",  role: "Electrician",   rating: 4.9, reviews: 320, price: "$40", icon: FaBolt,        iconColor: "#2563EB", image: "/tech_avatar.png" },
  { name: "Michael Brown", role: "Plumber",       rating: 4.8, reviews: 280, price: "$35", icon: FaFaucet,      iconColor: "#2563EB", image: "/tech_avatar_2.png" },
  { name: "David Wilson",  role: "AC Specialist", rating: 4.9, reviews: 210, price: "$50", icon: FaSnowflake,   iconColor: "#2563EB", image: "/tech_avatar_3.png" },
  { name: "Robert Smith",  role: "Painter",       rating: 4.8, reviews: 190, price: "$45", icon: FaPaintRoller, iconColor: "#2563EB", image: "/tech_avatar_4.png" },
  { name: "Daniel Lee",    role: "Carpenter",     rating: 4.9, reviews: 150, price: "$30", icon: GiWoodBeam,    iconColor: "#2563EB", image: "/tech_avatar_5.png" },
];

const reviews = [
  { name: "Sarah Johnson", rating: 5, text: "Amazing experience! The plumber arrived on time and fixed the issue quickly. Highly recommended!", location: "New York, NY", image: "/review_avatar_1.png" },
  { name: "Michael Brown", rating: 5, text: "Booked an electrician through FixItNow and the service was top-notch. Will definitely use again!", location: "Los Angeles, CA", image: "/review_avatar_2.png" },
  { name: "Emily Davis",   rating: 5, text: "Great platform and excellent customer support. Got my AC repaired the same day!", location: "Chicago, IL", image: "/review_avatar_3.png" },
];

// ─── STAR RATING ─────────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{
            width: 13, height: 13,
            fill: i < count ? "var(--color-star)" : "#E2E8F0",
            color: i < count ? "var(--color-star)" : "#E2E8F0",
          }}
        />
      ))}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: 80, paddingBottom: 60, background: "#fff" }}>
        {/* Background Decorative blob (Right Side) */}
        {/* <div style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: "60%",
          height: "90%",
          zIndex: 0,
          pointerEvents: "none",
        }}>
          <svg viewBox="-5 -5 110 110" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
            <path 
              fill="#2563EB" 
              d="M 35 10 C 50 -5, 75 -5, 90 5 C 95 15, 80 30, 75 40 C 70 50, 85 60, 95 75 C 105 95, 75 100, 50 100 C 20 100, 5 95, 2 75 C -2 55, 15 25, 35 10 Z" 
            />
          </svg>
        </div> */}
        
        {/* Dot pattern background */}
        <div style={{
          position: "absolute",
          top: 60,
          left: "45%",
          width: 140,
          height: 140,
          backgroundImage: "radial-gradient(#93C5FD 2px, transparent 2px)",
          backgroundSize: "16px 16px",
          opacity: 0.5,
          zIndex: 0,
        }} />

        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 64px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 60 }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }}>
            {/* ── Left Content ── */}
            <div>
              {/* Trust Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EEF2FF", padding: "6px 16px", borderRadius: 999, marginBottom: 24 }}>
                <ShieldCheck style={{ width: 16, height: 16, color: "#2563EB" }} />
                <span style={{ color: "#2563EB", fontSize: 13, fontWeight: 600 }}>Trusted by 25K+ Happy Customers</span>
              </div>

              {/* Headline */}
              <h1 style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(42px, 4.5vw, 62px)",
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                marginBottom: 24,
              }}>
                Quality home services,
                <br />right when you need it.
                <br />Right <span style={{ color: "#2563EB" }}>FixItNow.</span>
              </h1>
              
              {/* Subtitle */}
              <p style={{ color: "#475569", fontSize: 18, lineHeight: 1.6, maxWidth: 520, marginBottom: 40 }}>
                Find skilled professionals for any home service.<br />
                Fast booking, secure payments, and happy homes.
              </p>

              {/* Search Bar */}
              <HeroSearch />

              {/* Popular Searches */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Popular searches:</span>
                {popularSearches.map((s, i) => {
                  const icons = [FaBolt, GiVacuumCleaner, FaFaucet, FaSnowflake, FaPaintRoller, GiWoodBeam];
                  const Icon = icons[i % icons.length];
                  return (
                    <Link
                      key={s}
                      href={`/services?search=${s.toLowerCase()}`}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        fontSize: 13, fontWeight: 600, color: "#475569",
                        background: "#fff", border: "1px solid #E2E8F0",
                        borderRadius: 999, padding: "8px 16px",
                        textDecoration: "none",
                        boxShadow: "0 2px 8px rgba(15,23,42,.04)",
                        transition: "all 0.2s"
                      }}
                      className="hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
                    >
                      <Icon style={{ width: 14, height: 14, color: "#2563EB" }} />
                      {s}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* ── Right Images ── */}
            <div style={{ position: "relative", height: 600, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {/* House Background */}
              <div style={{
                position: "absolute",
                bottom: -60,
                right: 20,
                width: 600,
                height: 550,
                overflow: "hidden",
                zIndex: 1,
        
              }}>
                <Image src="/house02.webp" alt="Modern House" fill sizes="600px" priority style={{ objectFit: "cover", objectPosition: "center" }} />
              </div>
              
              {/* Person Foreground */}
              <div style={{
                position: "absolute",
                bottom: -60,
                right: -50,
                width: 480,
                height: 640,
                zIndex: 2,
              }}>
                <Image src="/person.png" alt="Professional Technician" fill sizes="480px" style={{ objectFit: "contain", objectPosition: "bottom center" }} />
              </div>

              {/* Review Badge */}
              <div style={{
                position: "absolute",
                bottom: -50, // Moved even further down
                right: 50, // Moved even further to the right
                zIndex: 4,
                background: "#fff",
                borderRadius: 16,
                padding: "14px 20px",
                boxShadow: "0 12px 40px rgba(15,23,42,.15)",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}>
                <div style={{ display: "flex", marginLeft: 12 }}>
                  {[1,2,3].map((i) => (
                    <div key={i} style={{
                      width: 40, height: 40, borderRadius: "50%", background: "#E2E8F0",
                      border: "3px solid #fff", marginLeft: -16, zIndex: 4-i,
                      overflow: "hidden", position: "relative", boxShadow: "0 4px 10px rgba(15,23,42,.1)"
                    }}>
                      {/* Avatar placeholder */}
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Star style={{ width: 22, height: 22, fill: "#F59E0B", color: "#F59E0B" }} />
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>4.9/5</span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#64748B", margin: 0 }}>From 12K+ reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Dark Bar ── */}
          <div style={{
            background: "#0B1120",
            borderRadius: 24,
            padding: "32px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 20px 40px rgba(15,23,42,.2)",
          }}>
            {[
              { icon: ShieldCheck, title: "Verified Professionals", desc: "Background checked" },
              { icon: CalendarCheck, title: "Instant Booking", desc: "Book in just a few taps" },
              { icon: Lock, title: "Secure Payments", desc: "100% secure & protected" },
              { icon: CheckCircle2, title: "Satisfaction Guarantee", desc: "We make it right" },
            ].map((feature, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <feature.icon style={{ width: 24, height: 24, color: "#93C5FD" }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>{feature.title}</h4>
                  <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>{feature.desc}</p>
                </div>
                {/* Vertical Divider for all but last */}
                {i < 3 && <div style={{ width: 1, height: 40, background: "rgba(255,255,255,.1)", marginLeft: 32 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--color-bg)", padding: "96px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label">What We Offer</div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-section)", fontWeight: 800, color: "var(--color-heading)", marginBottom: 12 }}>
              Everything Your Home Needs
            </h2>
            <p style={{ color: "var(--color-body)", fontSize: 17, maxWidth: 480, margin: "0 auto" }}>
              From quick fixes to full installations — we&apos;ve got you covered.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
            {services.map((svc) => (
              <Link
                key={svc.title}
                href={`/services?category=${svc.title.toLowerCase()}`}
                className="card hover-scale"
                style={{ 
                  padding: "36px 24px 24px", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  textAlign: "center", 
                  textDecoration: "none", 
                  cursor: "pointer",
                  background: "#fff",
                  borderRadius: 24,
                  boxShadow: "0 10px 40px rgba(15,23,42,0.04)",
                  border: "none"
                }}
              >
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: svc.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, transition: "transform var(--transition)" }}>
                  <svc.icon style={{ width: 36, height: 36, color: svc.iconColor }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{svc.title}</h3>
                <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.5, marginBottom: 32, padding: "0 4px" }}>{svc.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: "auto" }}>
                  <span style={{ color: "#0F172A", fontSize: 14, fontWeight: 700 }}>From {svc.price}</span>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowRight style={{ width: 14, height: 14, color: "#fff" }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link href="/services" className="btn-outline" style={{ gap: 8, borderRadius: 12, padding: "14px 28px", color: "#2563EB", borderColor: "#BFDBFE" }}>
              Explore All Services <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ background: "#F8FAFC", padding: "120px 0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 60, alignItems: "center" }}>
          
          {/* Left Column */}
          <div>
            <div style={{ color: "#2563EB", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
              How It Works
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 42, fontWeight: 800, color: "#0F172A", marginBottom: 20, lineHeight: 1.2 }}>
              Get your job done<br />in 3 simple steps
            </h2>
            <p style={{ color: "#475569", fontSize: 16, lineHeight: 1.6, marginBottom: 40, maxWidth: 380 }}>
              We make it easy to connect with trusted professionals and get things done.
            </p>
            <Link href="/services" style={{ background: "#2563EB", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-block" }}>
              Learn More
            </Link>
          </div>

          {/* Right Column - Cards */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
            {steps.map((step, i) => (
              <div key={step.n} style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                
                {/* Step Card */}
                <div style={{ 
                  flex: 1, 
                  background: "#fff", 
                  borderRadius: 24, 
                  boxShadow: "0 10px 40px rgba(15,23,42,0.06)", 
                  position: "relative",
                  paddingBottom: 32,
                  textAlign: "center",
                  overflow: "hidden"
                }}>
                  {/* Badge */}
                  <div style={{
                    position: "absolute",
                    top: 24,
                    left: 24,
                    background: "#2563EB",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    width: 32,
                    height: 32,
                    borderRadius: "4px 8px 8px 8px", // sharp top-left like a tag
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10
                  }}>
                    0{i + 1}
                  </div>

                  {/* Illustration Image */}
                  <div style={{
                    width: "100%",
                    height: 180,
                    marginBottom: 24,
                    position: "relative",
                  }}>
                     <Image src={step.image} alt={step.title} fill sizes="250px" style={{ objectFit: "contain", borderTopLeftRadius: 24, borderTopRightRadius: 24 }} />
                  </div>

                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 12, padding: "0 16px" }}>{step.title}</h3>
                  <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.5, padding: "0 24px", margin: 0 }}>{step.desc}</p>
                </div>

                {/* Dashed Arrow (except after last card) */}
                {i < 2 && (
                  <svg width="40" height="20" viewBox="0 0 40 20" fill="none" style={{ flexShrink: 0 }}>
                    <line x1="0" y1="10" x2="32" y2="10" stroke="#0F172A" strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M32 5 L39 10 L32 15" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════════════════════════ */}
      <section className="container" style={{ padding: "48px 0" }}>
        <div style={{
          position: "relative",
          borderRadius: 24,
          overflow: "hidden",
          padding: "64px 0",
        }}>
          {/* Background Image */}
          <Image src="/house02.webp" alt="Background" fill priority style={{ objectFit: "cover" }} sizes="100vw" />
          
          {/* Overlay */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(15, 23, 42, 0.85)", // dark blue overlay
          }} />

          {/* Content */}
          <div style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            alignItems: "center"
          }}>
            {stats.map((stat, i) => (
              <div key={stat.label} style={{
                textAlign: "center",
                borderRight: i < stats.length - 1 ? "1px solid rgba(255, 255, 255, 0.15)" : "none",
              }}>
                <div style={{
                  width: 64, height: 64,
                  borderRadius: "50%",
                  background: stat.bg,
                  border: `1px solid ${stat.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: `0 0 20px ${stat.bg}` // glowing effect
                }}>
                  <stat.icon style={{ width: 28, height: 28, color: stat.color }} />
                </div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1, marginBottom: 8 }}>{stat.value}</p>
                <p style={{ color: "#E2E8F0", fontSize: 14, fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TECHNICIANS ══════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--color-bg)", padding: "96px 0", position: "relative" }}>
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 48 }}>
            <div>
              <div className="section-label" style={{ color: "#2563EB", letterSpacing: "0.05em", fontWeight: 800 }}>TOP RATED TECHNICIANS</div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 36, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                Skilled. Trusted. Rated by you.
              </h2>
              <p style={{ color: "#64748B", fontSize: 15, margin: 0 }}>Browse top rated professionals based on customer reviews and job performance.</p>
            </div>
            <Link href="/technicians" style={{ display: "flex", alignItems: "center", gap: 8, color: "#2563EB", fontSize: 14, fontWeight: 700, textDecoration: "none", marginTop: 24 }}>
              View All Technicians <div style={{ background: "#EFF6FF", borderRadius: "50%", padding: 6, display: "flex" }}><ChevronRight style={{ width: 16, height: 16 }} /></div>
            </Link>
          </div>

          {/* Carousel Arrows */}
          <div style={{ position: "absolute", left: -24, top: "45%", transform: "translateY(-50%)", width: 48, height: 48, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", cursor: "pointer", zIndex: 10 }}>
            <ChevronLeft style={{ width: 20, height: 20, color: "#0F172A" }} />
          </div>
          <div style={{ position: "absolute", right: -24, top: "45%", transform: "translateY(-50%)", width: 48, height: 48, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", cursor: "pointer", zIndex: 10 }}>
            <ChevronRight style={{ width: 20, height: 20, color: "#0F172A" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
            {technicians.map((tech) => (
              <Link
                key={tech.name}
                href="/technicians"
                style={{ background: "#fff", borderRadius: 20, padding: 16, textDecoration: "none", boxShadow: "0 4px 24px rgba(15,23,42,0.04)" }}
              >
                <div style={{ position: "relative", width: "100%", height: 160, background: "#F3F4F6", borderRadius: 16, marginBottom: 16, overflow: "hidden" }}>
                  <Image src={tech.image} alt={tech.name} fill sizes="200px" style={{ objectFit: "cover", objectPosition: "top" }} />
                  <div style={{ position: "absolute", top: 10, right: 10, background: "#fff", padding: "4px 8px", borderRadius: 12, display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <ShieldCheck style={{ width: 12, height: 12, color: "#10B981" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#10B981" }}>Verified</span>
                  </div>
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>{tech.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <tech.icon style={{ width: 14, height: 14, color: tech.iconColor }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: tech.iconColor }}>{tech.role}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
                  <Star style={{ width: 14, height: 14, fill: "#FBBF24", color: "#FBBF24" }} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{tech.rating}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#94A3B8" }}>({tech.reviews} reviews)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>From {tech.price}</span>
                  <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                    View Profile
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Trust Badges */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "32px 40px", marginTop: 48, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, boxShadow: "0 4px 24px rgba(15,23,42,0.03)" }}>
            {trustBadges.map((badge, i) => (
              <div key={badge.title} style={{ display: "flex", alignItems: "flex-start", gap: 16, borderRight: i < 3 ? "1px solid #F1F5F9" : "none", paddingRight: i < 3 ? 24 : 0 }}>
                <div style={{ background: "#EFF6FF", width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <badge.icon style={{ width: 24, height: 24, color: "#2563EB" }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>{badge.title}</h4>
                  <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, margin: 0 }}>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REVIEWS ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#F8FAFC", padding: "96px 0", position: "relative" }}>
        <div className="container" style={{ position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label" style={{ color: "#2563EB", letterSpacing: "0.05em", fontWeight: 800 }}>CUSTOMER REVIEWS</div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 40, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>
              Real people. Real results.
            </h2>
            <p style={{ color: "#64748B", fontSize: 16, maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
              See why thousands of homeowners trust FixItNow for their home service needs.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div style={{ position: "absolute", left: -24, top: "58%", transform: "translateY(-50%)", width: 48, height: 48, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", cursor: "pointer", zIndex: 10 }}>
            <ChevronLeft style={{ width: 20, height: 20, color: "#0F172A" }} />
          </div>
          <div style={{ position: "absolute", right: -24, top: "58%", transform: "translateY(-50%)", width: 48, height: 48, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", cursor: "pointer", zIndex: 10 }}>
            <ChevronRight style={{ width: 20, height: 20, color: "#0F172A" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
            {reviews.map((rev) => (
              <div key={rev.name} style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(15,23,42,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", overflow: "hidden", background: "#F3F4F6", flexShrink: 0 }}>
                    <Image src={rev.image} alt={rev.name} fill sizes="100px" style={{ objectFit: "cover", objectPosition: "top" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>{rev.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Stars count={rev.rating} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <p style={{ color: "#334155", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                  {rev.text}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8" }}>
                  <MapPin style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{rev.location}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#CBD5E1" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#CBD5E1" }} />
          </div>
        </div>
      </section>

    </div>
  );
}
