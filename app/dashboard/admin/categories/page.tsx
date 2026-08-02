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
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Category Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Create, edit, and organize service categories.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> New Category
        </button>
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Services Count</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Tags size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{category.name}</p>
                        <p className="text-xs text-slate-400">ID: {category.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {category.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {category.serviceCount} Services
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No categories found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {modalMode === "CREATE" ? "Create Category" : "Edit Category"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category Name</label>
                <input
                  {...register("name")}
                  placeholder="e.g. Plumbing"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.name ? "border-rose-300 bg-rose-50/30" : "border-slate-200"
                  }`}
                />
                {errors.name && <p className="text-rose-500 text-xs font-medium">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Briefly describe this category..."
                  className={`w-full p-4 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none ${
                    errors.description ? "border-rose-300 bg-rose-50/30" : "border-slate-200"
                  }`}
                />
                {errors.description && <p className="text-rose-500 text-xs font-medium">{errors.description.message}</p>}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
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
