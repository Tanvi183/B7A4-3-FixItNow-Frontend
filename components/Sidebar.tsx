"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FiGrid, FiUser, FiTool, FiTag, FiList, FiCheckSquare,
  FiCreditCard, FiStar, FiShoppingCart, FiMoreHorizontal,
  FiMessageCircle, FiHeadphones, FiMail, FiChevronDown, FiChevronRight,
} from "react-icons/fi";
import { useAuthStore } from "@/stores/useAuthStore";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (arg: boolean) => void;
}

/* ─── Nav item types ─── */
interface NavChild { label: string; href: string; }
interface NavItemDef {
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string;
  children?: NavChild[];
}

/* ─── Role-based nav config ─── */
const adminNav: NavItemDef[] = [
  { label: "Dashboard",   icon: <FiGrid />,        href: "/dashboard/admin" },
  { label: "Users",       icon: <FiUser />,        href: "/dashboard/admin/users" },
  {
    label: "Technicians", icon: <FiTool />,        href: "/dashboard/admin/technicians",
    children: [
      { label: "All Technicians",  href: "/dashboard/admin/technicians" },
      { label: "Pending Approvals",href: "/dashboard/admin/technicians?filter=pending" },
    ],
  },
  { label: "Categories",  icon: <FiTag />,         href: "/dashboard/admin/categories" },
  { label: "Services",    icon: <FiList />,        href: "/dashboard/admin/services" },
  { label: "Bookings",    icon: <FiCheckSquare />, href: "/dashboard/admin/bookings" },
  { label: "Payments",    icon: <FiCreditCard />,  href: "/dashboard/admin/payments" },
  { label: "Reviews",     icon: <FiStar />,        href: "/dashboard/admin/reviews" },
];

const technicianNav: NavItemDef[] = [
  { label: "Dashboard",  icon: <FiGrid />,        href: "/dashboard/technician" },
];

const customerNav: NavItemDef[] = [
  { label: "Dashboard",         icon: <FiGrid />,        href: "/dashboard/customer" },
  { label: "Book a Service",    icon: <FiShoppingCart />,href: "/services" },
];



/* ─── Single nav item component ─── */
function NavItem({
  item, expanded, pathname, searchParams,
}: { item: NavItemDef; expanded: boolean; pathname: string; searchParams: URLSearchParams; }) {
  const hasChildren = !!item.children?.length;
  
  // Prevent root dashboard links from matching all sub-pages
  const isDashboardRoot = item.href === "/dashboard/admin" || item.href === "/dashboard/technician" || item.href === "/dashboard/customer";
  const isActive = item.href 
    ? pathname === item.href || (!isDashboardRoot && pathname.startsWith(item.href + "/")) 
    : false;
    
  const childActive = item.children?.some(c => {
    // Exact match including search params
    const currentFullUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    return currentFullUrl === c.href || pathname.startsWith(c.href.split('?')[0] + "/");
  });
  
  const [open, setOpen] = React.useState(isActive || !!childActive);

  const itemActive = isActive || !!childActive;

  /* Icon wrapper classes */
  const iconCls = `flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 text-base
    ${itemActive
      ? "bg-white/15 text-white shadow-sm"
      : "text-white/50 group-hover:bg-white/10 group-hover:text-white"}`;

  const base = `group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200
    ${itemActive
      ? "bg-white/15 shadow-sm"
      : "hover:bg-white/8"}`;

  if (hasChildren) {
    return (
      <li>
        <button
          onClick={() => expanded && setOpen(!open)}
          className={`${base} w-full text-left ${expanded ? "justify-between" : "justify-center"}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className={iconCls}>{item.icon}</span>
            {expanded && (
              <span className={`truncate text-sm font-medium ${itemActive ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                {item.label}
              </span>
            )}
          </div>
          {expanded && (
            <FiChevronDown className={`w-4 h-4 shrink-0 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          )}
        </button>
        {expanded && open && (
          <ul className="relative mt-1.5 flex flex-col gap-1 pl-12 pr-2">
            {/* Main vertical track line */}
            <div className="absolute left-[1.6rem] top-0 bottom-4 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
            
            {item.children!.map(child => {
              const currentFullUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
              const ca = currentFullUrl === child.href;
              
              return (
                <li key={child.label} className="relative">
                  {/* Horizontal branch line */}
                  <div className={`absolute left-[-15px] top-1/2 h-px w-2.5 -translate-y-1/2 transition-colors duration-300 ${ca ? "bg-white/50" : "bg-white/10"}`} />
                  
                  <Link
                    href={child.href}
                    className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[11px] uppercase tracking-wider font-semibold transition-all duration-200
                      ${ca 
                        ? "bg-white/10 text-white shadow-sm" 
                        : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"}`}
                  >
                    {/* Status dot */}
                    <div className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300
                      ${ca 
                        ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                        : "bg-white/20 group-hover:bg-white/40"}`} 
                    />
                    {child.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href || "#"}
        className={`${base} ${expanded ? "" : "justify-center"}`}
      >
        <span className={iconCls}>{item.icon}</span>
        {expanded && (
          <span className={`flex-1 truncate text-sm font-medium ${itemActive ? "text-white" : "text-white/70 group-hover:text-white"}`}>
            {item.label}
          </span>
        )}
        {expanded && item.badge && (
          <span className="shrink-0 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            {item.badge}
          </span>
        )}
        {!expanded && item.badge && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-400" />
        )}
      </Link>
    </li>
  );
}

/* ─── Main Sidebar ─── */
export default function Sidebar({ sidebarOpen, setSidebarOpen, sidebarExpanded, setSidebarExpanded }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const role = user?.role || "CUSTOMER";
  const mainNav = role === "ADMIN" ? adminNav : role === "TECHNICIAN" ? technicianNav : customerNav;

  function getInitials(name: string) {
    return (name || "U").split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  }

  const roleLabel = role === "ADMIN" ? "Administrator" : role === "TECHNICIAN" ? "Technician" : "Customer";

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden
          bg-gradient-to-b from-[#1a1f35] via-[#1e2340] to-[#1a1f35]
          border-r border-white/[0.06] shadow-2xl
          transition-all duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarExpanded ? "w-64" : "w-20"}`}
      >
        {/* Subtle top gradient accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* ── Logo ── */}
        <div className={`flex h-16 shrink-0 items-center border-b border-white/[0.06] px-4
          ${sidebarExpanded ? "justify-between" : "justify-center"}`}
        >
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            {/* Logo icon */}
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3C50E0] to-[#6577F3] shadow-lg shadow-[#3C50E0]/30">
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-white">
                <path d="M10 2L3 7v11h5v-4h4v4h5V7L10 2z" fill="currentColor" fillOpacity=".9"/>
              </svg>
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
            </div>
            {sidebarExpanded && (
              <span className="truncate text-lg font-bold tracking-tight text-white">
                FixItNow
              </span>
            )}
          </Link>

          {/* Mobile close */}
          {sidebarExpanded && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* ── Scrollable nav ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 [&::-webkit-scrollbar]:w-0">
          <nav className={`space-y-0.5 ${sidebarExpanded ? "px-3" : "px-2"}`}>

            {/* Main menu group */}
            {sidebarExpanded && (
              <p className="mb-2 ml-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Main Menu
              </p>
            )}
            {!sidebarExpanded && <div className="my-3 border-t border-white/[0.06]" />}

            <ul className="flex flex-col gap-0.5">
              {mounted ? mainNav.map(item => (
                <NavItem key={item.label} item={item} expanded={sidebarExpanded} pathname={pathname} searchParams={searchParams} />
              )) : (
                <div className="h-48 animate-pulse rounded-xl bg-white/5 mx-2" />
              )}
            </ul>

          </nav>
        </div>

        {/* ── User card at bottom ── */}
        {mounted && (
          <div className={`shrink-0 border-t border-white/[0.06] p-3`}>
            <div className={`flex items-center gap-3 rounded-xl bg-white/8 p-2.5 ${sidebarExpanded ? "" : "justify-center"}`}>
              <div className="relative shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3C50E0] to-[#6577F3] text-xs font-bold text-white shadow-sm">
                  {getInitials(user?.name || "U")}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#1e2340] bg-emerald-400" />
              </div>
              {sidebarExpanded && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">{user?.name || "User"}</p>
                  <p className="truncate text-[10px] text-white/40">{roleLabel}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
