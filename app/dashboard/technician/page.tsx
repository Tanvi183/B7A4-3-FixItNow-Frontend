"use client";
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function TechnicianDashboard() {
  const { user } = useAuthStore();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Technician Dashboard</h1>
      <p>Welcome back, {user?.name || "Technician"}!</p>
      <div className="mt-6 p-6 bg-white dark:bg-boxdark rounded-lg shadow-sm border border-stroke dark:border-strokedark">
        <h2 className="text-lg font-semibold mb-2">My Jobs</h2>
        <p className="text-body dark:text-bodydark2">You have no active jobs at the moment.</p>
      </div>
    </div>
  );
}
