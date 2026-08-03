"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore, getCookie } from "@/stores/useAuthStore";
import toast from "react-hot-toast";

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    experienceYears: "",
    pricingRate: ""
  });

  const fetchProfile = async () => {
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    try {
      const token = getCookie("accessToken");
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : [],
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/apply-technician`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Application submitted! Pending admin approval.");
        fetchProfile(); // Refresh to show pending status
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const hasPendingApplication = profile?.technicianProfile && !profile.technicianProfile.isApproved;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1 text-black dark:text-white">Customer Dashboard</h1>
        <p className="text-body dark:text-bodydark2">Welcome back, {user?.name || "Customer"}!</p>
      </div>

      <div className="p-6 bg-white dark:bg-boxdark rounded-sm shadow-default border border-stroke dark:border-strokedark">
        <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">My Bookings</h2>
        <p className="text-body dark:text-bodydark2">You have no upcoming bookings.</p>
      </div>

      <div className="p-6 bg-white dark:bg-boxdark rounded-sm shadow-default border border-stroke dark:border-strokedark">
        <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Join as a Technician</h2>
        
        {hasPendingApplication ? (
          <div className="bg-warning/20 border border-warning rounded-md p-4 text-warning">
            <strong>Application Received!</strong> Your application to become a technician is currently under review by an administrator. You will gain access to the Technician Dashboard once approved.
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <p className="text-sm text-body dark:text-bodydark2 mb-4">Want to offer your services on FixItNow? Apply below!</p>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Describe your expertise"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary min-h-[100px]"
                  required
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Skills (comma separated)</label>
                  <input
                    name="skills"
                    type="text"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. Plumbing, Electrical"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">Experience (Years)</label>
                    <input
                      name="experienceYears"
                      type="number"
                      min="0"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">Hourly Rate ($)</label>
                    <input
                      name="pricingRate"
                      type="number"
                      min="0"
                      value={formData.pricingRate}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={applying}
              className="flex w-full sm:w-auto justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:bg-opacity-50"
            >
              {applying ? "Submitting..." : "Apply to be Technician"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
