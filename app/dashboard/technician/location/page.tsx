"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";
import { FiMapPin, FiSave, FiLoader, FiPlus, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function TechnicianLocationPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [availableLocations, setAvailableLocations] = useState<{ id: string; name: string }[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProfileAndLocations = async () => {
      try {
        const token = getCookie("accessToken");
        
        // Fetch Profile
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success && data.data?.technicianProfile) {
          const profile = data.data.technicianProfile;
          if (profile.locations && Array.isArray(profile.locations)) {
            setSelectedLocations(profile.locations);
          }
        }

        // Fetch Locations
        const locRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const locData = await locRes.json();
        if (locData.success) {
          setAvailableLocations(locData.data);
        }
      } catch (err) {
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndLocations();
  }, []);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;
    
    if (selectedLocations.includes(selectedLocation)) {
      toast.error("Location already added");
      return;
    }

    setSelectedLocations([...selectedLocations, selectedLocation]);
    setSelectedLocation("");
    setDropdownOpen(false);
  };

  const removeLocation = (locationToRemove: string) => {
    setSelectedLocations(selectedLocations.filter(loc => loc !== locationToRemove));
  };

  const handleSave = async () => {
    if (selectedLocations.length === 0) {
      toast.error("Please add at least one location.");
      return;
    }
    
    setSaving(true);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/technicians/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ locations: selectedLocations }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Locations updated successfully!");
      } else {
        toast.error(data.message || "Failed to update locations.");
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
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative rounded-2xl bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl border border-white/20 dark:bg-boxdark/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:border-strokedark/50">
        {/* Decorative background blur */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/20" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/20" />
        </div>
        
        <div className="relative mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30">
            <FiMapPin className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">Service Locations</h2>
            <p className="text-sm text-body dark:text-bodydark2">Set the primary operating areas where you accept jobs.</p>
          </div>
        </div>

        <div className="relative space-y-8">
          <form onSubmit={handleAddLocation} className="flex gap-4">
            <div className="relative flex-1 group">
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full flex items-center justify-between cursor-pointer rounded-xl border ${dropdownOpen ? 'border-blue-500 bg-white ring-4 ring-blue-500/10' : 'border-gray-200 bg-white/50'} px-5 py-3.5 text-sm font-medium text-gray-700 outline-none transition-all dark:border-strokedark dark:bg-meta-4/30 dark:text-white`}
              >
                <span className={selectedLocation ? "text-gray-800 dark:text-white" : "text-gray-400"}>
                  {selectedLocation || "Select a location..."}
                </span>
                <svg className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-blue-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white/90 p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-strokedark dark:bg-boxdark/95 custom-scrollbar">
                    {availableLocations.length === 0 ? (
                      <div className="p-3 text-center text-sm text-gray-500">No locations available</div>
                    ) : (
                      availableLocations.map(loc => (
                        <div
                          key={loc.id}
                          onClick={() => {
                            setSelectedLocation(loc.name);
                            setDropdownOpen(false);
                          }}
                          className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${selectedLocation === loc.name ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-meta-4 dark:hover:text-blue-400'}`}
                        >
                          {loc.name}
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
            <button
              type="submit"
              className="group flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-7 font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
            >
              <FiPlus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Add
            </button>
          </form>

          <div className="min-h-[120px] rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 dark:border-strokedark dark:bg-meta-4/20">
            {selectedLocations.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <FiMapPin className="mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">No locations added yet</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {selectedLocations.map((loc, index) => (
                  <div
                    key={index}
                    className="group relative flex items-center gap-2 overflow-hidden rounded-lg border border-blue-100 bg-white py-2 pl-4 pr-10 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-blue-500/20 dark:bg-boxdark dark:hover:border-blue-500/40"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-500/10 dark:to-cyan-500/10" />
                    <span className="relative z-10 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {loc}
                    </span>
                    <button
                      onClick={() => removeLocation(loc)}
                      className="absolute right-2 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-strokedark">
            <button
              onClick={handleSave}
              disabled={saving || selectedLocations.length === 0}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 p-3.5 font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-2">
                {saving ? <FiLoader className="h-5 w-5 animate-spin" /> : <FiSave className="h-5 w-5" />}
                {saving ? "Saving Locations..." : "Save Locations"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
