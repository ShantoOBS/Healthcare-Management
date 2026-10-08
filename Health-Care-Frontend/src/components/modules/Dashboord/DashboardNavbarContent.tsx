"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import { Menu, Search, Mail, Snowflake } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

interface DashboardNavbarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string
}

const DashboardNavbarContent = ({ dashboardHome, navItems, userInfo }: DashboardNavbarProps) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSmallerScreen = () => {
      setIsMobile(window.innerWidth < 768);
    }

    checkSmallerScreen();
    window.addEventListener("resize", checkSmallerScreen);

    return () => {
      window.removeEventListener("resize", checkSmallerScreen);
    };
  }, []);

  return (
    <header className="flex items-center justify-between
    gap-4 w-full px-6 py-2.5 border-b border-[#e5ebe7] bg-white text-[#1a2d29] flex-shrink-0">
      {/* Mobile Menu Toggle Button And Menu */}
      <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant={"outline"} size={"icon"} className="">
            <Menu className="h-5 w-5 text-[#1a2d29]" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-72 p-0
         border-r border-[#e5ebe7] bg-white 
         flex flex-col h-full max-h-screen overflow-hidden">
          <DashboardMobileSidebar userInfo={userInfo} dashboardHome={dashboardHome} navItems={navItems} />
        </SheetContent>
      </Sheet>

      {/* Search Input Component */}
      <div className="flex-1 max-w-sm">
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8aa099]" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full bg-[#f4f7f5] text-xs text-[#1a2d29] placeholder:text-[#8aa099] rounded-full pl-10 pr-4 py-2.5 outline-none border border-transparent focus:border-[#1f5c4b] transition"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">


        {/* Notification dropdown */}
        <NotificationDropdown />

        {/* User Profile Dropdown  */}
        <UserDropdown userInfo={userInfo} />
      </div>
    </header>
  )
}

export default DashboardNavbarContent
