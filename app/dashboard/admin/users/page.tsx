"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  FiSlash,
  FiCheckCircle,
  FiSearch,
  FiUsers,
  FiUserCheck,
  FiShield,
  FiTool,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { getCookie } from "@/stores/useAuthStore";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "TECHNICIAN";
  status: "ACTIVE" | "BANNED";
  createdAt: string;
}

type RoleFilter = "ALL" | "ADMIN" | "CUSTOMER" | "TECHNICIAN";
type StatusFilter = "ALL" | "ACTIVE" | "BANNED";

const ROLE_CONFIG = {
  ADMIN: {
    label: "Admin",
    bg: "bg-[#3C50E0]/10 text-[#3C50E0] dark:text-[#8fa4f3]",
    dot: "bg-[#3C50E0]",
    icon: <FiShield className="w-3 h-3" />,
  },
  TECHNICIAN: {
    label: "Technician",
    bg: "bg-warning/10 text-warning",
    dot: "bg-warning",
    icon: <FiTool className="w-3 h-3" />,
  },
  CUSTOMER: {
    label: "Customer",
    bg: "bg-success/10 text-success",
    dot: "bg-success",
    icon: <FiUsers className="w-3 h-3" />,
  },
};

const STATUS_CONFIG = {
  ACTIVE: { label: "Active", bg: "bg-success/10 text-success", dot: "bg-success" },
  BANNED: { label: "Banned", bg: "bg-danger/10 text-danger", dot: "bg-danger" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    "from-violet-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-400 to-rose-500",
    "from-pink-500 to-fuchsia-500",
    "from-amber-400 to-orange-500",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className={`flex items-center gap-4 rounded-xl border border-stroke bg-white px-5 py-4 shadow-sm dark:border-strokedark dark:bg-boxdark`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
        <p className="text-sm text-body dark:text-bodydark2">{label}</p>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="border-b border-stroke px-4 py-4 dark:border-strokedark">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-meta-4" />
          <div>
            <div className="h-4 w-28 rounded bg-gray-200 dark:bg-meta-4 mb-1.5" />
            <div className="h-3 w-20 rounded bg-gray-100 dark:bg-meta-4" />
          </div>
        </div>
      </td>
      <td className="border-b border-stroke px-4 py-4 dark:border-strokedark">
        <div className="h-4 w-36 rounded bg-gray-200 dark:bg-meta-4" />
      </td>
      <td className="border-b border-stroke px-4 py-4 dark:border-strokedark">
        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-meta-4" />
      </td>
      <td className="border-b border-stroke px-4 py-4 dark:border-strokedark">
        <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-meta-4" />
      </td>
      <td className="border-b border-stroke px-4 py-4 dark:border-strokedark">
        <div className="h-3 w-24 rounded bg-gray-200 dark:bg-meta-4" />
      </td>
      <td className="border-b border-stroke px-4 py-4 dark:border-strokedark">
        <div className="h-8 w-24 rounded-lg bg-gray-200 dark:bg-meta-4" />
      </td>
    </tr>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const fetchUsers = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error(data.message || "Failed to load users");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(newStatus === "ACTIVE" ? "User activated successfully!" : "User banned successfully!");
        setUsers((prev) =>
          prev.map((user) => (user.id === id ? { ...user, status: newStatus as any } : user))
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === "ACTIVE").length,
    technicians: users.filter((u) => u.role === "TECHNICIAN").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  }), [users]);

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">User Management</h1>
          <p className="text-sm text-body dark:text-bodydark2 mt-0.5">
            View, search, filter and manage all registered users
          </p>
        </div>
        <button
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4 disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Users" value={stats.total} icon={<FiUsers className="w-5 h-5 text-white" />} color="bg-gradient-to-br from-[#3C50E0] to-[#6576ff]" />
        <StatCard label="Active Users" value={stats.active} icon={<FiUserCheck className="w-5 h-5 text-white" />} color="bg-gradient-to-br from-emerald-500 to-teal-400" />
        <StatCard label="Technicians" value={stats.technicians} icon={<FiTool className="w-5 h-5 text-white" />} color="bg-gradient-to-br from-amber-400 to-orange-500" />
        <StatCard label="Admins" value={stats.admins} icon={<FiShield className="w-5 h-5 text-white" />} color="bg-gradient-to-br from-violet-500 to-indigo-500" />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-body dark:text-bodydark2 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <FiFilter className="text-body w-4 h-4 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="rounded-lg border border-stroke bg-white py-2.5 px-3 text-sm outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-lg border border-stroke bg-white py-2.5 px-3 text-sm outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="mb-3 text-sm text-body dark:text-bodydark2">
          Showing <span className="font-semibold text-black dark:text-white">{filtered.length}</span> of{" "}
          <span className="font-semibold text-black dark:text-white">{users.length}</span> users
        </p>
      )}

      {/* Table */}
      <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-stroke bg-gray-50 dark:border-strokedark dark:bg-meta-4">
                <th className="py-4 px-5 text-left text-xs font-semibold uppercase tracking-wider text-body dark:text-bodydark2">
                  User
                </th>
                <th className="py-4 px-5 text-left text-xs font-semibold uppercase tracking-wider text-body dark:text-bodydark2">
                  Email
                </th>
                <th className="py-4 px-5 text-left text-xs font-semibold uppercase tracking-wider text-body dark:text-bodydark2">
                  Role
                </th>
                <th className="py-4 px-5 text-left text-xs font-semibold uppercase tracking-wider text-body dark:text-bodydark2">
                  Status
                </th>
                <th className="py-4 px-5 text-left text-xs font-semibold uppercase tracking-wider text-body dark:text-bodydark2">
                  Joined
                </th>
                <th className="py-4 px-5 text-center text-xs font-semibold uppercase tracking-wider text-body dark:text-bodydark2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-strokedark">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-body dark:text-bodydark2">
                      <FiUsers className="w-10 h-10 opacity-30" />
                      <p className="font-medium">No users found</p>
                      <p className="text-sm opacity-70">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const roleConf = ROLE_CONFIG[user.role];
                  const statusConf = STATUS_CONFIG[user.status];
                  const isUpdating = updatingId === user.id;
                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors hover:bg-gray-50 dark:hover:bg-meta-4/40 ${
                        user.status === "BANNED" ? "opacity-60" : ""
                      }`}
                    >
                      {/* User cell */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarColor(user.name)} text-white text-sm font-bold shadow-sm`}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-black dark:text-white leading-tight">
                              {user.name}
                            </p>
                            <p className="text-xs text-body dark:text-bodydark2 mt-0.5">
                              ID: {user.id.slice(0, 8)}…
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-black dark:text-white">{user.email}</span>
                      </td>

                      {/* Role badge */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${roleConf.bg}`}
                        >
                          {roleConf.icon}
                          {roleConf.label}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusConf.bg}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusConf.dot}`} />
                          {statusConf.label}
                        </span>
                      </td>

                      {/* Joined date */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-body dark:text-bodydark2">
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center">
                          {user.role === "ADMIN" ? (
                            <span className="text-xs text-body dark:text-bodydark2 italic">Protected</span>
                          ) : isUpdating ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          ) : user.status === "ACTIVE" ? (
                            <button
                              onClick={() => handleUpdateStatus(user.id, "BANNED")}
                              className="flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/5 px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger hover:text-white"
                            >
                              <FiSlash className="w-3.5 h-3.5" />
                              Ban User
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(user.id, "ACTIVE")}
                              className="flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/5 px-3 py-1.5 text-xs font-medium text-success transition hover:bg-success hover:text-white"
                            >
                              <FiCheckCircle className="w-3.5 h-3.5" />
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
