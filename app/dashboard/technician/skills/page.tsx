"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";
import { FiBriefcase, FiPlus, FiX, FiSave, FiLoader } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function TechnicianSkillsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [skills, setSkills] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          setSkills(profile.skills || []);
        }

        // Fetch categories
        const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.data);
          if (catData.data.length > 0) {
            setSelectedCategory(catData.data[0].name);
          }
        }
      } catch (err) {
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error("Please select a category.");
      return;
    }
    if (skills.includes(selectedCategory)) {
      toast.error("Skill already added!");
      return;
    }
    setSkills(prev => [...prev, selectedCategory]);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/technicians/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ skills }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Skills updated successfully!");
      } else {
        toast.error(data.message || "Failed to update skills.");
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
        <FiLoader className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative rounded-2xl bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl border border-white/20 dark:bg-boxdark/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:border-strokedark/50">
        {/* Decorative background blur */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/20" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/20" />
        </div>
        
        <div className="relative mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30">
            <FiBriefcase className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">My Skills</h2>
            <p className="text-sm text-body dark:text-bodydark2">Manage your specialized skills to match with the right jobs.</p>
          </div>
        </div>

        <div className="relative space-y-8">
          <form onSubmit={handleAddSkill} className="flex gap-4">
            <div className="relative flex-1 group">
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full flex items-center justify-between cursor-pointer rounded-xl border ${dropdownOpen ? 'border-purple-500 bg-white ring-4 ring-purple-500/10' : 'border-gray-200 bg-white/50'} px-5 py-3.5 text-sm font-medium text-gray-700 outline-none transition-all dark:border-strokedark dark:bg-meta-4/30 dark:text-white`}
              >
                <span className={selectedCategory ? "text-gray-800 dark:text-white" : "text-gray-400"}>
                  {selectedCategory || "Select a category..."}
                </span>
                <svg className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-purple-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white/90 p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-strokedark dark:bg-boxdark/95 custom-scrollbar">
                    {categories.length === 0 ? (
                      <div className="p-3 text-center text-sm text-gray-500">No categories found</div>
                    ) : (
                      categories.map(cat => (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.name);
                            setDropdownOpen(false);
                          }}
                          className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${selectedCategory === cat.name ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-meta-4 dark:hover:text-purple-400'}`}
                        >
                          {cat.name}
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
            <button
              type="submit"
              className="group flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-7 font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
            >
              <FiPlus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Add Skill
            </button>
          </form>

          <div>
            <h3 className="mb-3 text-sm font-medium text-black dark:text-white">Added Skills ({skills.length})</h3>
            
            {skills.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-strokedark p-10 text-center bg-gray-50/50 dark:bg-meta-4/10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-meta-4 mb-3">
                  <FiBriefcase className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No skills added yet.</p>
                <p className="text-xs text-gray-400 mt-1">Select from the dropdown above to add your expertise.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                  <div key={skill} className="group relative flex items-center gap-2 overflow-hidden rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm transition-all hover:border-purple-300 hover:shadow-md dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:border-purple-500/50">
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <span className="relative z-10">{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="relative z-10 ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-200/50 text-purple-500 hover:bg-purple-600 hover:text-white dark:bg-purple-500/30 dark:text-purple-300 dark:hover:bg-purple-500 dark:hover:text-white transition-all duration-200"
                      title="Remove skill"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-8 mt-4 border-t border-gray-100 dark:border-strokedark">
            <button
              onClick={handleSave}
              disabled={saving}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-3.5 font-bold text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-70"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-2">
                {saving ? <FiLoader className="h-5 w-5 animate-spin" /> : <FiSave className="h-5 w-5" />}
                {saving ? "Saving Skills..." : "Save Skills"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
