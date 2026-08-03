"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDollarSign, FiList, FiFilter, FiX } from "react-icons/fi";
import { getCookie } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: string | number;
  categoryId: string;
  category?: {
    name: string;
  };
  technician?: {
    user: {
      name: string;
    };
  };
}

interface Category {
  id: string;
  name: string;
}

const serviceSchema = z.object({
  name: z.string().min(3, "Name is required"),
  description: z.string().min(10, "Description is required"),
  basePrice: z.coerce.number().min(1, "Base price must be greater than 0"),
  categoryId: z.string().uuid("Please select a valid category"),
});
type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema)
  });

  const fetchData = async () => {
    try {
      const [svcRes, catRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      ]);
      const svcData = await svcRes.json();
      const catData = await catRes.json();
      
      if (svcData.success) setServices(svcData.data);
      if (catData.success) setCategories(catData.data);
    } catch (error) {
      toast.error("Failed to load services data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    reset({ name: "", description: "", basePrice: 0, categoryId: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    reset({
      name: service.name,
      description: service.description,
      basePrice: Number(service.basePrice),
      categoryId: service.categoryId,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    reset();
  };

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    const token = getCookie("accessToken");
    const method = editingService ? "PATCH" : "POST";
    const url = editingService 
      ? `${process.env.NEXT_PUBLIC_API_URL}/services/${editingService.id}` 
      : `${process.env.NEXT_PUBLIC_API_URL}/services`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        toast.success(editingService ? "Service updated!" : "Service created!");
        closeModal();
        fetchData();
      } else {
        toast.error(result.message || "Failed to save service");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service permanently?")) return;
    setDeletingId(id);
    const token = getCookie("accessToken");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Service deleted");
        setServices(prev => prev.filter(s => s.id !== id));
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = 
        (s.name || "").toLowerCase().includes(search.toLowerCase()) || 
        (s.technician?.user?.name || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || s.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [services, search, categoryFilter]);

  return (
    <div className="space-y-8 relative animate-in fade-in duration-500">
      {/* ── Premium Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#064E3B] p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Platform Services
              <span className="flex h-7 items-center justify-center rounded-full bg-emerald-500/30 px-3 text-xs font-bold text-emerald-200 border border-emerald-400/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                {services.length} Listed
              </span>
            </h2>
            <p className="mt-2 text-emerald-100/80 max-w-lg text-sm leading-relaxed">
              Manage and oversee all service offerings. Set base prices, assign categories, and track the technicians providing them.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-56 rounded-xl border border-white/10 bg-black/20 py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/40 outline-none backdrop-blur-md transition-all focus:border-emerald-400/50 focus:bg-black/40 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>
            
            <div className="relative group">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto appearance-none rounded-xl border border-white/10 bg-black/20 py-2.5 pl-11 pr-10 text-sm font-semibold text-white outline-none backdrop-blur-md transition-all focus:border-emerald-400/50 focus:bg-black/40 focus:ring-2 focus:ring-emerald-400/20 [&>option]:text-black"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95"
            >
              <FiPlus className="w-4 h-4" />
              Add Service
            </button>
          </div>
        </div>
        
        {/* Decorative background shapes */}
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-[80px]" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-teal-400/20 blur-[80px]" />
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left dark:bg-meta-4 border-b border-stroke dark:border-strokedark">
                <th className="min-w-[250px] py-4 px-6 font-semibold text-black dark:text-white text-sm">Service Details</th>
                <th className="min-w-[150px] py-4 px-6 font-semibold text-black dark:text-white text-sm">Category</th>
                <th className="min-w-[180px] py-4 px-6 font-semibold text-black dark:text-white text-sm">Technician</th>
                <th className="min-w-[120px] py-4 px-6 font-semibold text-black dark:text-white text-sm">Base Price</th>
                <th className="py-4 px-6 font-semibold text-black dark:text-white text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-4 px-6"><div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-meta-4 mb-2"/><div className="h-3 w-64 animate-pulse rounded bg-gray-100 dark:bg-meta-4/50"/></td>
                    <td className="py-4 px-6"><div className="h-6 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-meta-4"/></td>
                    <td className="py-4 px-6"><div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-meta-4"/></td>
                    <td className="py-4 px-6"><div className="h-6 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-meta-4"/></td>
                    <td className="py-4 px-6"><div className="h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-meta-4 float-right"/></td>
                  </tr>
                ))
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-meta-4 mb-4">
                        <FiList className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="text-base font-semibold text-black dark:text-white">No Services Found</h4>
                      <p className="mt-1 text-sm text-body dark:text-bodydark2">Try adjusting your filters or create a new service.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service, idx) => (
                  <tr 
                    key={service.id} 
                    className="group border-b border-stroke dark:border-strokedark hover:bg-emerald-50/50 dark:hover:bg-meta-4/20 transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in"
                    style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
                  >
                    <td className="py-5 px-6">
                      <h5 className="font-bold text-black dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {service.name}
                      </h5>
                      <p className="text-xs text-body dark:text-bodydark2 line-clamp-1">{service.description}</p>
                    </td>
                    <td className="py-5 px-6">
                      <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-600 border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 shadow-sm">
                        {service.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center text-[10px] text-white shadow-sm">
                          {service.technician?.user?.name?.charAt(0) || "?"}
                        </div>
                        {service.technician?.user?.name || "Unassigned"}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit border border-emerald-100 dark:border-emerald-500/20">
                        <FiDollarSign className="w-4 h-4" /> {service.basePrice}
                      </p>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => openEditModal(service)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-meta-4 dark:text-bodydark dark:hover:bg-emerald-500/20 dark:hover:text-emerald-400 transition"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id)}
                          disabled={deletingId === service.id}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600 dark:bg-meta-4 dark:text-bodydark dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition disabled:opacity-50"
                        >
                          {deletingId === service.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
                          ) : (
                            <FiTrash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 dark:bg-boxdark/95 dark:ring-white/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between border-b border-stroke/50 px-8 py-5 dark:border-strokedark">
              <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                {editingService ? <FiEdit2 className="text-emerald-500" /> : <FiPlus className="text-emerald-500" />}
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <button onClick={closeModal} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black dark:bg-meta-4 dark:hover:bg-meta-4/80 dark:hover:text-white transition-colors">
                <FiX className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">Service Name</label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="e.g. Pipe Leak Repair"
                  className={`w-full rounded-xl border bg-white/50 px-5 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:bg-black/20 ${errors.name ? "border-meta-1 focus:border-meta-1 focus:ring-meta-1/10" : "border-stroke dark:border-strokedark"}`}
                />
                {errors.name && <p className="mt-1.5 text-xs font-medium text-meta-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">Category</label>
                <select
                  {...register("categoryId")}
                  className={`w-full appearance-none rounded-xl border bg-white/50 px-5 py-3.5 text-sm font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:bg-black/20 ${errors.categoryId ? "border-meta-1 focus:border-meta-1 focus:ring-meta-1/10" : "border-stroke dark:border-strokedark"}`}
                >
                  <option value="">Select a category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1.5 text-xs font-medium text-meta-1">{errors.categoryId.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">Base Price ($)</label>
                <input
                  {...register("basePrice")}
                  type="number"
                  placeholder="0.00"
                  className={`w-full rounded-xl border bg-white/50 px-5 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:bg-black/20 ${errors.basePrice ? "border-meta-1 focus:border-meta-1 focus:ring-meta-1/10" : "border-stroke dark:border-strokedark"}`}
                />
                {errors.basePrice && <p className="mt-1.5 text-xs font-medium text-meta-1">{errors.basePrice.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Detailed description..."
                  className={`w-full rounded-xl border bg-white/50 px-5 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:bg-black/20 ${errors.description ? "border-meta-1 focus:border-meta-1 focus:ring-meta-1/10" : "border-stroke dark:border-strokedark"}`}
                />
                {errors.description && <p className="mt-1.5 text-xs font-medium text-meta-1">{errors.description.message}</p>}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stroke/50 dark:border-strokedark">
                <button type="button" onClick={closeModal} className="rounded-xl px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-meta-4 transition">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 transition-all active:scale-95">
                  {isSubmitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : (editingService ? "Save Changes" : "Create Service")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
