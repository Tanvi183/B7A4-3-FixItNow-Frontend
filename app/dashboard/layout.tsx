import DashboardSidebar from "@/components/DashboardSidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <main className="flex-1 w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
