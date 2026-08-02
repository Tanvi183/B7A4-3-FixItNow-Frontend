"use client";

import { 
  Briefcase, 
  Wallet, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  MapPin,
  CalendarClock
} from "lucide-react";

// Mock Data for Technician Dashboard
const stats = [
  { label: "Total Earnings", value: "$4,250", change: "+12%", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Completed Jobs", value: "38", change: "+4", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Pending Requests", value: "5", change: "Action Needed", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Active Jobs", value: "2", change: "In Progress", icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
];

const upcomingJobs = [
  {
    id: "JOB-402",
    customer: "Alice Johnson",
    service: "AC Repair & Servicing",
    date: "Today, 2:30 PM",
    location: "123 Main St, Apt 4B",
    amount: "$85.00",
    status: "CONFIRMED"
  },
  {
    id: "JOB-403",
    customer: "Robert Smith",
    service: "Plumbing Leak Fix",
    date: "Tomorrow, 9:00 AM",
    location: "45 West Avenue",
    amount: "$65.00",
    status: "CONFIRMED"
  },
];

export default function TechnicianDashboardPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1 text-sm">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                  {stat.change.includes("+") ? <TrendingUp size={12} className="text-emerald-500" /> : null}
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Jobs Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 font-heading">Upcoming Jobs</h2>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {upcomingJobs.map((job) => (
            <div key={job.id} className="p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900">{job.service}</h4>
                  <p className="text-sm text-slate-500 mt-0.5">for {job.customer} • {job.id}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <CalendarClock size={14} className="text-slate-400" /> {job.date}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <MapPin size={14} className="text-slate-400" /> {job.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center mt-2 sm:mt-0">
                <span className="text-lg font-bold text-slate-900">{job.amount}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 mt-1">
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
