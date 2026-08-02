"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { 
  LayoutDashboard, 
  CalendarClock, 
  Star, 
  UserCircle, 
  Users, 
  Tags,
  Wrench,
  LogOut
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const roleNavLinks = {
    CUSTOMER: [
      { name: "My Bookings", href: "/dashboard/customer", icon: CalendarClock },
      { name: "Leave Review", href: "/dashboard/customer/reviews/new", icon: Star },
    ],
    TECHNICIAN: [
      { name: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
      { name: "My Profile", href: "/dashboard/technician/profile", icon: UserCircle },
      { name: "Bookings", href: "/dashboard/technician/bookings", icon: CalendarClock },
    ],
    ADMIN: [
      { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "User Management", href: "/dashboard/admin/users", icon: Users },
      { name: "Categories", href: "/dashboard/admin/categories", icon: Tags },
      { name: "Services", href: "/dashboard/admin/services", icon: Wrench },
    ],
  };

  const currentRole = (user?.role as keyof typeof roleNavLinks) || "ADMIN";
  const links = roleNavLinks[currentRole] || roleNavLinks.CUSTOMER;

  return (
    <aside className="w-[260px] bg-[#0b1120] border-r border-white/[0.05] h-screen sticky top-0 flex flex-col hidden md:flex shrink-0 font-sans">
      
      {/* Brand / Logo Area */}
      <div className="h-[70px] flex items-center px-6">
        <Link href="/" className="flex items-center gap-3">
          {/* Recreated Logo from Maxton image: Two overlapping colorful blobs */}
          <div className="relative w-[34px] h-[34px] flex items-center justify-center shrink-0">
            <div className="absolute left-0 top-1 w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full opacity-90 mix-blend-screen"></div>
            <div className="absolute right-0 bottom-1 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-90 mix-blend-screen"></div>
          </div>
          <span className="text-[22px] font-semibold text-white tracking-wide">FixItNow</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col space-y-[4px] scrollbar-hide">
        
        <div className="pt-4 pb-2 px-3">
          <span className="text-[11px] font-semibold text-slate-500/80 tracking-widest uppercase">
            {currentRole} MENU
          </span>
        </div>

        {links.map((link) => {
          // Exact match to avoid double highlighting
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center justify-between px-3 py-[10px] rounded-[6px] text-[15px] transition-colors group ${
                isActive
                  ? "bg-[#1e293b]/60 text-white"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 2 : 1.5} 
                  className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300 transition-colors"} 
                />
                <span className={isActive ? "font-medium" : "font-normal"}>{link.name}</span>
              </div>
              
              {/* Left-pointing chevron mimicking the Maxton style exactly */}
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`transition-colors ${isActive ? "text-white" : "text-slate-500 opacity-60 group-hover:opacity-100"}`}
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => {
            import('sweetalert2').then((module) => {
              const Swal = module.default;
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
          className="cursor-pointer flex items-center gap-3 px-3 py-[10px] rounded-[6px] text-[15px] font-normal text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 w-full transition-colors group"
        >
          <LogOut size={20} strokeWidth={1.5} className="text-slate-400 group-hover:text-rose-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
