"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";
import { FiBriefcase, FiClock, FiDollarSign, FiCalendar, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";

interface Booking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  status: "REQUESTED" | "ACCEPTED" | "PAID" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DECLINED";
  date: string;
  price: number;
  customer?: {
    user: {
      name: string;
      email: string;
    };
  };
  service?: {
    name: string;
  };
}

export default function TechnicianDashboard() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = getCookie("accessToken");
        // Using standard bookings endpoint assuming it filters by auth token for technician
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success && Array.isArray(data.data)) {
          setBookings(data.data);
        } else if (res.status === 404 || !data.success) {
          // Fallback if the endpoint is different
          const fallbackRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/technicians/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const fallbackData = await fallbackRes.json();
          if (fallbackData.success) setBookings(fallbackData.data);
        }
      } catch (error) {
        console.error("Failed to fetch technician bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    let pendingRequests = 0;
    let upcomingJobs = 0;
    let totalEarnings = 0;

    bookings.forEach(b => {
      if (b.status === "REQUESTED") pendingRequests++;
      if (["ACCEPTED", "PAID", "IN_PROGRESS"].includes(b.status)) upcomingJobs++;
      if (b.status === "COMPLETED") totalEarnings += (b.price || 0);
    });

    return { pendingRequests, upcomingJobs, totalEarnings };
  }, [bookings]);

  const recentBookings = bookings.slice(0, 5); // Show latest 5

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3C50E0] to-[#6577F3] p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user?.name || "Technician"}! 👋</h2>
            <p className="mt-2 text-indigo-100 max-w-lg text-sm leading-relaxed">
              Here is what's happening with your service requests today. Check your pending requests and upcoming jobs to stay on top of your schedule.
            </p>
          </div>
          <Link
            href="/dashboard/technician/profile"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
          >
            Update Profile
          </Link>
        </div>
        
        {/* Decorative background shapes */}
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark group hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
            <FiBriefcase className="h-6 w-6" />
          </div>
          <h4 className="text-3xl font-bold text-black dark:text-white">{stats.upcomingJobs}</h4>
          <span className="text-sm font-medium text-body dark:text-bodydark2">Upcoming & Active Jobs</span>
        </div>

        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark group hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <FiDollarSign className="h-6 w-6" />
          </div>
          <h4 className="text-3xl font-bold text-black dark:text-white">${stats.totalEarnings.toFixed(2)}</h4>
          <span className="text-sm font-medium text-body dark:text-bodydark2">Total Earnings</span>
        </div>

        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark group hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 mb-4 group-hover:scale-110 transition-transform">
            <FiClock className="h-6 w-6" />
          </div>
          <h4 className="text-3xl font-bold text-black dark:text-white">{stats.pendingRequests}</h4>
          <span className="text-sm font-medium text-body dark:text-bodydark2">Pending Requests</span>
        </div>
      </div>

      {/* ── Recent Bookings ── */}
      <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
        <div className="border-b border-stroke px-6 py-5 dark:border-strokedark flex justify-between items-center">
          <h3 className="font-semibold text-black dark:text-white">Recent Booking Activity</h3>
          <Link href="/dashboard/technician/bookings" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View all <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="p-4">
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between rounded-xl border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-boxdark shadow-sm">
                      <FiCalendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-black dark:text-white">
                        {booking.service?.name || "Service Booking"}
                      </h5>
                      <p className="text-sm text-body dark:text-bodydark2">
                        Client: {booking.customer?.user?.name || "Unknown"} • {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black dark:text-white">${booking.price}</p>
                    <span className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs font-semibold mt-1 bg-primary/10 text-primary">
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-meta-4 mb-4">
                <FiCheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-black dark:text-white">No Recent Bookings</h4>
              <p className="text-sm text-body dark:text-bodydark2 mt-1 max-w-sm">
                You don't have any bookings yet. Keep your profile updated to attract more customers!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
