"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Wrench, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

// Mock Services matching the backend schema and seed
const initialServices = [
  { id: "SRV-1", name: "Basic Leak Repair", description: "Fixing minor pipe leaks and dripping faucets quickly.", basePrice: 50.00, category: "Plumbing", technician: "Bob Technician" },
  { id: "SRV-2", name: "Circuit Breaker Replacement", description: "Safe replacement of faulty electrical breakers.", basePrice: 85.00, category: "Electrical works", technician: "Bob Technician" },
  { id: "SRV-3", name: "Deep Carpet Cleaning", description: "Professional steam cleaning for living room and bedroom carpets.", basePrice: 120.00, category: "Cleaning", technician: "Bob Technician" },
];

const mockCategories = ["Plumbing", "Electrical works", "Cleaning", "Painting", "Appliance Repair", "Carpentry", "Assembling", "Landscaping", "General Maintenance"];
const mockTechnicians = ["Bob Technician"];

const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description is too short"),
  basePrice: z.coerce.number().min(1, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  technician: z.string().min(1, "Technician is required"),
});
type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function AdminServicesPage() {
  const [services, setServices] = useState(initialServices);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema)
  });

  const openCreateModal = () => {
    setModalMode("CREATE");
    reset({ name: "", description: "", basePrice: 0, category: "", technician: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (service: any) => {
    setModalMode("EDIT");
    setEditingId(service.id);
    reset({ 
      name: service.name, 
      description: service.description,
      basePrice: service.basePrice,
      category: service.category,
      technician: service.technician
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service? This cannot be undone.")) {
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success("Service deleted.");
    }
  };

  const onSubmit = (data: ServiceFormValues) => {
    if (modalMode === "CREATE") {
      const newSrv = {
        id: `SRV-${Math.floor(Math.random() * 1000)}`,
        ...data
      };
      setServices([...services, newSrv]);
      toast.success("Service created successfully!");
    } else {
      setServices(prev => prev.map(s => s.id === editingId ? { ...s, ...data } : s));
      toast.success("Service updated successfully!");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">Service Management</h1>
          <p className="text-slate-400 mt-1 text-sm">Create, edit, and manage services offered by technicians.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-[#008cff] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#0070cc] transition-colors shadow-lg shadow-[#008cff]/20"
        >
          <Plus size={18} /> New Service
        </button>
      </div>

      {/* List */}
      <div className="bg-[#0f1535] border border-white/10 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#070c29] border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{service.name}</div>
                    <div className="text-sm text-slate-400 truncate max-w-[200px] mt-0.5">{service.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#181f4a] text-slate-300 border border-white/10">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-300">{service.technician}</div>
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    ${service.basePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(service)}
                        className="p-2 text-slate-400 hover:text-[#008cff] hover:bg-[#008cff]/10 rounded-lg transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {services.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4 border border-white/10">
                      <Wrench className="text-slate-400" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-white">No services found</h3>
                    <p className="text-slate-400 mt-1 max-w-sm mx-auto">Get started by creating a new service offering.</p>
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
          <div className="bg-[#0f1535] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white font-heading">
                {modalMode === "CREATE" ? "Create New Service" : "Edit Service"}
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
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Service Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="e.g. Basic Leak Repair"
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
                    placeholder="Describe the service..."
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#008cff] focus:border-[#008cff] transition-all text-white bg-[#181f4a] placeholder:text-slate-500 resize-none"
                  />
                  {errors.description && <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Category</label>
                    <select
                      {...register("category")}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#008cff] focus:border-[#008cff] transition-all text-white bg-[#181f4a]"
                    >
                      <option value="">Select Category</option>
                      {mockCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.category.message}</p>}
                  </div>

                  {/* Base Price */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Base Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("basePrice")}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#008cff] focus:border-[#008cff] transition-all text-white bg-[#181f4a] placeholder:text-slate-500"
                    />
                    {errors.basePrice && <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.basePrice.message}</p>}
                  </div>
                </div>

                {/* Technician */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Assigned Technician</label>
                  <select
                    {...register("technician")}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#008cff] focus:border-[#008cff] transition-all text-white bg-[#181f4a]"
                  >
                    <option value="">Assign Technician</option>
                    {mockTechnicians.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                  {errors.technician && <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.technician.message}</p>}
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
                  {modalMode === "CREATE" ? "Create Service" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
