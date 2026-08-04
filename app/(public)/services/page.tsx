import ServicesHero from "@/components/ServicesHero";
import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  Droplet,
  Monitor,
  SprayCan,
  PaintRoller,
  Hammer,
  Coffee,
  MoreHorizontal,
  Star,
  Search,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Lock,
} from "lucide-react";

export const metadata = {
  title: "Services | FixItNow",
  description: "Find trusted professionals for every home need.",
};

const categories = [
  { icon: Zap, label: "Electrical" },
  { icon: Droplet, label: "Plumbing" },
  { icon: Monitor, label: "AC Repair" },
  { icon: SprayCan, label: "Cleaning" },
  { icon: PaintRoller, label: "Painting" },
  { icon: Hammer, label: "Carpentry" },
  { icon: Coffee, label: "Appliance Repair" },
  { icon: MoreHorizontal, label: "More Services" },
];

const popularServices = [
  { img: "/light_install.png", title: "Light Installation", rating: "4.8", count: 320, price: 40 },
  { img: "/pipe_repair.png", title: "Pipe Leak Repair", rating: "4.7", count: 280, price: 45 },
  { img: "/ac_install.png", title: "AC Installation", rating: "4.9", count: 210, price: 60 },
  { img: "/cleaning.png", title: "Home Cleaning", rating: "4.8", count: 450, price: 35 },
  { img: "/painting.png", title: "Wall Painting", rating: "4.7", count: 310, price: 80 },
];

const steps = [
  {
    n: "01",
    title: "Choose a Service",
    desc: "Browse services and find the perfect match for your needs.",
    img: "/step1_girl.png",
    icon: Search,
  },
  {
    n: "02",
    title: "Book & Schedule",
    desc: "Pick a date and time that works for you and book instantly.",
    img: "/step2_calendar.png",
    icon: Calendar,
  },
  {
    n: "03",
    title: "Get It Done",
    desc: "Sit back and relax while our pro handles the job.",
    img: "/step3_technician.png",
    icon: CheckCircle2,
  },
];

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    desc: "All professionals are background checked and verified.",
  },
  {
    icon: Clock,
    title: "On-Time Service",
    desc: "We respect your time and ensure prompt service every time.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    desc: "100% secure payments with multiple safe options.",
  },
  {
    icon: Star,
    title: "Satisfaction Guarantee",
    desc: "We're not happy until you're completely satisfied.",
  },
];

export default function ServicesPage() {
  return (
    <div style={{ overflowX: "hidden", background: "var(--color-bg-section)" }}>
      <ServicesHero />

      {/* ── BROWSE BY CATEGORY ── */}
      <section className="services-category-section">
        <div className="container">
          <div className="services-section-header">
            <p className="services-section-label">BROWSE BY CATEGORY</p>
            <h2 className="services-section-title">What service do you need?</h2>
          </div>
          
          <div className="services-category-grid">
            {categories.map((cat, i) => (
              <Link href="/all-services" key={i} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="services-category-card">
                  <div className="services-category-icon-wrap">
                    <cat.icon style={{ width: 24, height: 24, color: "#2563EB" }} />
                  </div>
                  <p className="services-category-name">{cat.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR SERVICES ── */}
      <section className="services-popular-section">
        <div className="container">
          <div className="services-section-header-row">
            <div>
              <p className="services-section-label">POPULAR SERVICES</p>
              <h2 className="services-section-title">Most in-demand services</h2>
            </div>
            <Link href="/all-services" className="services-view-all">
              View All Services &rarr;
            </Link>
          </div>

          <div className="services-popular-grid">
            {popularServices.map((service, i) => (
              <div key={i} className="services-popular-card">
                <div className="services-popular-img-wrap">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 250px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="services-popular-content">
                  <h3 className="services-popular-title">{service.title}</h3>
                  <div className="services-popular-rating">
                    <Star style={{ width: 14, height: 14, color: "#F59E0B", fill: "#F59E0B" }} />
                    <span className="services-popular-score">{service.rating}</span>
                    <span className="services-popular-count">({service.count})</span>
                  </div>
                  <p className="services-popular-price">From ${service.price}</p>
                  <a href="/all-services" className="services-popular-btn" style={{ textDecoration: 'none', textAlign: 'center', display: 'block' }}>Book Now</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="hiw-process-section" style={{ background: "var(--color-bg-section)" }}>
        <div className="container">
          <div className="hiw-section-header">
            <p className="hiw-section-label" style={{ color: "#2563EB" }}>HOW IT WORKS</p>
            <h2 className="hiw-section-title" style={{ fontSize: "36px", margin: "16px 0", color: "var(--color-heading)", fontWeight: 800 }}>Get your job done in 3 simple steps</h2>
            <p className="hiw-section-desc">
              Quick, easy, and hassle-free.
            </p>
          </div>

          <div className="hiw-steps-row">
            {steps.map((step, i) => (
              <div key={step.n} className="hiw-step-wrapper">
                <div className="hiw-step-card">
                  <div className="hiw-step-number">{step.n}</div>
                  <div className="hiw-step-img-wrap">
                    <Image
                      src={step.img}
                      alt={step.title}
                      fill
                      sizes="220px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="hiw-step-icon-wrap">
                    <step.icon style={{ width: 20, height: 20, color: "#2563EB" }} />
                  </div>
                  <h3 className="hiw-step-title">{step.title}</h3>
                  <p className="hiw-step-desc">{step.desc}</p>
                </div>

                {/* Dashed arrow between cards */}
                {i < steps.length - 1 && (
                  <div className="hiw-step-arrow">
                    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                      <line x1="0" y1="10" x2="45" y2="10" stroke="var(--color-light)" strokeWidth="2" strokeDasharray="6 4" />
                      <polyline points="42,4 50,10 42,16" fill="none" stroke="var(--color-light)" strokeWidth="2" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE FIXITNOW? ── */}
      <section className="hiw-trust-section" style={{ background: "var(--color-bg-section)", paddingBottom: "100px" }}>
        <div className="container">
          <div className="hiw-section-header" style={{ marginBottom: "40px" }}>
            <p className="hiw-section-label" style={{ color: "#2563EB" }}>WHY CHOOSE FIXITNOW?</p>
          </div>
          <div className="hiw-trust-bar">
            {trustFeatures.map((f, i) => (
              <div key={f.title} className="hiw-trust-item">
                {i > 0 && <div className="hiw-trust-divider" />}
                <div className="hiw-trust-icon-wrap">
                  <f.icon style={{ width: 24, height: 24, color: "#2563EB" }} />
                </div>
                <h3 className="hiw-trust-title">{f.title}</h3>
                <p className="hiw-trust-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="services-cta-section">
        <div className="container">
          <div className="services-cta-banner">
            <div className="services-cta-img-wrap">
              <Image
                src="/mobile_app.png"
                alt="FixItNow Mobile App"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                style={{ objectFit: "contain", objectPosition: "bottom" }}
              />
            </div>
            <div className="services-cta-content">
              <h2 className="services-cta-title">Need help right away?</h2>
              <p className="services-cta-desc">
                Our support team is here 24/7 to help you book the right service.
              </p>
              <Link href="/contact" className="services-cta-button">
                Contact Support &rarr;
              </Link>
            </div>
            
            <div className="services-cta-features">
              {['24/7 Customer Support', 'Quick Response', 'Trusted & Reliable'].map((f, i) => (
                <div key={i} className="services-cta-feature">
                  <div className="services-cta-feature-icon">
                    <CheckCircle2 style={{ width: 16, height: 16, color: "#2563EB" }} />
                  </div>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
