import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  Search,
  CalendarCheck,
  CircleCheckBig,
  Clock,
  Star,
} from "lucide-react";

export const metadata = {
  title: "How It Works | FixItNow",
  description:
    "Learn how FixItNow connects you with trusted professionals in just a few clicks. Choose a service, book & schedule, and get the job done.",
};

const heroBadges = [
  { icon: ShieldCheck, label: "Verified", sub: "Professionals" },
  { icon: Lock, label: "Secure", sub: "Payments" },
  { icon: CheckCircle2, label: "Satisfaction", sub: "Guaranteed" },
];

const steps = [
  {
    n: "01",
    img: "/step1_girl.png",
    icon: Search,
    title: "Choose a Service",
    desc: "Browse services and find the perfect match for your needs.",
  },
  {
    n: "02",
    img: "/step2_calendar.png",
    icon: CalendarCheck,
    title: "Book & Schedule",
    desc: "Pick a date and time that works for you and book instantly.",
  },
  {
    n: "03",
    img: "/step3_technician.png",
    icon: CircleCheckBig,
    title: "Get It Done",
    desc: "Sit back and relax while our pro handles the job.",
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

export default function HowItWorksPage() {
  return (
    <div style={{ overflowX: "hidden", background: "var(--color-bg-card)" }}>

      {/* ── HERO ── */}
      <section className="hiw-hero-section">
        <div className="container">
          <div className="hiw-hero-grid">

            {/* Left */}
            <div className="hiw-hero-left">
              <p className="hiw-hero-label">HOW IT WORKS</p>
              <h1 className="hiw-hero-heading">
                Getting the job done{" "}
                <br />
                is now <span className="hiw-hero-accent">easier than ever</span>
              </h1>
              <p className="hiw-hero-desc">
                FixItNow connects you with trusted professionals in just a few clicks.
                Here&apos;s how it works.
              </p>

              <div className="hiw-hero-badges">
                {heroBadges.map((b) => (
                  <div key={b.label} className="hiw-hero-badge">
                    <b.icon style={{ width: 20, height: 20, color: "#2563EB", strokeWidth: 2 }} />
                    <div>
                      <p className="hiw-badge-label">{b.label}</p>
                      <p className="hiw-badge-sub">{b.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="hiw-hero-right">
              {/* Decorative dots */}
              <div className="hiw-dots">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  {Array.from({ length: 6 }).map((_, row) =>
                    Array.from({ length: 6 }).map((_, col) => (
                      <circle key={`${row}-${col}`} cx={10 + col * 22} cy={10 + row * 22} r="3" fill="#BFDBFE" />
                    ))
                  )}
                </svg>
              </div>

              {/* Blue blob */}
              <div className="hiw-blob" />

              {/* Image */}
              <div className="hiw-hero-img-frame">
                <Image
                  src="/person.png"
                  alt="Professional technician"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "contain", objectPosition: "bottom" }}
                  priority
                />
              </div>

              {/* Floating trust badge */}
              <div className="hiw-floating-badge">
                <div className="hiw-floating-badge-icon">
                  <CheckCircle2 style={{ width: 20, height: 20, color: "#fff" }} />
                </div>
                <div>
                  <p className="hiw-floating-badge-title">Trusted. Professional.</p>
                  <p className="hiw-floating-badge-sub">Always Reliable.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── OUR PROCESS ── */}
      <section className="hiw-process-section">
        <div className="container">
          <div className="hiw-section-header">
            <p className="hiw-section-label">OUR PROCESS</p>
            <h2 className="hiw-section-title">Get your job done in 3 simple steps</h2>
            <p className="hiw-section-desc">
              We make it easy to connect with trusted professionals and get things done.
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

      {/* ── TRUST FEATURES ── */}
      <section className="hiw-trust-section">
        <div className="container">
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
      <section className="hiw-cta-section">
        <div className="container">
          <div className="hiw-cta-banner">
            <div className="hiw-cta-img-wrap">
              <Image
                src="/step1_girl.png"
                alt="Get started with FixItNow"
                fill
                sizes="200px"
                style={{ objectFit: "contain", objectPosition: "bottom" }}
              />
            </div>
            <div className="hiw-cta-content">
              <h2 className="hiw-cta-title">Ready to get started?</h2>
              <p className="hiw-cta-desc">
                Find trusted professionals and get the job done with ease.
              </p>
            </div>
            <Link href="/services" className="hiw-cta-button">
              Book a Service &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
