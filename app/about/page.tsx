import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Users,
  HardHat,
  CalendarCheck,
  Star,
  ShieldCheck,
  Award,
  Clock,
  User,
  Heart,
  Target,
  Eye,
  Headset,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "About Us | FixItNow",
  description:
    "FixItNow connects you with trusted, verified professionals for all your home service needs. Learn our story, mission, and the values that drive us.",
};

const heroChecks = [
  "Trusted & Verified Professionals",
  "Easy Booking & Secure Payments",
  "100% Satisfaction Guarantee",
];

const stats = [
  { icon: Users,         value: "25K+",  label: "Happy Customers" },
  { icon: HardHat,       value: "5K+",   label: "Verified Technicians" },
  { icon: CalendarCheck, value: "50K+",  label: "Bookings Completed" },
  { icon: Star,          value: "4.9/5", label: "Average Rating" },
];

const mission = [
  { icon: Target, color: "#2563EB", bg: "#EFF6FF", title: "Our Mission", desc: "To simplify home services by providing a seamless platform that connects customers with trusted professionals, ensuring quality work and complete peace of mind." },
  { icon: Eye, color: "#059669", bg: "#ECFDF5", title: "Our Vision", desc: "To become the most trusted home service platform, known for reliability, innovation, and delivering outstanding customer experiences." }
];

const values = [
  { icon: ShieldCheck, color: "#2563EB", bg: "#EFF6FF", title: "Trust & Safety", desc: "We verify every professional to ensure your safety and peace of mind." },
  { icon: Award,       color: "#059669", bg: "#ECFDF5", title: "Quality First",  desc: "We are committed to delivering top-quality services, every time." },
  { icon: Clock,       color: "#7C3AED", bg: "#F5F3FF", title: "On-Time Service",desc: "We respect your time and ensure prompt and reliable service." },
  { icon: User,        color: "#EA580C", bg: "#FFF7ED", title: "Customer Focus", desc: "Your satisfaction is our priority. We're here to make things right." },
  { icon: Heart,       color: "#E11D48", bg: "#FFF1F2", title: "Integrity",      desc: "We believe in honest communication and transparent pricing." },
];

const team = [
  { name: "James Carter",   role: "CEO & Founder",        img: "/review_avatar_1.png" },
  { name: "Sophia Bennett", role: "Head of Operations",   img: "/review_avatar_2.png" },
  { name: "Michael Brown",  role: "CTO",                  img: "/review_avatar_3.png" },
  { name: "Emily Davis",    role: "Customer Success Lead",img: "/review_avatar_1.png" },
  { name: "Daniel Wilson",  role: "Head of Marketing",    img: "/review_avatar_2.png" },
];

export default function AboutPage() {
  return (
    <div style={{ overflowX: "hidden", background: "#fff" }}>

      {/* HERO */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero-grid">

            {/* Left */}
            <div className="about-hero-left">
              <p className="about-hero-label">ABOUT US</p>
              <h1 className="about-hero-heading">
                {"We're here to"}
                <br />{"make your life easier."}
              </h1>
              <p className="about-hero-body">
                FixItNow connects you with trusted, verified professionals
                for all your home service needs. Our mission is simple&nbsp;&mdash;
                deliver quality service, every time.
              </p>
              <ul className="about-hero-checks">
                {heroChecks.map((item) => (
                  <li key={item} className="about-hero-check-item">
                    <CheckCircle2 className="about-hero-check-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right */}
            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
              {/* Decorative Dots */}
              <div className="absolute -left-4 -top-4 z-0 hidden sm:block">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {Array.from({ length: 6 }).map((_, row) =>
                    Array.from({ length: 6 }).map((_, col) => (
                      <circle
                        key={`${row}-${col}`}
                        cx={10 + col * 20}
                        cy={10 + row * 20}
                        r="3"
                        className="fill-blue-200"
                      />
                    ))
                  )}
                </svg>
              </div>

              {/* Blue Blob Behind Image */}
              <div className="absolute -right-6 -top-6 z-0 h-full w-full rounded-[3rem] bg-blue-600" />

              {/* Main Image */}
              <div className="relative z-10 overflow-hidden rounded-bl-[4rem] rounded-br-[3rem] rounded-tl-[3rem] rounded-tr-[4rem]">
                <Image
                  src="/about_hero.png"
                  alt="Professional handyman at work"
                  width={600}
                  height={700}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="about-stats-bar">
            {stats.map((s, i) => (
              <div key={s.label} className="about-stat-item">
                {i > 0 && <div className="about-stat-divider" />}
                <div className="about-stat-icon-wrap">
                  <s.icon style={{ width: 30, height: 30, color: "#2563EB", strokeWidth: 2 }} />
                </div>
                <div>
                  <p className="about-stat-value">{s.value}</p>
                  <p className="about-stat-label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="about-section" style={{ background: "#F8FAFC", padding: "80px 0" }}>
        <div className="container">
          <div className="about-section-header">
            <p className="about-section-label">OUR MISSION</p>
            <h2 className="about-section-title">Building trust. Delivering quality.</h2>
            <p className="about-section-desc">
              We believe everyone deserves a safe, comfortable, and well-maintained home.
              That's why we're committed to connecting you with the best professionals in your area.
            </p>
          </div>
          <div className="about-mission-grid">
            {mission.map((m) => (
              <div key={m.title} className="about-mission-card">
                <div className="about-mission-icon-wrap" style={{ background: m.bg }}>
                  <m.icon style={{ width: 32, height: 32, color: m.color, strokeWidth: 2 }} />
                </div>
                <div className="about-mission-content">
                  <h3 className="about-mission-title">{m.title}</h3>
                  <p className="about-mission-text">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-section" style={{ background: "#F8FAFC", padding: "40px 0 80px" }}>
        <div className="container">
          <div className="about-section-header">
            <p className="about-section-label">OUR VALUES</p>
            <h2 className="about-section-title">The values that drive everything we do</h2>
          </div>
          <div className="about-values-container">
            {values.map((v, i) => (
              <div key={v.title} className="about-value-item">
                {i > 0 && <div className="about-value-divider" />}
                <div className="about-value-icon-wrap" style={{ background: v.bg }}>
                  <v.icon style={{ width: 24, height: 24, color: v.color }} />
                </div>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-text">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="about-section" style={{ background: "#F8FAFC", padding: "40px 0 80px" }}>
        <div className="container">
          <div className="about-section-header">
            <p className="about-section-label">OUR TEAM</p>
            <h2 className="about-section-title">Meet the people behind FixItNow</h2>
          </div>
          <div className="about-team-grid">
            {team.map((member) => (
              <div key={member.name} className="about-team-card">
                <div className="about-team-avatar-wrap">
                  <Image src={member.img} alt={member.name} fill sizes="120px" className="about-team-avatar" />
                </div>
                <h3 className="about-team-name">{member.name}</h3>
                <p className="about-team-role">{member.role}</p>
                <div className="about-team-socials">
                  <div className="about-social-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </div>
                  <div className="about-social-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </div>
                  <div className="about-social-icon"><Mail size={14} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-section" style={{ background: "#F8FAFC", padding: "40px 0 100px" }}>
        <div className="container">
          <div className="about-cta-banner">
            <div className="about-cta-left">
              <div className="about-cta-icon-wrap">
                <Headset size={36} color="#FFFFFF" strokeWidth={1.5} />
              </div>
              <div className="about-cta-text">
                <h2>Ready to get started?</h2>
                <p>Book trusted professionals and get the job done with ease.</p>
              </div>
            </div>
            <Link href="/services" className="about-cta-button">
              Book a Service &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}