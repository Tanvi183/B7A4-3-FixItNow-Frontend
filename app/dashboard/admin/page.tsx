"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  FiUsers, FiCalendar, FiTool, FiTag, FiList, FiStar,
  FiArrowUp, FiArrowRight, FiCheckCircle, FiXCircle,
  FiActivity, FiTrendingUp,
} from "react-icons/fi";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

/* ─────────── Types ─────────── */
interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalTechnicians: number;
  totalCategories: number;
  totalServices: number;
  totalReviews: number;
  bookings: any[];
  technicians: any[];
}

/* ─────────── Helpers ─────────── */
function getInitials(name: string) {
  return name?.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase() || "?";
}
function getAvatarGradient(name: string) {
  const g = ["from-violet-500 to-indigo-500","from-blue-500 to-cyan-400","from-emerald-500 to-teal-400","from-orange-400 to-rose-500","from-pink-500 to-fuchsia-500","from-amber-400 to-orange-500"];
  return g[(name?.charCodeAt(0) || 0) % g.length];
}

/* ─────────── Sub-components ─────────── */
function StatCard({ title, value, icon, gradient, change, link }: {
  title: string; value: number | string; icon: React.ReactNode;
  gradient: string; change?: string; link?: string;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() => link && router.push(link)}
      className={`group relative overflow-hidden rounded-2xl p-5 shadow-md
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        ${gradient} ${link ? "cursor-pointer" : ""}`}
    >
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-black/10 blur-xl" />

      {/* Content */}
      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
          {change && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-white/60">
              <FiArrowUp className="w-3 h-3" /> {change}
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white text-lg shadow-sm backdrop-blur-sm">
          {icon}
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        {link ? (
          <span className="flex items-center gap-1 text-xs font-medium text-white/50 group-hover:text-white/90 transition-colors">
            View all <FiArrowRight className="w-3 h-3" />
          </span>
        ) : (
          <span className="text-xs text-white/30">—</span>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-gray-200 dark:bg-meta-4 h-36" />
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    REQUESTED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ACCEPTED:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    PAID:      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    IN_PROGRESS:"bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    DECLINED:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

/* ─────────── Chart configs ─────────── */
function makeAreaOptions(isDark: boolean): ApexOptions {
  return {
    chart: { type: "area", toolbar: { show: false }, fontFamily: "inherit", background: "transparent" },
    colors: ["#3C50E0", "#10b981"],
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 } },
    stroke: { curve: "smooth", width: 2 },
    dataLabels: { enabled: false },
    grid: { borderColor: isDark ? "#2d3548" : "#f0f0f0", strokeDashArray: 4 },
    xaxis: {
      categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      labels: { style: { colors: isDark ? "#9ca3af" : "#6b7280", fontSize: "11px" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: isDark ? "#9ca3af" : "#6b7280", fontSize: "11px" } } },
    legend: { show: true, position: "top", horizontalAlign: "left", labels: { colors: isDark ? "#d1d5db" : "#374151" } },
    markers: { size: 4, strokeWidth: 2, hover: { sizeOffset: 3 } },
    tooltip: { theme: isDark ? "dark" : "light" },
  };
}

function makeDonutOptions(isDark: boolean): ApexOptions {
  return {
    chart: { type: "donut", fontFamily: "inherit", background: "transparent" },
    // Order must match: REQUESTED, ACCEPTED, PAID, DECLINED, IN_PROGRESS, COMPLETED
    colors: ["#3C50E0","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"],
    labels: ["Requested","Accepted","Paid","Declined","In Progress","Completed"],
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              color: isDark ? "#d1d5db" : "#374151",
              fontWeight: 700,
              fontSize: "13px",
            },
            value: {
              show: true,
              color: isDark ? "#9ca3af" : "#6b7280",
              fontSize: "22px",
              fontWeight: 700,
            },
          },
        },
      },
    },
    tooltip: { theme: isDark ? "dark" : "light" },
    stroke: { width: 2, colors: [isDark ? "#1e2340" : "#ffffff"] },
  };
}

/* ─────────── Page ─────────── */
export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const fetch$ = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = getCookie("accessToken");
        const h = { Authorization: `Bearer ${token}` };

        const [uR, bR, tR, cR, sR, rR] = await Promise.all([
          fetch(`${apiUrl}/admin/users`, { headers: h }),
          fetch(`${apiUrl}/bookings`, { headers: h }),
          fetch(`${apiUrl}/technicians`, { headers: h }),
          fetch(`${apiUrl}/categories`, { headers: h }),
          fetch(`${apiUrl}/services`, { headers: h }),
          fetch(`${apiUrl}/reviews`, { headers: h }),
        ]);
        const [uD, bD, tD, cD, sD, rD] = await Promise.all([
          uR.json(), bR.json(), tR.json(), cR.json(), sR.json(), rR.json(),
        ]);

        setStats({
          totalUsers:       uD?.data?.length ?? 0,
          totalBookings:    bD?.data?.length ?? 0,
          totalTechnicians: tD?.data?.length ?? 0,
          totalCategories:  cD?.data?.length ?? 0,
          totalServices:    sD?.data?.length ?? 0,
          totalReviews:     rD?.data?.length ?? 0,
          bookings:         Array.isArray(bD?.data) ? bD.data : [],
          technicians:      Array.isArray(tD?.data) ? tD.data : [],
        });
      } catch {
        setError("Failed to load dashboard. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetch$();
  }, []);

  /* booking status breakdown for donut — order matches labels array */
  const BOOKING_STATUSES = ["REQUESTED","ACCEPTED","PAID","DECLINED","IN_PROGRESS","COMPLETED"] as const;
  
  const realBookingCounts = React.useMemo(() => {
    const map: Record<string, number> = { REQUESTED:0, ACCEPTED:0, PAID:0, DECLINED:0, IN_PROGRESS:0, COMPLETED:0 };
    (stats?.bookings || []).forEach((b: any) => { if (map[b.status] !== undefined) map[b.status]++; });
    return BOOKING_STATUSES.map(s => map[s]);
  }, [stats]);

  const bookingStatusCounts = React.useMemo(() => {
    // Use real counts for chart; if all zero, use even 1s so ring renders with all colors
    const vals = realBookingCounts;
    return vals.every(v => v === 0) ? [1,1,1,1,1,1] : vals;
  }, [realBookingCounts]);

  const recentBookings = stats?.bookings?.slice(0, 6) ?? [];
  const topTechnicians = stats?.technicians?.slice(0, 4) ?? [];

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3C50E0] via-[#5366e8] to-[#6577F3] px-8 py-7 shadow-lg">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">{greeting},</p>
            <h1 className="mt-0.5 text-2xl font-bold text-white">{user?.name || "Admin"} 👋</h1>
            <p className="mt-1 text-sm text-white/60">
              Here's what's happening across FixItNow today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/admin/users" className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/25">
              <FiUsers className="w-4 h-4" /> Manage Users
            </Link>
            <Link href="/dashboard/admin/technicians" className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/25">
              <FiTool className="w-4 h-4" /> Approve Technicians
            </Link>
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <FiXCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Total Users"       value={stats?.totalUsers ?? 0}       icon={<FiUsers className="w-5 h-5"/>}       gradient="bg-gradient-to-br from-[#3C50E0] to-[#6577F3]" change="+12% this month" link="/dashboard/admin/users" />
            <StatCard title="Total Bookings"    value={stats?.totalBookings ?? 0}     icon={<FiCalendar className="w-5 h-5"/>}    gradient="bg-gradient-to-br from-emerald-500 to-teal-400"  change="+8% this month" />
            <StatCard title="Technicians"       value={stats?.totalTechnicians ?? 0}  icon={<FiTool className="w-5 h-5"/>}        gradient="bg-gradient-to-br from-amber-400 to-orange-500"  link="/dashboard/admin/technicians" />
            <StatCard title="Categories"        value={stats?.totalCategories ?? 0}   icon={<FiTag className="w-5 h-5"/>}         gradient="bg-gradient-to-br from-violet-500 to-purple-600" />
            <StatCard title="Services"          value={stats?.totalServices ?? 0}     icon={<FiList className="w-5 h-5"/>}        gradient="bg-gradient-to-br from-cyan-500 to-blue-500"     />
            <StatCard title="Reviews"           value={stats?.totalReviews ?? 0}      icon={<FiStar className="w-5 h-5"/>}        gradient="bg-gradient-to-br from-rose-500 to-pink-500"     />
          </>
        )}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Area Chart — Monthly Activity */}
        <div className="col-span-12 xl:col-span-8 rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white">Platform Activity</h2>
              <p className="text-xs text-body dark:text-bodydark2 mt-0.5">Bookings & User registrations over the year</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-meta-4">
              {["1M","3M","1Y"].map(t => (
                <button key={t} className="rounded-md px-3 py-1 text-xs font-medium text-body transition first:bg-white first:shadow-sm dark:first:bg-boxdark hover:text-black dark:hover:text-white">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ReactApexChart
            options={makeAreaOptions(isDark)}
            series={[
              { name: "Bookings", data: [12,19,14,26,18,32,28,41,35,48,42,56] },
              { name: "New Users", data: [8,14,10,19,13,24,21,30,27,36,31,43] },
            ]}
            type="area"
            height={280}
            width="100%"
          />
        </div>

        {/* Donut — Booking Status */}
        <div className="col-span-12 xl:col-span-4 rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-black dark:text-white">Booking Statuses</h2>
            <p className="text-xs text-body dark:text-bodydark2 mt-0.5">Current distribution of all bookings</p>
          </div>
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <ReactApexChart
                options={makeDonutOptions(isDark)}
                series={bookingStatusCounts}
                type="donut"
                height={220}
                width="100%"
              />
              <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                {(["Requested","Accepted","Paid","Declined","In Progress","Completed"] as const).map((label, i) => {
                  const colors = ["#3C50E0","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];
                  const count = realBookingCounts[i];
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colors[i] }} />
                      <span className="text-body dark:text-bodydark2">{label}</span>
                      <span className={`ml-auto font-bold ${count > 0 ? "text-black dark:text-white" : "text-body/50 dark:text-bodydark2/40"}`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-12 gap-4">
        {/* Recent Bookings */}
        <div className="col-span-12 xl:col-span-8 rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stroke dark:border-strokedark">
            <div className="flex items-center gap-2">
              <FiActivity className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-black dark:text-white">Recent Bookings</h2>
            </div>
            <Link href="/dashboard/admin/bookings" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stroke bg-gray-50/60 dark:border-strokedark dark:bg-meta-4/40">
                  <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider text-body dark:text-bodydark2">Customer</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-body dark:text-bodydark2">Service</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-body dark:text-bodydark2">Status</th>
                  <th className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider text-body dark:text-bodydark2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-strokedark">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-3"><div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-meta-4" /><div className="h-3 w-24 rounded bg-gray-200 dark:bg-meta-4" /></div></td>
                      <td className="px-4 py-3"><div className="h-3 w-28 rounded bg-gray-200 dark:bg-meta-4" /></td>
                      <td className="px-4 py-3"><div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-meta-4" /></td>
                      <td className="px-4 py-3 text-right"><div className="h-3 w-16 rounded bg-gray-200 dark:bg-meta-4 ml-auto" /></td>
                    </tr>
                  ))
                ) : recentBookings.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-body dark:text-bodydark2 text-sm">No bookings yet</td></tr>
                ) : (
                  recentBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-meta-4/20 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(b.customer?.name || "U")} text-white text-xs font-bold`}>
                            {getInitials(b.customer?.name || "U")}
                          </div>
                          <span className="font-medium text-black dark:text-white">{b.customer?.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-body dark:text-bodydark2">{b.service?.name || "—"}</td>
                      <td className="px-4 py-3"><BookingStatusBadge status={b.status} /></td>
                      <td className="px-4 py-3 text-right text-xs text-body dark:text-bodydark2">
                        {new Date(b.createdAt || b.scheduledAt).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Technicians & Quick Actions */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
            <h2 className="mb-4 text-base font-semibold text-black dark:text-white flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4 text-primary" /> Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/dashboard/admin/users",       icon: <FiUsers className="w-5 h-5"/>,     label: "Users",        color: "text-[#3C50E0] bg-[#3C50E0]/10" },
                { href: "/dashboard/admin/technicians", icon: <FiTool className="w-5 h-5"/>,      label: "Technicians",  color: "text-amber-600 bg-amber-100 dark:bg-amber-900/20" },
                { href: "/dashboard/admin/bookings",    icon: <FiCalendar className="w-5 h-5"/>,  label: "Bookings",     color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20" },
                { href: "/dashboard/admin/reviews",     icon: <FiStar className="w-5 h-5"/>,      label: "Reviews",      color: "text-rose-600 bg-rose-100 dark:bg-rose-900/20" },
              ].map(({ href, icon, label, color }) => (
                <Link key={label} href={href} className="flex flex-col items-center gap-2 rounded-xl border border-stroke p-4 text-center transition hover:border-primary hover:shadow-md dark:border-strokedark dark:hover:border-primary">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>{icon}</div>
                  <span className="text-xs font-medium text-black dark:text-white">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Technicians */}
          <div className="flex-1 rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-black dark:text-white flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-emerald-500" /> Top Technicians
              </h2>
            </div>
            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-meta-4 shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 w-24 rounded bg-gray-200 dark:bg-meta-4 mb-1" />
                      <div className="h-2 w-16 rounded bg-gray-100 dark:bg-meta-4" />
                    </div>
                    <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-meta-4" />
                  </div>
                ))
              ) : topTechnicians.length === 0 ? (
                <p className="text-sm text-body dark:text-bodydark2 text-center py-4">No technicians yet</p>
              ) : (
                topTechnicians.map((t: any) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(t.user?.name || "T")} text-white text-xs font-bold shadow-sm`}>
                      {getInitials(t.user?.name || "T")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-black dark:text-white">{t.user?.name || "—"}</p>
                      <p className="text-xs text-body dark:text-bodydark2">{(t.skills || []).slice(0,2).join(", ") || "—"}</p>
                    </div>
                    <span className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${t.isApproved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                      {t.isApproved ? "Active" : "Pending"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
