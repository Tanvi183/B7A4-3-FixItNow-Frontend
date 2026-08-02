import React from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-root">
      {/* Decorative blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      {/* Nav brand */}
      <Link href="/" className="auth-brand">
        <span className="auth-brand-icon">
          <Wrench size={18} strokeWidth={2.5} />
        </span>
        FixItNow
      </Link>

      {/* Card */}
      <div className="auth-card-wrapper">
        <div className="auth-card">
          {children}
        </div>
      </div>
    </div>
  );
}
