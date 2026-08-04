"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getCookie } from "@/stores/useAuthStore";
import { FiMapPin, FiSearch, FiUsers, FiLoader, FiUser, FiCheckCircle, FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";

interface TechnicianLocation {
  id: string;
  userId: string;
  location: string | null;
  isApproved: boolean;
  user: {
    name: string;
    email: string;
  };
}

interface LocationGroup {
  location: string;
  technicians: TechnicianLocation[];
}

export default function AdminLocationsPage() {
  const [technicians, setTechnicians] = useState<TechnicianLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);

  useEffect(() => {
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
          toast.error("Failed to load technician locations");
        }
      } catch {
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchTechnicians();
  }, []);

  const locationGroups = useMemo<LocationGroup[]>(() => {
    const withLocation = technicians.filter(t => t.location?.trim());
    const groups: Record<string, TechnicianLocation[]> = {};

    withLocation.forEach(t => {
      const key = (t.location ?? "Unknown").trim();
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });

    return Object.entries(groups)
      .map(([location, techs]) => ({ location, technicians: techs }))
      .sort((a, b) => b.technicians.length - a.technicians.length);
  }, [technicians]);

  const noLocation = technicians.filter(t => !t.location?.trim());

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return locationGroups;
    const q = search.toLowerCase();
    return locationGroups.filter(
      g =>
        g.location.toLowerCase().includes(q) ||
        g.technicians.some(t => t.user.name.toLowerCase().includes(q))
    );
  }, [locationGroups, search]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <FiLoader className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Technician Locations</h1>
            <p className="mt-1 text-blue-100">Geographic overview of your technician network</p>
          </div>
          <div className="mt-4 flex gap-4 sm:mt-0">
            <div className="rounded-2xl bg-white/15 backdrop-blur px-6 py-3 text-center">
              <p className="text-2xl font-bold">{locationGroups.length}</p>
              <p className="text-xs text-blue-100 mt-0.5">Regions</p>
            </div>
            <div className="rounded-2xl bg-white/15 backdrop-blur px-6 py-3 text-center">
              <p className="text-2xl font-bold">{technicians.filter(t => t.location?.trim()).length}</p>
              <p className="text-xs text-blue-100 mt-0.5">Placed Techs</p>
            </div>
            <div className="rounded-2xl bg-white/15 backdrop-blur px-6 py-3 text-center">
              <p className="text-2xl font-bold">{noLocation.length}</p>
              <p className="text-xs text-blue-100 mt-0.5">No Location</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by location or technician name..."
          className="w-full rounded-xl border border-stroke bg-white py-3 pl-12 pr-5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-strokedark dark:bg-boxdark dark:text-white"
        />
      </div>

      {/* Location Groups */}
      {filteredGroups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stroke p-14 text-center dark:border-strokedark">
          <FiMapPin className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">No locations found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map(group => (
            <div
              key={group.location}
              className="group rounded-2xl border border-stroke bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-strokedark dark:bg-boxdark overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedLocation(
                    expandedLocation === group.location ? null : group.location
                  )
                }
                className="flex w-full items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow shadow-blue-500/30">
                    <FiMapPin className="h-5 w-5" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="truncate font-semibold text-black dark:text-white">{group.location}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{group.technicians.length} technician{group.technicians.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${group.technicians.some(t => t.isApproved) ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}>
                    <FiUsers className="h-3 w-3" />
                    {group.technicians.filter(t => t.isApproved).length} active
                  </span>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedLocation === group.location ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expandedLocation === group.location && (
                <div className="border-t border-stroke dark:border-strokedark divide-y divide-stroke dark:divide-strokedark">
                  {group.technicians.map(tech => (
                    <div key={tech.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-xs font-bold text-white">
                        {tech.user.name?.charAt(0).toUpperCase() ?? "T"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-black dark:text-white">{tech.user.name}</p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{tech.user.email}</p>
                      </div>
                      {tech.isApproved ? (
                        <FiCheckCircle className="h-4 w-4 shrink-0 text-emerald-500" title="Approved" />
                      ) : (
                        <FiXCircle className="h-4 w-4 shrink-0 text-amber-500" title="Pending" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Technicians with No Location */}
      {noLocation.length > 0 && (
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
              <FiUser className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-black dark:text-white">No Location Set</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{noLocation.length} technician{noLocation.length !== 1 ? "s" : ""} without a service area</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {noLocation.map(tech => (
              <div key={tech.id} className="flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-1.5 dark:border-orange-500/20 dark:bg-orange-500/10">
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">{tech.user.name}</span>
                {tech.isApproved ? (
                  <FiCheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <FiXCircle className="h-3.5 w-3.5 text-amber-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
