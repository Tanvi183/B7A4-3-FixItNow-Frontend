"use client";

import React, { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiSearch, FiX } from "react-icons/fi";
import { getCookie } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
}

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});
type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema)
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      toast.error("An error occurred while fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    reset({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    reset({ name: category.name, description: category.description });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    const token = getCookie("accessToken");
    const method = editingCategory ? "PATCH" : "POST";
    const url = editingCategory 
      ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${editingCategory.id}` 
      : `${process.env.NEXT_PUBLIC_API_URL}/categories`;

    try {
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
        toast.success(editingCategory ? "Category updated!" : "Category created!");
        closeModal();
        fetchCategories(); // Refresh list
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
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    setDeletingId(id);
    const token = getCookie("accessToken");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Category deleted");
        setCategories(prev => prev.filter(c => c.id !== id));
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = categories.filter(c => 
    (c.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 relative animate-in fade-in duration-500">
      {/* ── Premium Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e2340] via-[#2A3464] to-[#1e2340] p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Service Categories
              <span className="flex h-7 items-center justify-center rounded-full bg-indigo-500/30 px-3 text-xs font-bold text-indigo-200 border border-indigo-400/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                {categories.length} Total
              </span>
            </h2>
            <p className="mt-2 text-indigo-200/80 max-w-lg text-sm leading-relaxed">
              Organize and manage the core service offerings of your platform. Add new specializations to expand your business reach.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 rounded-xl border border-white/10 bg-black/20 py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/40 outline-none backdrop-blur-md transition-all focus:border-indigo-400/50 focus:bg-black/40 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-purple-400 transition-all active:scale-95"
            >
              <FiPlus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>
        
        {/* Decorative background shapes */}
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-[80px]" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]" />
      </div>

      {/* ── Data Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark animate-pulse">
              <div className="h-10 w-10 bg-gray-200 dark:bg-meta-4 rounded-xl mb-4" />
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-meta-4 rounded mb-2" />
              <div className="h-4 w-full bg-gray-100 dark:bg-meta-4/50 rounded mb-1" />
              <div className="h-4 w-2/3 bg-gray-100 dark:bg-meta-4/50 rounded" />
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stroke bg-white py-16 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-meta-4 mb-4">
            <FiTag className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-black dark:text-white">No Categories Found</h4>
          <p className="text-sm text-body dark:text-bodydark2 mt-1">
            {search ? "Try adjusting your search terms." : "Click 'Add Category' to create the first one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, idx) => (
            <div 
              key={category.id} 
              className="group flex flex-col rounded-2xl border border-stroke bg-white p-6 shadow-sm hover:shadow-xl dark:border-strokedark dark:bg-boxdark transition-all duration-300 hover:-translate-y-1.5 animate-in slide-in-from-bottom-4 fade-in"
              style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FiTag className="h-6 w-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => openEditModal(category)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-meta-4 dark:text-bodydark dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600 dark:bg-meta-4 dark:text-bodydark dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition disabled:opacity-50"
                  >
                    {deletingId === category.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
                    ) : (
                      <FiTrash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">{category.name}</h3>
              <p className="text-sm text-body dark:text-bodydark2 flex-1 leading-relaxed line-clamp-3">{category.description}</p>
              
              <div className="mt-6 pt-4 border-t border-stroke/50 dark:border-strokedark flex items-center justify-between">
                <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Slug</p>
                <p className="text-xs font-medium text-black dark:text-white bg-gray-50 dark:bg-meta-4 px-2.5 py-1 rounded-md border border-stroke dark:border-strokedark">
                  {category.slug}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 dark:bg-boxdark/95 dark:ring-white/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between border-b border-stroke/50 px-8 py-5 dark:border-strokedark">
              <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                {editingCategory ? <FiEdit2 className="text-indigo-500" /> : <FiPlus className="text-indigo-500" />}
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button onClick={closeModal} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black dark:bg-meta-4 dark:hover:bg-meta-4/80 dark:hover:text-white transition-colors">
                <FiX className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">Category Name</label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="e.g. Plumbing, Electrical"
                  className={`w-full rounded-xl border bg-white/50 px-5 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:bg-black/20 ${errors.name ? "border-meta-1 focus:border-meta-1 focus:ring-meta-1/10" : "border-stroke dark:border-strokedark"}`}
                />
                {errors.name && <p className="mt-1.5 text-xs font-medium text-meta-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">Description</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Describe the category..."
                  className={`w-full rounded-xl border bg-white/50 px-5 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:bg-black/20 ${errors.description ? "border-meta-1 focus:border-meta-1 focus:ring-meta-1/10" : "border-stroke dark:border-strokedark"}`}
                />
                {errors.description && <p className="mt-1.5 text-xs font-medium text-meta-1">{errors.description.message}</p>}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stroke/50 dark:border-strokedark">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-meta-4 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50 transition-all active:scale-95"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    editingCategory ? "Save Changes" : "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
