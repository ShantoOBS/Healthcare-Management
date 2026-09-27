import DashboardNavbar from "@/components/modules/Dashboord/DashboardNavbar"
import DashboardSidebar from "@/components/modules/Dashboord/DashboardSidebar"
import React from "react"

const RootDashboardLayout = async ({children} : {children: React.ReactNode}) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7f5] text-[#1a2d29]">
        {/* Dashboard Sidebar */}
        <DashboardSidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
            {/* DashboardNavbar */}
            <DashboardNavbar />
            {/* Dashboard Content */}
            <main className="flex-1 overflow-y-auto bg-[#f4f7f5] p-4 md:p-6 lg:p-8">
                <div>
                    {children}
                </div>
            </main>
        </div>
    </div>
  )
}

export default RootDashboardLayout