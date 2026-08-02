"use client";

import { useState } from "react";
import { 
  Users, 
  Briefcase, 
  TrendingUp,
  DollarSign,
  Ban,
  CheckCircle2,
  ShieldAlert,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CalendarDays,
  MoreVertical
} from "lucide-react";
import Image from "next/image";

// Mock Stats - 4 cards like Maxton
const platformStats = [
  { 
    label: "Active Users", 
    value: "42.5K", 
    change: "+12.5%", 
    isPositive: true,
    icon: Users, 
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400"
  },
  { 
    label: "Total Bookings", 
    value: "97.4K", 
    change: "+8.3%", 
    isPositive: true,
    icon: CalendarDays, 
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400"
  },
  { 
    label: "Total Revenue", 
    value: "$82.7K", 
    change: "+15.2%", 
    isPositive: true,
    icon: DollarSign, 
    color: "from-violet-500 to-violet-600",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-400"
  },
  { 
    label: "Total Services", 
    value: "68.4K", 
    change: "-2.7%", 
    isPositive: false,
    icon: BarChart3, 
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400"
  },
];

// Mock Users
const initialUsers = [
  { id: "USR-001", name: "Alice Johnson", email: "alice@example.com", role: "CUSTOMER", status: "ACTIVE", joinDate: "Jan 15, 2024", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop" },
  { id: "USR-002", name: "Michael Chen", email: "michael@example.com", role: "TECHNICIAN", status: "ACTIVE", joinDate: "Feb 02, 2024", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop" },
  { id: "USR-003", name: "Bad Actor", email: "scammer@example.com", role: "CUSTOMER", status: "BANNED", joinDate: "Mar 10, 2024", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop" },
  { id: "USR-004", name: "Sarah Jenkins", email: "sarah@example.com", role: "TECHNICIAN", status: "ACTIVE", joinDate: "Jan 20, 2024", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop" },
];

export default function AdminDashboardPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "ACTIVE" ? "BANNED" : "ACTIVE" };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 w-full">
      
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">Dashboard</h1>
          <p className="text-slate-400 mt-0.5 text-sm flex items-center gap-2">
            <span>🏠</span> Home / Admin Overview
          </p>
        </div>
      </div>

      {/* Welcome Banner - Like Maxton */}
      <div className="relative bg-[#0f1535] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="relative z-10 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#008cff]/50 shadow-lg shadow-[#008cff]/20">
              <Image 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop" 
                alt="Admin" 
                fill 
                className="object-cover" 
                sizes="64px"
              />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Welcome back</p>
              <h2 className="text-2xl font-bold text-white font-heading">Platform Admin!</h2>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center border-r border-white/10 pr-8">
              <h3 className="text-2xl font-bold text-white font-heading">$65.4K</h3>
              <p className="text-slate-400 text-sm mt-1">Today&apos;s Sales</p>
              <div className="mt-2 h-1 w-full rounded-full bg-emerald-500"></div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white font-heading">78.4%</h3>
              <p className="text-slate-400 text-sm mt-1">Growth Rate</p>
              <div className="mt-2 h-1 w-full rounded-full bg-rose-500"></div>
            </div>
          </div>
        </div>
        {/* Decorative gradient orb */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#008cff]/10 to-transparent rounded-full -mr-20 -mt-20 blur-3xl" />
      </div>

      {/* Stats Grid - 4 Cards like Maxton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#0f1535] rounded-2xl border border-white/[0.08] p-5 group hover:border-white/[0.15] transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white font-heading">{stat.value}</h3>
                  <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                </div>
                <button className="text-slate-500 hover:text-slate-300 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Mini chart placeholder - colored bar visualization */}
              <div className="mt-4 flex items-end gap-[3px] h-10">
                {[35, 55, 40, 70, 45, 60, 50, 75, 55, 65, 45, 70].map((h, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-sm ${stat.bgColor} transition-all duration-300 group-hover:opacity-100 opacity-70`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </span>
                <span className="text-xs text-slate-500">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
