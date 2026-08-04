"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { FiLoader } from "react-icons/fi";

export default function DashboardRoot() {
  const { user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.replace("/login");
    } else {
      // Redirect based on role
      const roleStr = String(user.role).toLowerCase();
      if (roleStr === "admin") {
        router.replace("/dashboard/admin");
      } else if (roleStr === "technician") {
        router.replace("/dashboard/technician");
      } else {
        router.replace("/dashboard/customer");
      }
    }
  }, [user, isHydrated, router]);

  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
        <FiLoader className="h-8 w-8 animate-spin text-[#3C50E0]" />
        <p className="text-sm font-medium animate-pulse">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
