"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiGrid, FiSmile, FiShoppingCart, FiCalendar, FiUser, 
  FiCopy, FiFileText, FiLayout, FiMessageCircle, FiHeadphones, FiMail,
  FiChevronDown, FiChevronUp, FiList, FiMoreHorizontal,
  FiTool, FiBriefcase, FiDollarSign, FiClock, FiStar,
  FiTag, FiCheckSquare, FiCreditCard
} from "react-icons/fi";
import { MdOutlineTableChart } from "react-icons/md";
import { useAuthStore } from "@/stores/useAuthStore";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (arg: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, sidebarExpanded, setSidebarExpanded }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>("Task");
  const { user } = useAuthStore();
  
  const role = user?.role || "CUSTOMER";

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const navItem = (
    label: string, 
    icon: React.ReactNode, 
    isNew: boolean = false, 
    hasDropdown: boolean = false, 
    subItems: string[] = [],
    route: string = "#"
  ) => {
    const isOpen = openDropdown === label;
    const isActive = pathname === route || label === "Task"; // keep Task active for demo visual
    
    return (
      <li key={label}>
        <Link
          href={route}
          onClick={(e) => {
            if (hasDropdown) {
              e.preventDefault();
              if (sidebarExpanded) {
                toggleDropdown(label);
              }
            }
          }}
          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out ${
            !sidebarExpanded ? "justify-center" : "justify-between"
          } ${
            isActive 
              ? "bg-[#F3F4F6] text-[#3C50E0] dark:bg-meta-4 dark:text-white" 
              : "text-[#1C2434] hover:bg-gray-2 hover:text-[#3C50E0] dark:text-bodydark1 dark:hover:bg-meta-4"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={isActive ? "text-[#3C50E0] dark:text-white" : "text-[#64748B] dark:text-bodydark2 group-hover:text-[#3C50E0]"}>
              {icon}
            </span>
            {sidebarExpanded && label}
          </div>
          
          {sidebarExpanded && (
            <div className="flex items-center gap-2">
              {isNew && (
                <span className="rounded bg-[#10B981]/10 px-2 py-0.5 text-xs font-medium text-[#10B981] dark:bg-meta-3 dark:text-white">
                  NEW
                </span>
              )}
              {hasDropdown && (
                isOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />
              )}
            </div>
          )}
        </Link>
        
        {/* Dropdown Menu */}
        {hasDropdown && isOpen && sidebarExpanded && (
          <div className="mt-1 flex flex-col gap-2 pl-12 py-2">
            {subItems.map((item) => (
              <Link
                key={item}
                href="#"
                className="text-[#1C2434] hover:text-[#3C50E0] dark:text-bodydark2 dark:hover:text-white text-sm font-medium py-1"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`absolute left-0 top-0 z-50 flex h-screen flex-col overflow-y-hidden bg-white border-r border-stroke duration-300 ease-linear dark:bg-boxdark dark:border-strokedark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${sidebarExpanded ? "lg:w-72 w-72" : "lg:w-20 w-72"}`}
    >
      {/* SIDEBAR HEADER */}
      <div className={`flex items-center gap-2 px-6 py-4 lg:py-6 ${sidebarExpanded ? "justify-between" : "justify-center"}`}>
        <Link href="/" className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <rect width="32" height="32" rx="8" fill="#3C50E0"/>
            <rect x="8" y="16" width="3" height="8" rx="1.5" fill="white"/>
            <rect x="14.5" y="10" width="3" height="14" rx="1.5" fill="white"/>
            <rect x="21" y="13" width="3" height="11" rx="1.5" fill="white"/>
          </svg>
          {sidebarExpanded && (
            <span className="text-2xl font-bold text-black dark:text-white">FixItNow</span>
          )}
        </Link>
        {sidebarExpanded && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden cursor-pointer text-body hover:text-black dark:hover:text-white"
          >
            <svg className="fill-current w-6 h-6" viewBox="0 0 20 18" fill="none">
              <path d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z" />
            </svg>
          </button>
        )}
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className={`mt-1 py-2 ${sidebarExpanded ? 'px-4 lg:px-6' : 'px-4 lg:px-2'}`}>
          
          {/* MENU GROUP */}
          <div>
            <h3 className={`mb-4 text-xs font-semibold text-[#8A99AF] uppercase ${sidebarExpanded ? 'ml-4' : 'text-center'}`}>
              {sidebarExpanded ? "MAIN MENU" : <FiMoreHorizontal className="inline-block w-5 h-5" />}
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              {role === "ADMIN" && (
                <>
                  {navItem("Dashboard", <FiGrid className="w-5 h-5" />, false, false, [], "/dashboard/admin")}
                  {navItem("Users", <FiUser className="w-5 h-5" />, false, false, [], "/dashboard/admin/users")}
                  {navItem("Technicians", <FiTool className="w-5 h-5" />, false, true, ["All Technicians", "Pending Approvals"], "/dashboard/admin/technicians")}
                  {navItem("Categories", <FiTag className="w-5 h-5" />, false, false, [], "/dashboard/admin/categories")}
                  {navItem("Services", <FiList className="w-5 h-5" />, false, false, [], "/dashboard/admin/services")}
                  {navItem("Bookings", <FiCheckSquare className="w-5 h-5" />, false, false, [], "/dashboard/admin/bookings")}
                  {navItem("Payments", <FiCreditCard className="w-5 h-5" />, false, false, [], "/dashboard/admin/payments")}
                  {navItem("Reviews", <FiStar className="w-5 h-5" />, false, false, [], "/dashboard/admin/reviews")}
                </>
              )}

              {role === "TECHNICIAN" && (
                <>
                  {navItem("Dashboard", <FiGrid className="w-5 h-5" />, false, false, [], "/dashboard/technician")}
                  {navItem("My Bookings", <FiCheckSquare className="w-5 h-5" />, false, true, ["All Jobs", "Pending", "Completed"], "/dashboard/technician/bookings")}
                  {navItem("My Profile", <FiUser className="w-5 h-5" />, false, false, [], "/dashboard/technician/profile")}
                </>
              )}

              {role === "CUSTOMER" && (
                <>
                  {navItem("Dashboard", <FiGrid className="w-5 h-5" />, false, false, [], "/dashboard/customer")}
                  {navItem("Book a Service", <FiShoppingCart className="w-5 h-5" />, false, false, [], "/dashboard/customer/book")}
                  {navItem("My Bookings", <FiCheckSquare className="w-5 h-5" />, false, false, [], "/dashboard/customer/bookings")}
                  {navItem("Payments", <FiCreditCard className="w-5 h-5" />, false, false, [], "/dashboard/customer/payments")}
                  {navItem("My Reviews", <FiStar className="w-5 h-5" />, false, false, [], "/dashboard/customer/reviews")}
                  {navItem("Apply as Technician", <FiTool className="w-5 h-5" />, true, false, [], "/dashboard/customer/apply-technician")}
                </>
              )}
            </ul>
          </div>

          {/* SUPPORT GROUP */}
          <div>
            <h3 className={`mb-4 mt-6 text-xs font-semibold text-[#8A99AF] uppercase ${sidebarExpanded ? 'ml-4' : 'text-center'}`}>
              {sidebarExpanded ? "SUPPORT" : <FiMoreHorizontal className="inline-block w-5 h-5" />}
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              {navItem("Chat", <FiMessageCircle className="w-5 h-5" />, false, false, [])}
              {navItem("Support", <FiHeadphones className="w-5 h-5" />, true, false, [])}
              {navItem("Email", <FiMail className="w-5 h-5" />, false, false, [])}
            </ul>
          </div>

        </nav>
      </div>
    </aside>
  );
}
