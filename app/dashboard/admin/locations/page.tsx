"use client";

import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { getCookie } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Location {
  id: string;
  name: string;
  createdAt: string;
}

const locationSchema = z.object({
  name: z.string().min(2, "Location name must be at least 2 characters"),
});
type LocationFormValues = z.infer<typeof locationSchema>;

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema)
  });

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`);
      const data = await res.json();
      if (data.success) {
        setLocations(data.data);
      } else {
        toast.error("Failed to load locations");
      }
    } catch (error) {
      toast.error("An error occurred while fetching locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const openCreateModal = () => {
    reset({ name: "" });
    setIsModalOpen(true);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = async (data: LocationFormValues) => {
    setIsSubmitting(true);
    try {
      const token = getCookie("accessToken");
      const url = `${process.env.NEXT_PUBLIC_API_URL}/locations`;
      const method = "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Location created successfully");
        fetchLocations();
        closeAndResetModal();
      } else {
        toast.error(result.message || "Operation failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    
    setDeletingId(id);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Location deleted successfully");
        fetchLocations();
      } else {
        toast.error(result.message || "Failed to delete location");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Service Locations</h2>
          <p className="text-sm text-body dark:text-bodydark2 mt-1">
            Manage the locations available for technicians to operate in.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90 active:scale-95"
        >
          <FiPlus className="h-5 w-5" />
          Add Location
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-body dark:text-bodydark2" />
        <input
          type="text"
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-stroke bg-white py-2 pl-10 pr-4 outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
        />
      </div>

      {/* Locations Grid */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredLocations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stroke bg-white p-8 text-center dark:border-strokedark dark:bg-boxdark">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-meta-4 mb-4">
            <FiMapPin className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-black dark:text-white mb-1">No locations found</h3>
          <p className="text-body dark:text-bodydark2 text-sm">
            {search ? "No locations match your search." : "Get started by creating your first service location."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredLocations.map((loc) => (
            <div key={loc.id} className="rounded-xl border border-stroke bg-white p-5 shadow-sm transition hover:shadow-md dark:border-strokedark dark:bg-boxdark">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                    <FiMapPin className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-black dark:text-white line-clamp-1" title={loc.name}>
                    {loc.name}
                  </h3>
                </div>
                
                <button
                  onClick={() => handleDelete(loc.id)}
                  disabled={deletingId === loc.id}
                  className="rounded p-1.5 text-danger hover:bg-danger/10 transition-colors disabled:opacity-50"
                  title="Delete Location"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-boxdark border border-stroke dark:border-strokedark overflow-hidden scale-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stroke p-5 dark:border-strokedark">
              <h3 className="text-lg font-bold text-black dark:text-white">
                Add New Location
              </h3>
              <button 
                onClick={closeAndResetModal}
                className="rounded-lg p-1.5 text-body hover:bg-gray-100 dark:text-bodydark2 dark:hover:bg-meta-4 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Location Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="e.g. New York, Brooklyn..."
                    className={`w-full rounded-lg border ${errors.name ? 'border-danger' : 'border-stroke'} bg-transparent px-4 py-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAndResetModal}
                  className="rounded-lg border border-stroke px-6 py-2.5 font-medium hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition-all hover:bg-opacity-90 active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : null}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
