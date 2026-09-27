"use client"

import { useState } from "react"
import AppointmentBarChart from "@/components/shared/AppointmentBarChart"
import AppointmentPieChart from "@/components/shared/AppointmentPieChart"
import StatsCard from "@/components/shared/StatsCard"
import { getDashboardData } from "@/services/dashboard.services"
import { ApiResponse } from "@/types/api.types"
import { IAdminDashboardData } from "@/types/dashboard.types"
import { useQuery } from "@tanstack/react-query"
import VideoCallDashboard from "./VideoCallDashboard"
import { Video, BarChart2 } from "lucide-react"

const AdminDashboardContent = () => {
  const [activeTab, setActiveTab] = useState<"calls" | "analytics">("calls")

  const { data: adminDashboardData } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  const { data } = (adminDashboardData || {}) as ApiResponse<IAdminDashboardData>;

  return (
    <div className="space-y-6">
      {/* Top Tab Switcher */}
      <div className="flex items-center justify-between border-b border-[#e5ebe7] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("calls")}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "calls"
                ? "bg-[#1f5c4b] text-white shadow-md shadow-[#1f5c4b]/20"
                : "bg-white text-[#5e716c] hover:bg-[#edf4f0] border border-[#e5ebe7]"
            }`}
          >
            <Video className="h-4 w-4" />
            Live Consultation Calls
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "analytics"
                ? "bg-[#1f5c4b] text-white shadow-md shadow-[#1f5c4b]/20"
                : "bg-white text-[#5e716c] hover:bg-[#edf4f0] border border-[#e5ebe7]"
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            Analytics Overview
          </button>
        </div>
      </div>

      {activeTab === "calls" ? (
        <VideoCallDashboard />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatsCard
              title="Total Appointments"
              value={data?.appointmentCount || 0}
              iconName="CalendarDays"
              description="Number of appointments scheduled"
            />
            <StatsCard
              title="Total Patients"
              value={data?.patientCount || 0}
              iconName="Users"
              description="Number of patients registered"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppointmentBarChart data={data?.barChartData || []} />
            <AppointmentPieChart data={data?.pieChartData || []} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardContent