"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTheme } from "next-themes";
import {
  FiSearch, FiSun, FiMoon, FiBell, FiMenu, FiUser,
  FiSettings, FiLogOut, FiChevronDown, FiCommand,
} from "react-icons/fi";
import Swal from "sweetalert2";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (arg: boolean) => void;
}

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  ADMIN:      { label: "Admin",      cls: "bg-[#3C50E0]/15 text-[#3C50E0] dark:bg-[#3C50E0]/20 dark:text-[#8fa4f3]" },
  TECHNICIAN: { label: "Technician", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  CUSTOMER:   { label: "Customer",   cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
};

export default function Header({ sidebarOpen, setSidebarOpen, sidebarExpanded, setSidebarExpanded }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Sign out?",
      text: "You will be logged out of your session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3C50E0",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, sign out",
    }).then(result => {
      if (result.isConfirmed) {
        logout();
        setDropdownOpen(false);
        router.push("/");
      }
    });
  };

  const role = user?.role || "CUSTOMER";
  const badge = ROLE_BADGE[role];

  function getInitials(name: string) {
    return (name || "U").split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  }

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Glass backdrop */}
      <div className="relative flex items-center justify-between
        bg-white/80 backdrop-blur-xl
        dark:bg-[#1a1f35]/90
        border-b border-gray-200/60 dark:border-white/[0.06]
        shadow-sm shadow-black/[0.03] dark:shadow-black/20
        px-4 py-3 md:px-6"
      >
        {/* Subtle top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />

        {/* ── Left: Hamburger + Brand + Search ── */}
        <div className="flex items-center gap-3">
          {/* Sidebar toggle */}
          <button
            aria-label="Toggle sidebar"
            onClick={e => {
              e.stopPropagation();
              if (window.innerWidth < 1024) setSidebarOpen(!sidebarOpen);
              else setSidebarExpanded(!sidebarExpanded);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl
              bg-gray-100 hover:bg-gray-200 text-gray-600
              dark:bg-white/8 dark:hover:bg-white/12 dark:text-white/70 dark:hover:text-white
              transition-colors duration-150"
          >
            <FiMenu className="w-4.5 h-4.5" />
          </button>

          {/* Mobile brand */}
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3C50E0] to-[#6577F3] shadow-md shadow-[#3C50E0]/30">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-white">
                <path d="M10 2L3 7v11h5v-4h4v4h5V7L10 2z" fill="currentColor" fillOpacity=".9"/>
              </svg>
            </div>
          </Link>

          {/* Search bar */}
          <div className={`hidden sm:flex items-center gap-2 rounded-xl
            border transition-all duration-200 px-3 py-2
            ${searchFocused
              ? "border-[#3C50E0]/50 bg-white shadow-md shadow-[#3C50E0]/10 dark:bg-[#1e2340] dark:border-[#3C50E0]/40"
              : "border-gray-200 bg-gray-50 dark:border-white/[0.08] dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/15"
            }`}
          >
            <FiSearch className={`w-4 h-4 shrink-0 transition-colors ${searchFocused ? "text-[#3C50E0]" : "text-gray-400 dark:text-white/30"}`} />
            <input
              type="text"
              placeholder="Search anything…"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-48 xl:w-72 bg-transparent text-sm text-gray-700 dark:text-white/80 placeholder-gray-400 dark:placeholder-white/30 outline-none"
            />
            <kbd className="hidden xl:flex items-center gap-0.5 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:text-white/30">
              <FiCommand className="w-2.5 h-2.5" /> K
            </kbd>
          </div>
        </div>

        {/* ── Right: Actions + User ── */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            suppressHydrationWarning
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl
              bg-gray-100 hover:bg-gray-200 text-gray-600
              dark:bg-white/8 dark:hover:bg-white/12 dark:text-white/60 dark:hover:text-white
              transition-colors duration-150"
          >
            {mounted
              ? theme === "dark"
                ? <FiSun className="w-4.5 h-4.5" />
                : <FiMoon className="w-4.5 h-4.5" />
              : <FiMoon className="w-4.5 h-4.5" />
            }
          </button>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl
              bg-gray-100 hover:bg-gray-200 text-gray-600
              dark:bg-white/8 dark:hover:bg-white/12 dark:text-white/60 dark:hover:text-white
              transition-colors duration-150"
          >
            <FiBell className="w-4.5 h-4.5" />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
          </button>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-white/10" />

          {/* ── User dropdown ── */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5
                hover:bg-gray-100 dark:hover:bg-white/8 transition-colors duration-150 cursor-pointer"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3C50E0] to-[#6577F3] text-xs font-bold text-white shadow-sm shadow-[#3C50E0]/30">
                  {getInitials(user?.name || "U")}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#1a1f35] bg-emerald-400" />
              </div>

              {/* Name + role */}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-white leading-none mb-0.5">
                  {user?.name?.split(" ")[0] || "User"}
                </p>
                <p className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${badge.cls}`}>
                  {badge.label}
                </p>
              </div>

              <FiChevronDown className={`hidden lg:block w-3.5 h-3.5 text-gray-400 dark:text-white/30 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden
                rounded-2xl border border-gray-200/80 dark:border-white/[0.08]
                bg-white dark:bg-[#1e2340]
                shadow-xl shadow-black/10 dark:shadow-black/40
                animate-in fade-in-0 zoom-in-95 duration-150"
              >
                {/* User info header */}
                <div className="relative overflow-hidden px-4 pt-4 pb-3">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#3C50E0]/5 to-[#6577F3]/5 dark:from-[#3C50E0]/10 dark:to-transparent" />
                  <div className="relative flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3C50E0] to-[#6577F3] text-sm font-bold text-white shadow-md shadow-[#3C50E0]/20">
                      {getInitials(user?.name || "U")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-white/40">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>
                  <span className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/[0.06]" />

                {/* Menu items */}
                <div className="p-2">
                  {[
                    { icon: <FiUser className="w-4 h-4" />,     label: "Edit profile",      href: user?.role === "TECHNICIAN" || user?.role === "technician" ? "/dashboard/technician/profile" : "#" },
                  ].map(item => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-white/70
                        hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-white/8 dark:hover:text-white transition-colors"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-white/50">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/[0.06]" />

                {/* Logout */}
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400
                      hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-500/15 text-rose-500">
                      <FiLogOut className="w-4 h-4" />
                    </span>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
