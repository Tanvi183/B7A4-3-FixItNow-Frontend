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
  LogOut
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  // Define navigation blocks for each role
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
      { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "User Management", href: "/dashboard/admin", icon: Users }, // Mocking for now
      { name: "Categories", href: "/dashboard/admin/categories", icon: Tags },
    ],
  };

  // Safe fallback if role is undefined for some reason, though middleware protects this route.
  const currentRole = (user?.role as keyof typeof roleNavLinks) || "CUSTOMER";
  const links = roleNavLinks[currentRole] || roleNavLinks.CUSTOMER;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col shadow-sm hidden md:flex">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          {currentRole.charAt(0).toUpperCase() + currentRole.slice(1).toLowerCase()} Panel
        </h2>
        <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700 w-full transition-colors"
        >
          <LogOut size={18} className="text-slate-400 group-hover:text-rose-500" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
