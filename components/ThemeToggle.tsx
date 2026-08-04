"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${className}`}
      style={{
        background: isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(15,23,42,0.05)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <span
        className="absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: 0,
          background: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(15,23,42,0.04)",
        }}
      />
      {isDark ? (
        <Sun
          size={17}
          strokeWidth={2}
          style={{ color: "#FCD34D", transition: "transform 0.4s", transform: "rotate(0deg)" }}
        />
      ) : (
        <Moon
          size={17}
          strokeWidth={2}
          style={{ color: "var(--color-body)", transition: "transform 0.4s" }}
        />
      )}
    </button>
  );
}
