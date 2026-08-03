"use client";
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
      <p>Welcome back, {user?.name || "Customer"}!</p>
      <div className="mt-6 p-6 bg-white dark:bg-boxdark rounded-lg shadow-sm border border-stroke dark:border-strokedark">
        <h2 className="text-lg font-semibold mb-2">My Bookings</h2>
        <p className="text-body dark:text-bodydark2">You have no upcoming bookings.</p>
      </div>
    </div>
  );
}
