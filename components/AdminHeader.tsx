"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { FiSearch, FiSun, FiMoon, FiBell, FiChevronDown, FiMenu, FiUser, FiSettings, FiInfo, FiLogOut, FiChevronUp } from "react-icons/fi";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (arg: boolean) => void;
}

export default function AdminHeader({ sidebarOpen, setSidebarOpen, sidebarExpanded, setSidebarExpanded }: AdminHeaderProps) {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3C50E0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, sign out!'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        setDropdownOpen(false);
        router.push('/');
      }
    });
  };

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white border-b border-stroke dark:bg-boxdark dark:border-strokedark">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        
        {/* Left Area (Hamburger + Search) */}
        <div className="flex items-center gap-4">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              if (window.innerWidth < 1024) {
                setSidebarOpen(!sidebarOpen);
              } else {
                setSidebarExpanded(!sidebarExpanded);
              }
            }}
            className="z-50 block cursor-pointer rounded-sm border border-stroke bg-white p-2.5 shadow-sm dark:border-strokedark dark:bg-boxdark"
          >
            <FiMenu className="w-5 h-5 text-black dark:text-white" />
          </button>
          
          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
          </Link>

          <div className="hidden sm:block">
            <form action="https://formbold.com/s/unique_form_id" method="POST">
              <div className="relative flex items-center rounded-sm border border-stroke bg-white px-4 py-2.5 dark:border-strokedark dark:bg-boxdark xl:w-125">
                <button className="mr-3 flex-shrink-0">
                  <FiSearch className="w-5 h-5 text-body hover:text-primary dark:text-bodydark dark:hover:text-primary" />
                </button>

                <input
                  type="text"
                  placeholder="Search or type command..."
                  className="w-full bg-transparent font-medium focus:outline-none text-sm text-black dark:text-white"
                />
                
                <span className="ml-3 flex-shrink-0 rounded bg-gray-2 px-2 py-0.5 text-xs font-medium text-body dark:bg-meta-4">
                  ⌘ K
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Right Area */}
        <div className="flex items-center gap-6 md:gap-8">
          <ul className="flex items-center gap-4">
            
            {/* Dark Mode Toggle */}
            <li>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative flex cursor-pointer h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              >
                {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
            </li>

            {/* Notification Menu Area */}
            <li className="relative">
              <Link
                className="relative flex cursor-pointer h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                href="#"
              >
                <span className="absolute top-0 right-0 z-1 h-2 w-2 rounded-full bg-meta-1"></span>
                <FiBell className="w-5 h-5" />
              </Link>
            </li>
          </ul>

          {/* User Area */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <span className="h-10 w-10 rounded-full overflow-hidden">
                <Image
                  width={40}
                  height={40}
                  src="https://ui-avatars.com/api/?name=Musharof&background=E5E7EB&color=000"
                  alt="User"
                  className="rounded-full"
                />
              </span>

              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                  Musharof
                </span>
              </span>

              {dropdownOpen ? (
                <FiChevronUp className="hidden w-4 h-4 text-black lg:block dark:text-white" />
              ) : (
                <FiChevronDown className="hidden w-4 h-4 text-black lg:block dark:text-white" />
              )}
            </button>
            
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-4 flex w-64 flex-col rounded-sm border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
                <div className="px-4 py-3 border-b border-stroke dark:border-strokedark">
                  <span className="block text-sm font-semibold text-black dark:text-white">Musharof Chowdhury</span>
                  <span className="block text-xs text-body dark:text-bodydark2">randomuser@pimjo.com</span>
                </div>
                
                <ul className="flex flex-col gap-3 border-b border-stroke px-4 py-3 dark:border-strokedark">
                  <li>
                    <Link href="#" className="flex items-center gap-3 text-sm font-medium duration-300 ease-in-out hover:text-primary dark:hover:text-white">
                      <FiUser className="w-5 h-5 text-body" /> Edit profile
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center gap-3 text-sm font-medium duration-300 ease-in-out hover:text-primary dark:hover:text-white">
                      <FiSettings className="w-5 h-5 text-body" /> Account settings
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center gap-3 text-sm font-medium duration-300 ease-in-out hover:text-primary dark:hover:text-white">
                      <FiInfo className="w-5 h-5 text-body" /> Support
                    </Link>
                  </li>
                </ul>
                
                <div className="p-2">
                  <button 
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 duration-300 ease-in-out hover:bg-red-50 hover:text-red-600 rounded-md dark:hover:bg-red-900/20 text-left"
                  >
                    <FiLogOut className="w-5 h-5 text-red-500" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
