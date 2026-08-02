"use client";

import { useState } from "react";
import { 
  Users, 
  Briefcase, 
  TrendingUp,
  Ban,
  CheckCircle2,
  MoreVertical,
  ShieldAlert,
  Search
} from "lucide-react";
import Image from "next/image";

// Mock Stats
const platformStats = [
  { label: "Total Users", value: "2,450", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Active Bookings", value: "145", change: "+5%", icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Revenue", value: "$45,200", change: "+18%", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
];

// Mock Users
const initialUsers = [
  { id: "USR-001", name: "Alice Johnson", email: "alice@example.com", role: "CUSTOMER", status: "ACTIVE", joinDate: "Jan 15, 2024" },
  { id: "USR-002", name: "Michael Chen", email: "michael@example.com", role: "TECHNICIAN", status: "ACTIVE", joinDate: "Feb 02, 2024" },
  { id: "USR-003", name: "Bad Actor", email: "scammer@example.com", role: "CUSTOMER", status: "BANNED", joinDate: "Mar 10, 2024" },
  { id: "USR-004", name: "Sarah Jenkins", email: "sarah@example.com", role: "TECHNICIAN", status: "ACTIVE", joinDate: "Jan 20, 2024" },
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
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Admin Overview</h1>
        <p className="text-slate-500 mt-1 text-sm">Platform statistics and user management.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {platformStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                <p className="text-sm font-medium text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp size={14} /> {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Management Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900 font-heading">User Management</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4">
                    {user.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={14} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        <ShieldAlert size={14} /> Banned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        user.status === "ACTIVE" 
                          ? "bg-white border border-slate-200 text-rose-600 hover:bg-rose-50" 
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {user.status === "ACTIVE" ? (
                        <><Ban size={16} /> Ban User</>
                      ) : (
                        <><CheckCircle2 size={16} /> Unban User</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
