"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2, ShieldAlert, Ban, Loader2, MoreVertical, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

// Helper to get cookies manually
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users on mount
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error(data.message || "Failed to load users");
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (user: User) => {
    const newStatus = user.status === "ACTIVE" ? "BANNED" : "ACTIVE";
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to ${newStatus === "BANNED" ? "suspend" : "restore"} ${user.name}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === "BANNED" ? '#ef4444' : '#10b981',
      cancelButtonColor: '#334155',
      confirmButtonText: `Yes, ${newStatus === "BANNED" ? "Suspend" : "Restore"}`
    });

    if (result.isConfirmed) {
      try {
        const token = getCookie("accessToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        const data = await res.json();
        
        if (data.success) {
          toast.success(`${user.name} has been ${newStatus === "BANNED" ? "suspended" : "restored"}.`);
          // Optimistic update
          setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, status: newStatus } : u)));
        } else {
          toast.error(data.message || "Failed to update status");
        }
      } catch (error) {
        toast.error("An error occurred while updating status");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 w-full max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white font-heading">User Management</h1>
        <p className="text-slate-400 text-[13px] flex items-center gap-2">
          <span>👥</span> Dashboard / <span className="text-white">User Management</span>
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-[#0b1120] border border-white/[0.05] rounded-2xl shadow-xl overflow-hidden mt-2">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.01]">
          <div>
            <h2 className="text-[17px] font-semibold text-white">User Directory</h2>
            <p className="text-[13px] text-slate-400 mt-0.5">Manage access, roles, and status of platform members.</p>
          </div>
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#0ea5e9] transition-colors" size={16} strokeWidth={2} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] focus:border-[#0ea5e9]/50 rounded-[10px] text-[14px] text-white placeholder:text-slate-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[#0ea5e9]" size={32} />
              <p className="text-slate-400 text-sm">Loading users...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/[0.05]">User Details</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/[0.05]">Role</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/[0.05]">Joined</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/[0.05]">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/[0.05] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-semibold text-white group-hover:text-[#0ea5e9] transition-colors">{user.name}</span>
                          <span className="text-[12px] text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role === 'ADMIN' && <ShieldCheck size={14} className="text-purple-400" />}
                        <span className={`text-[12px] font-semibold tracking-wide ${
                          user.role === 'ADMIN' ? 'text-purple-400' :
                          user.role === 'TECHNICIAN' ? 'text-amber-400' : 'text-blue-400'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      {user.status === "ACTIVE" ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                          <CheckCircle2 size={12} className="text-emerald-400" />
                          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Active</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20">
                          <ShieldAlert size={12} className="text-rose-400" />
                          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wide">Banned</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'ADMIN' ? (
                        <button
                          onClick={() => toggleUserStatus(user)}
                          className={`inline-flex items-center justify-center w-[110px] gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                            user.status === "ACTIVE" 
                              ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white" 
                              : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                          }`}
                        >
                          {user.status === "ACTIVE" ? (
                            <><Ban size={14} strokeWidth={2.5} /> Suspend</>
                          ) : (
                            <><CheckCircle2 size={14} strokeWidth={2.5} /> Restore</>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold pr-4">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="text-slate-600 mb-2" size={32} />
                        <p className="text-slate-300 font-medium">No users found</p>
                        <p className="text-slate-500 text-sm">We couldn't find any users matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
