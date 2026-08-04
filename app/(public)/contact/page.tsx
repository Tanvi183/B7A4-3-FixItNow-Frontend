"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    background: "var(--color-bg-section)",
    border: "1px solid var(--color-border)",
    borderRadius: 16,
    color: "var(--color-heading)",
    fontSize: 16,
    outline: "none",
    fontFamily: "var(--font-body)",
    transition: "all 0.2s ease",
  };

  return (
    <div style={{ overflowX: "hidden", minHeight: "100vh", background: "var(--color-bg-section)" }}>
      
      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", paddingTop: 100, paddingBottom: 80, background: "var(--color-bg-card)", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <div className="section-label" style={{ color: "#2563EB", letterSpacing: "0.05em", fontWeight: 800, justifyContent: "center", marginBottom: 16 }}>
            GET IN TOUCH
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 48, fontWeight: 800, color: "var(--color-heading)", marginBottom: 20, letterSpacing: "-0.02em" }}>
            We're here to help
          </h1>
          <p style={{ color: "var(--color-light)", fontSize: 18, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
            Have a question, need assistance, or want to partner with us? Reach out and our team will get back to you shortly.
          </p>
        </div>
      </section>

      {/* ══ CONTACT DETAILS ════════════════════════════════════════════════════ */}
      <section style={{ padding: "64px 0", position: "relative", zIndex: 10, marginTop: -40 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            
            {/* Email Card */}
            <div style={{ background: "var(--color-bg-card)", padding: 40, borderRadius: 24, boxShadow: "0 10px 40px rgba(15,23,42,0.04)", textAlign: "center", border: "1px solid #F8FAFC" }}>
              <div style={{ width: 64, height: 64, background: "rgba(37, 99, 235, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Mail style={{ width: 28, height: 28, color: "#2563EB" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 800, color: "var(--color-heading)", marginBottom: 12 }}>Email Us</h3>
              <p style={{ color: "var(--color-light)", fontSize: 15, marginBottom: 8 }}>Support: support@fixitnow.com</p>
              <p style={{ color: "var(--color-light)", fontSize: 15 }}>Sales: sales@fixitnow.com</p>
            </div>

            {/* Phone Card */}
            <div style={{ background: "var(--color-bg-card)", padding: 40, borderRadius: 24, boxShadow: "0 10px 40px rgba(15,23,42,0.04)", textAlign: "center", border: "1px solid #F8FAFC" }}>
              <div style={{ width: 64, height: 64, background: "rgba(37, 99, 235, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Phone style={{ width: 28, height: 28, color: "#2563EB" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 800, color: "var(--color-heading)", marginBottom: 12 }}>Call Us</h3>
              <p style={{ color: "var(--color-light)", fontSize: 15, marginBottom: 8 }}>Toll-Free: 1-800-FIXIT-NOW</p>
              <p style={{ color: "var(--color-light)", fontSize: 15 }}>Local: (555) 123-4567</p>
            </div>

            {/* Office Card */}
            <div style={{ background: "var(--color-bg-card)", padding: 40, borderRadius: 24, boxShadow: "0 10px 40px rgba(15,23,42,0.04)", textAlign: "center", border: "1px solid #F8FAFC" }}>
              <div style={{ width: 64, height: 64, background: "rgba(37, 99, 235, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <MapPin style={{ width: 28, height: 28, color: "#2563EB" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 800, color: "var(--color-heading)", marginBottom: 12 }}>Visit Us</h3>
              <p style={{ color: "var(--color-light)", fontSize: 15, marginBottom: 8 }}>123 Home Service Blvd,</p>
              <p style={{ color: "var(--color-light)", fontSize: 15 }}>Suite 400, New York, NY 10012</p>
            </div>

          </div>
        </div>
      </section>

      {/* ══ CONTACT FORM ═══════════════════════════════════════════════════════ */}
      <section style={{ paddingBottom: 100 }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="contact-form-card" style={{ background: "var(--color-bg-card)", borderRadius: 32, boxShadow: "0 20px 60px rgba(15,23,42,0.06)", border: "1px solid #F1F5F9" }}>
            
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 32, fontWeight: 800, color: "var(--color-heading)", marginBottom: 12, letterSpacing: "-0.01em" }}>
                Send us a Message
              </h2>
              <p style={{ color: "var(--color-light)", fontSize: 16 }}>
                Fill out the form below and we'll reply as soon as possible.
              </p>
            </div>

            {submitted && (
              <div style={{ background: "#ECFDF5", color: "#065F46", padding: "16px 20px", borderRadius: 16, marginBottom: 32, display: "flex", alignItems: "center", gap: 12, fontWeight: 600 }}>
                <div style={{ width: 24, height: 24, background: "#10B981", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✓</div>
                Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              <div className="contact-form-row">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 14, fontWeight: 700, color: "var(--color-heading)" }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={inputStyle} 
                    onFocus={(e) => { e.target.style.borderColor = "#3B82F6"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 14, fontWeight: 700, color: "var(--color-heading)" }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={inputStyle} 
                    onFocus={(e) => { e.target.style.borderColor = "#3B82F6"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "var(--color-heading)" }}>Subject</label>
                <input 
                  type="text" 
                  placeholder="How can we help you?" 
                  required 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  style={inputStyle} 
                  onFocus={(e) => { e.target.style.borderColor = "#3B82F6"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "var(--color-heading)" }}>Message</label>
                <textarea 
                  placeholder="Write your message here..." 
                  required 
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{...inputStyle, resize: "none"}} 
                  onFocus={(e) => { e.target.style.borderColor = "#3B82F6"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F8FAFC"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{
                  marginTop: 8,
                  width: "100%",
                  padding: "18px",
                  background: isSubmitting ? "#93C5FD" : "#3B82F6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 16,
                  fontFamily: "var(--font-heading)",
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.25)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { if(!isSubmitting) e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { if(!isSubmitting) e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {isSubmitting ? "Sending..." : (
                  <>
                    Send Message
                    <Send style={{ width: 18, height: 18 }} />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
