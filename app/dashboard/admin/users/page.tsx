"use client";

import { useState } from "react";
import { Search, CheckCircle2, ShieldAlert, Ban } from "lucide-react";
import Image from "next/image";

// Mock Users
const initialUsers = [
  { id: "USR-001", name: "Alice Johnson", email: "alice@example.com", role: "CUSTOMER", status: "ACTIVE", joinDate: "Jan 15, 2024", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop" },
  { id: "USR-002", name: "Michael Chen", email: "michael@example.com", role: "TECHNICIAN", status: "ACTIVE", joinDate: "Feb 02, 2024", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop" },
  { id: "USR-003", name: "Bad Actor", email: "scammer@example.com", role: "CUSTOMER", status: "BANNED", joinDate: "Mar 10, 2024", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop" },
  { id: "USR-004", name: "Sarah Jenkins", email: "sarah@example.com", role: "TECHNICIAN", status: "ACTIVE", joinDate: "Jan 20, 2024", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop" },
];

export default function UserManagementPage() {
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
          <h1 className="text-2xl font-bold text-white font-heading">User Management</h1>
          <p className="text-slate-400 mt-0.5 text-sm flex items-center gap-2">
            <span>👥</span> Dashboard / User Management
          </p>
        </div>
      </div>

      {/* User Management Card */}
      <div className="bg-[#0f1535] border border-white/[0.08] rounded-2xl overflow-hidden mt-4">
        {/* Card Header */}
        <div className="p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-heading">User Directory</h2>
            <p className="text-sm text-slate-400 mt-0.5">Manage customers and technicians.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#181f4a] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#008cff]/30 focus:border-[#008cff]/50 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-white/[0.06]">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className={`hover:bg-white/[0.02] transition-colors ${index < filteredUsers.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/10">
                        <Image 
                          src={user.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop"} 
                          alt={user.name} 
                          fill 
                          className="object-cover" 
                          sizes="40px" 
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
                      user.role === 'TECHNICIAN' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4">
                    {user.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={14} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <ShieldAlert size={14} /> Banned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`inline-flex items-center justify-center w-28 gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        user.status === "ACTIVE" 
                          ? "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500" 
                          : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
                      }`}
                    >
                      {user.status === "ACTIVE" ? (
                        <><Ban size={14} /> Suspend</>
                      ) : (
                        <><CheckCircle2 size={14} /> Restore</>
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
