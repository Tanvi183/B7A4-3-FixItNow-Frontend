"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle, FiTool, FiDollarSign, FiSearch, FiFilter, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { getCookie } from "@/stores/useAuthStore";

interface TechnicianProfile {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  pricingRate: number;
  isApproved: boolean;
  user: {
    name: string;
    email: string;
  };
  reviewCount: number;
}

export default function TechniciansPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") === "pending" ? "pending" : "all";

  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">(initialFilter);

  const fetchTechnicians = async () => {
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/technicians`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTechnicians(data.data);
      } else {
        toast.error(data.message || "Failed to load technicians");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch technicians");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleApprove = async (userId: string) => {
    setApproving(userId);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/technicians/${userId}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Technician approved successfully!");
        setTechnicians(prev => 
          prev.map(tech => tech.userId === userId ? { ...tech, isApproved: true } : tech)
        );
      } else {
        toast.error(data.message || "Failed to approve technician");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setApproving(null);
    }
  };

  const filteredTechs = useMemo(() => {
    return technicians.filter(tech => {
      const matchesSearch = 
        (tech.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (tech.user?.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (tech.skills || []).some(s => (s || "").toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "approved" && tech.isApproved) ||
        (statusFilter === "pending" && !tech.isApproved);

      return matchesSearch && matchesStatus;
    });
  }, [technicians, search, statusFilter]);

  function getInitials(name: string) {
    return (name || "U").split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  }
  function getAvatarGradient(name: string) {
    const g = ["from-violet-500 to-indigo-500","from-blue-500 to-cyan-400","from-emerald-500 to-teal-400","from-orange-400 to-rose-500","from-pink-500 to-fuchsia-500","from-amber-400 to-orange-500"];
    return g[(name?.charCodeAt(0) || 0) % g.length];
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-6 shadow-sm border border-stroke dark:bg-boxdark dark:border-strokedark">
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
            Technicians Directory
            <span className="flex h-6 items-center justify-center rounded-full bg-primary/10 px-2.5 text-xs font-semibold text-primary">
              {technicians.length} Total
            </span>
          </h2>
          <p className="mt-1 text-sm text-body dark:text-bodydark2">Manage and approve platform technicians.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search technicians..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-stroke bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
            />
          </div>
          
          <div className="relative">
            <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto appearance-none rounded-xl border border-stroke bg-gray-50 py-2 pl-10 pr-10 text-sm font-medium outline-none transition focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left dark:bg-meta-4 border-b border-stroke dark:border-strokedark">
                <th className="min-w-[280px] py-4 px-6 font-semibold text-black dark:text-white text-sm">Technician</th>
                <th className="min-w-[200px] py-4 px-6 font-semibold text-black dark:text-white text-sm">Skills & Expertise</th>
                <th className="min-w-[140px] py-4 px-6 font-semibold text-black dark:text-white text-sm">Pricing</th>
                <th className="min-w-[140px] py-4 px-6 font-semibold text-black dark:text-white text-sm">Status</th>
                <th className="py-4 px-6 font-semibold text-black dark:text-white text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-meta-4" />
                        <div className="flex flex-col gap-2">
                          <div className="h-3.5 w-24 animate-pulse rounded bg-gray-200 dark:bg-meta-4" />
                          <div className="h-3 w-32 animate-pulse rounded bg-gray-100 dark:bg-meta-4/50" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-meta-4" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-meta-4" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-meta-4" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="ml-auto h-8 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-meta-4" />
                    </td>
                  </tr>
                ))
              ) : filteredTechs.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-meta-4">
                        <FiTool className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="mt-4 text-base font-semibold text-black dark:text-white">No Technicians Found</h4>
                      <p className="mt-1 text-sm text-body dark:text-bodydark2">
                        {search ? "No technicians match your search criteria." : "There are currently no technicians in the platform."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTechs.map((tech) => (
                  <tr key={tech.id} className="group border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(tech.user?.name)} text-sm font-bold text-white shadow-sm`}>
                          {getInitials(tech.user?.name)}
                          {tech.isApproved && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-boxdark bg-emerald-500" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-semibold text-black dark:text-white group-hover:text-primary transition-colors">
                            {tech.user?.name || "Unknown"}
                          </h5>
                          <p className="text-xs text-body dark:text-bodydark2">{tech.user?.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap gap-1.5">
                          {tech.skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-0.5 text-[10px] font-semibold border border-blue-100 dark:border-blue-500/20">
                              {s}
                            </span>
                          ))}
                          {tech.skills.length > 3 && (
                            <span className="rounded-md bg-gray-100 text-gray-600 dark:bg-meta-4 dark:text-bodydark px-2 py-0.5 text-[10px] font-semibold">
                              +{tech.skills.length - 3}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-body dark:text-bodydark2 font-medium flex items-center gap-1.5">
                          <FiTool className="w-3 h-3" /> {tech.experienceYears} Years Exp
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg w-fit">
                        <FiDollarSign className="w-4 h-4" /> {tech.pricingRate}/hr
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      {tech.isApproved ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {!tech.isApproved ? (
                        <button
                          onClick={() => handleApprove(tech.userId)}
                          disabled={approving === tech.userId}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#3C50E0] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#3C50E0]/90 disabled:opacity-50 transition-all active:scale-95"
                        >
                          {approving === tech.userId ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              <FiCheckCircle className="w-4 h-4" />
                              Approve
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center justify-center w-full max-w-[105px] float-right rounded-xl bg-gray-100 dark:bg-meta-4 px-4 py-2 text-sm font-medium text-body dark:text-bodydark2 cursor-not-allowed border border-stroke dark:border-strokedark">
                          Verified
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
