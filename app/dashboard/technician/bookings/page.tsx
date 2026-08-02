"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  CalendarClock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  PlayCircle,
  MoreVertical,
  User
} from "lucide-react";
import Image from "next/image";

// Mock Data for Technician Bookings
const initialBookings = [
  {
    id: "BKG-2041",
    customer: { name: "Alice Johnson", phone: "+1 (555) 123-4567" },
    service: { name: "AC Repair & Servicing", category: "Appliance Repair" },
    date: new Date("2024-03-20T14:30:00"),
    location: "123 Main St, Apt 4B, New York, NY",
    status: "PENDING",
    amount: 85.00
  },
  {
    id: "BKG-2040",
    customer: { name: "Robert Smith", phone: "+1 (555) 987-6543" },
    service: { name: "Plumbing Leak Fix", category: "Plumbing" },
    date: new Date("2024-03-19T09:00:00"),
    location: "45 West Avenue, Brooklyn, NY",
    status: "ACCEPTED",
    amount: 65.00
  },
  {
    id: "BKG-2039",
    customer: { name: "Emily Davis", phone: "+1 (555) 456-7890" },
    service: { name: "Electrical Wiring", category: "Electrical" },
    date: new Date("2024-03-18T11:00:00"),
    location: "78 North Road, Queens, NY",
    status: "IN_PROGRESS",
    amount: 150.00
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">Pending Request</span>;
    case "ACCEPTED":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">Accepted</span>;
    case "IN_PROGRESS":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200">In Progress</span>;
    case "COMPLETED":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">Completed</span>;
    case "DECLINED":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-200">Declined</span>;
    default:
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">{status}</span>;
  }
};

export default function TechnicianBookingsPage() {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState("ALL");

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const filteredBookings = bookings.filter(b => filter === "ALL" || b.status === filter);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Bookings Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your service requests and active jobs.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {["ALL", "PENDING", "ACCEPTED", "IN_PROGRESS"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row gap-6 justify-between transition-all hover:shadow-md">
              
              {/* Info Section */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(booking.status)}
                    <span className="text-xs font-medium text-slate-400">ID: {booking.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{booking.service.name}</h3>
                  <p className="text-sm text-slate-500">{booking.service.category}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-800">{booking.customer.name}</span>
                      <span className="text-slate-400">({booking.customer.phone})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:mt-8">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <CalendarClock size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-800">{format(booking.date, "MMM dd, yyyy")}</p>
                      <p className="text-slate-500">{format(booking.date, "hh:mm a")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="leading-snug">{booking.location}</p>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:pl-6 lg:border-l border-slate-100 min-w-[200px]">
                <div className="text-left lg:text-right">
                  <p className="text-sm text-slate-500">Service Amount</p>
                  <p className="text-2xl font-bold text-slate-900">${booking.amount.toFixed(2)}</p>
                </div>
                
                <div className="flex flex-wrap lg:flex-col gap-2 justify-end w-full">
                  {booking.status === "PENDING" && (
                    <>
                      <button onClick={() => handleStatusUpdate(booking.id, "ACCEPTED")} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <CheckCircle2 size={16} /> Accept
                      </button>
                      <button onClick={() => handleStatusUpdate(booking.id, "DECLINED")} className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-rose-600 font-medium py-2 px-4 rounded-lg hover:bg-rose-50 transition-colors text-sm">
                        <XCircle size={16} /> Decline
                      </button>
                    </>
                  )}
                  {booking.status === "ACCEPTED" && (
                    <button onClick={() => handleStatusUpdate(booking.id, "IN_PROGRESS")} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                      <PlayCircle size={16} /> Start Job
                    </button>
                  )}
                  {booking.status === "IN_PROGRESS" && (
                    <button onClick={() => handleStatusUpdate(booking.id, "COMPLETED")} className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                      <CheckCircle2 size={16} /> Mark Completed
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <CalendarClock size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No bookings found</h3>
            <p className="text-slate-500 mt-1">You don't have any bookings matching this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
