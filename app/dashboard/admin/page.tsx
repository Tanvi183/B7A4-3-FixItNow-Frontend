"use client";

import React from "react";
import CardDataStats from "@/components/CardDataStats";
import ChartOne from "@/components/ChartOne";
import ChartTwo from "@/components/ChartTwo";
import ChartThree from "@/components/ChartThree";
import ChatCard from "@/components/ChatCard";
import TableOne from "@/components/TableOne";
import { FiEye, FiShoppingCart, FiShoppingBag, FiUsers } from "react-icons/fi";

export default function AdminDashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total views" total="$3.456K" rate="0.43%" levelUp>
          <FiEye className="text-primary dark:text-white text-xl" />
        </CardDataStats>
        <CardDataStats title="Total Profit" total="$45,2K" rate="4.35%" levelUp>
          <FiShoppingCart className="text-primary dark:text-white text-xl" />
        </CardDataStats>
        <CardDataStats title="Total Product" total="2.450" rate="2.59%" levelUp>
          <FiShoppingBag className="text-primary dark:text-white text-xl" />
        </CardDataStats>
        <CardDataStats title="Total Users" total="3.456" rate="0.95%" levelDown>
          <FiUsers className="text-primary dark:text-white text-xl" />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        {/* Skipping MapOne for now as it requires jsvectormap, replacing its spot with TableOne taking more width or leaving empty */}
        
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
}
