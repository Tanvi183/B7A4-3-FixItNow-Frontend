"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Camera, MapPin, Briefcase } from "lucide-react";
import { toast } from "react-hot-toast";

const profileSchema = z.object({
  bio: z.string().min(10, "Bio should be at least 10 characters").max(500),
  specialization: z.string().min(2, "Required"),
  location: z.string().min(2, "Required"),
  hourlyRate: z.coerce.number().min(5, "Minimum rate is $5"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function TechnicianProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "I am a professional electrician with over 5 years of experience in residential and commercial wiring.",
      specialization: "Electrical",
      location: "New York, NY",
      hourlyRate: 45,
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Profile updated:", data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Profile Management</h1>
        <p className="text-slate-500 mt-1 text-sm">Update your public profile, skills, and pricing.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-blue-600/10 w-full relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center relative overflow-hidden group">
              {/* Fallback avatar */}
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                <Briefcase size={32} />
              </div>
              <button className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} />
                <span className="text-[10px] mt-1 font-medium">Upload</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-16 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specialization */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">Primary Specialization</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Briefcase size={16} />
                </div>
                <input
                  {...register("specialization")}
                  className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.specialization ? "border-rose-300 bg-rose-50/30" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.specialization && <p className="text-rose-500 text-xs font-medium">{errors.specialization.message}</p>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">Location (Service Area)</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <MapPin size={16} />
                </div>
                <input
                  {...register("location")}
                  className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.location ? "border-rose-300 bg-rose-50/30" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.location && <p className="text-rose-500 text-xs font-medium">{errors.location.message}</p>}
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="space-y-2 max-w-xs">
            <label className="text-sm font-medium text-slate-700 block">Hourly Rate ($)</label>
            <input
              type="number"
              {...register("hourlyRate")}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.hourlyRate ? "border-rose-300 bg-rose-50/30" : "border-slate-200"
              }`}
            />
            {errors.hourlyRate && <p className="text-rose-500 text-xs font-medium">{errors.hourlyRate.message}</p>}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">Professional Bio</label>
            <textarea
              {...register("bio")}
              rows={4}
              className={`w-full p-4 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none ${
                errors.bio ? "border-rose-300 bg-rose-50/30" : "border-slate-200"
              }`}
            />
            {errors.bio && <p className="text-rose-500 text-xs font-medium">{errors.bio.message}</p>}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 text-white font-medium py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
