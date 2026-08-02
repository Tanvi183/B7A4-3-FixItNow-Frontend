"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  CalendarClock, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Clock, 
  Search,
  Filter
} from "lucide-react";
import Image from "next/image";

// Mock booking data for UI demonstration
const mockBookings = [
  {
    id: "BKG-1029",
    service: {
      name: "AC Repair & Servicing",
      category: "Appliance Repair",
      image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=100&auto=format&fit=crop"
    },
    technician: {
      name: "Michael Chen",
      rating: 4.8
    },
    date: new Date("2024-03-15T10:00:00"),
    status: "PENDING",
    amount: 85.00
  },
  {
    id: "BKG-1028",
    service: {
      name: "Deep Home Cleaning",
      category: "Cleaning",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=100&auto=format&fit=crop"
    },
    technician: {
      name: "Sarah Jenkins",
      rating: 4.9
    },
    date: new Date("2024-03-10T14:30:00"),
    status: "COMPLETED",
    amount: 120.00
  },
  {
    id: "BKG-1027",
    service: {
      name: "Plumbing Leak Fix",
      category: "Plumbing",
      image: "https://images.unsplash.com/photo-1607472586893-edb57cbca9ee?q=80&w=100&auto=format&fit=crop"
    },
    technician: {
      name: "David Wilson",
      rating: 4.7
    },
    date: new Date("2024-03-05T09:00:00"),
    status: "CANCELLED",
    amount: 65.00
  },
  {
    id: "BKG-1026",
    service: {
      name: "Electrical Wiring",
      category: "Electrical",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=100&auto=format&fit=crop"
    },
    technician: {
      name: "John Smith",
      rating: 4.6
    },
    date: new Date("2024-03-01T11:00:00"),
    status: "AWAITING_PAYMENT",
    amount: 150.00
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
          <Clock size={14} /> Pending
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 size={14} /> Completed
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-200">
          <XCircle size={14} /> Cancelled
        </span>
      );
    case "AWAITING_PAYMENT":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
          <CreditCard size={14} /> Payment Due
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          {status}
        </span>
      );
  }
};

export default function CustomerDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = mockBookings.filter(booking => 
    booking.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-heading">My Bookings</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage your service requests and view history</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <Filter size={18} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Service & ID</th>
                  <th className="px-6 py-4">Technician</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                            <Image 
                              src={booking.service.image} 
                              alt={booking.service.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{booking.service.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{booking.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700 font-medium">{booking.technician.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="text-amber-400 fill-amber-400" size={12} />
                          <span className="text-xs text-slate-500">{booking.technician.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm text-slate-600">
                          <span className="flex items-center gap-1.5"><CalendarClock size={14} className="text-slate-400" /> {format(booking.date, "MMM dd, yyyy")}</span>
                          <span className="text-slate-400 text-xs ml-5 mt-0.5">{format(booking.date, "hh:mm a")}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900">${booking.amount.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {booking.status === "AWAITING_PAYMENT" && (
                            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                              Pay Now
                            </button>
                          )}
                          {booking.status === "PENDING" && (
                            <button className="px-3 py-1.5 bg-white border border-slate-200 text-rose-600 text-xs font-semibold rounded-md hover:bg-rose-50 transition-colors">
                              Cancel
                            </button>
                          )}
                          {booking.status === "COMPLETED" && (
                            <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-50 transition-colors">
                              Leave Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <CalendarClock size={32} className="mb-2 opacity-50" />
                        <p className="text-sm font-medium text-slate-600">No bookings found</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick component for Star icon (lucide-react doesn't export filled stars by default in some versions, but we can pass fill)
import { Star } from "lucide-react";
