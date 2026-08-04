"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";
import { FiUser, FiMapPin, FiClock, FiDollarSign, FiSave, FiLoader, FiBriefcase } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function TechnicianProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    experienceYears: 0,
    pricingRate: 0,
    location: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getCookie("accessToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success && data.data?.technicianProfile) {
          const profile = data.data.technicianProfile;
          setFormData({
            bio: profile.bio || "",
            skills: profile.skills?.join(", ") || "",
            experienceYears: profile.experienceYears || 0,
            pricingRate: profile.pricingRate || 0,
            location: profile.location || "",
          });
        }
      } catch (err) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "experienceYears" || name === "pricingRate" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      };

      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/technicians/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <FiLoader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-stroke dark:bg-boxdark dark:border-strokedark">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <FiUser className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">Professional Profile</h2>
            <p className="text-sm text-body dark:text-bodydark2">Update your information to attract more clients.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              Bio / About Me
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell clients about yourself, your work ethic, and why they should hire you..."
              className="w-full rounded-xl border border-stroke bg-transparent px-4 py-3 text-sm outline-none transition focus:border-blue-600 active:border-blue-600 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              Skills (Comma separated)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <FiBriefcase className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Plumbing, Pipe repair, Water heater installation"
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-600 active:border-blue-600 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
                Years of Experience
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <FiClock className="h-4 w-4" />
                </span>
                <input
                  type="number"
                  name="experienceYears"
                  min="0"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-600 active:border-blue-600 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
                Hourly Pricing Rate ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <FiDollarSign className="h-4 w-4" />
                </span>
                <input
                  type="number"
                  name="pricingRate"
                  min="0"
                  step="0.01"
                  value={formData.pricingRate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-600 active:border-blue-600 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
              Location / Service Area
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <FiMapPin className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New York City, Brooklyn, Queens"
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-600 active:border-blue-600 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stroke dark:border-strokedark">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {saving ? <FiLoader className="h-5 w-5 animate-spin" /> : <FiSave className="h-5 w-5" />}
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
