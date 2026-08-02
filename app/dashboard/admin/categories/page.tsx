"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Tags, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

// Mock Categories
const initialCategories = [
  { id: "CAT-1", name: "Plumbing", description: "Water, pipes, and leak repairs", serviceCount: 12 },
  { id: "CAT-2", name: "Electrical", description: "Wiring, fixtures, and panels", serviceCount: 8 },
  { id: "CAT-3", name: "Appliance Repair", description: "AC, Fridge, and Washing Machines", serviceCount: 15 },
  { id: "CAT-4", name: "Cleaning", description: "Deep home and office cleaning", serviceCount: 5 },
];

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description is too short"),
});
type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema)
  });

  const openCreateModal = () => {
    setModalMode("CREATE");
    reset({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setModalMode("EDIT");
    setEditingId(category.id);
    reset({ name: category.name, description: category.description });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category? This cannot be undone.")) {
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success("Category deleted.");
    }
  };

  const onSubmit = (data: CategoryFormValues) => {
    if (modalMode === "CREATE") {
      const newCat = {
        id: `CAT-${Math.floor(Math.random() * 1000)}`,
        name: data.name,
        description: data.description,
        serviceCount: 0
      };
      setCategories([...categories, newCat]);
      toast.success("Category created successfully!");
    } else {
      setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...data } : c));
      toast.success("Category updated successfully!");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">Categories</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage service categories and track their usage.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-[#008cff] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#0070cc] transition-colors shadow-lg shadow-[#008cff]/20"
        >
          <Plus size={18} /> New Category
        </button>
      </div>

      {/* List */}
      <div className="bg-[#0f1535] border border-white/10 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#070c29] border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Category Details</th>
                <th className="px-6 py-4 text-center">Active Services</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{category.name}</div>
                    <div className="text-sm text-slate-400 mt-0.5">{category.description}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-1 rounded-full text-xs font-bold bg-[#181f4a] text-[#008cff] border border-[#008cff]/20">
                      {category.serviceCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(category)}
                        className="p-2 text-slate-400 hover:text-[#008cff] hover:bg-[#008cff]/10 rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4 border border-white/10">
                      <Tags className="text-slate-400" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-white">No categories found</h3>
                    <p className="text-slate-400 mt-1">Get started by creating a new category.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070c29]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f1535] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white font-heading">
                {modalMode === "CREATE" ? "Create Category" : "Edit Category"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              
              <div className="space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Category Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="e.g. Plumbing"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#008cff] focus:border-[#008cff] transition-all text-white bg-[#181f4a] placeholder:text-slate-500"
                  />
                  {errors.name && <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Description</label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Briefly describe this category..."
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#008cff] focus:border-[#008cff] transition-all text-white bg-[#181f4a] placeholder:text-slate-500 resize-none"
                  />
                  {errors.description && <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.description.message}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-[#008cff] hover:bg-[#0070cc] transition-colors shadow-lg shadow-[#008cff]/20"
                >
                  {modalMode === "CREATE" ? "Create" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
