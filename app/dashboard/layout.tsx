import DashboardSidebar from "@/components/DashboardSidebar";
import React from "react";
import { Bell, Search, Settings, Menu } from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#181f4a] font-sans selection:bg-[#008cff] selection:text-white">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-[76px] shrink-0 bg-[#0b1120] border-b border-white/[0.05] flex items-center justify-between px-6 sticky top-0 z-40">
          
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden text-slate-400 hover:text-white transition-colors">
              <Menu size={24} strokeWidth={1.5} />
            </button>
            
            {/* Modern Search Bar matching the image */}
            <div className="hidden md:flex items-center gap-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] rounded-[8px] px-3.5 py-2.5 w-[340px] transition-colors">
              <Search size={18} strokeWidth={1.5} className="text-slate-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-[14.5px] text-white placeholder:text-slate-500 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={22} strokeWidth={1.5} />
              <span className="absolute top-0 right-0 w-[9px] h-[9px] bg-[#0ea5e9] rounded-full ring-2 ring-[#0b1120]"></span>
            </button>
            
            {/* Settings */}
            <button className="text-slate-400 hover:text-white transition-colors">
              <Settings size={22} strokeWidth={1.5} />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3.5 ml-1 cursor-pointer group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-[1.5px] border-white/10 group-hover:border-[#0ea5e9] transition-colors">
                <Image 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop" 
                  alt="Admin" 
                  fill 
                  className="object-cover" 
                  sizes="40px"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[14px] font-semibold text-white leading-snug">Platform Admin</span>
                <span className="text-[12px] text-slate-400 leading-snug">admin@fixitnow.com</span>
              </div>
            </div>
          </div>

        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 w-full overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
