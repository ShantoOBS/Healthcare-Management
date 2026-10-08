"use client"

import { useState } from "react"
import Logo from "@/components/shared/Logo"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getIconComponent } from "@/lib/iconMapper"
import { cn } from "@/lib/utils"
import { NavSection } from "@/types/dashboard.types"
import { UserInfo } from "@/types/user.types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

interface DashboardSidebarContentProps {
  userInfo: UserInfo,
  navItems: NavSection[],
  dashboardHome: string,
}

const DashboardSidebarContent = ({ dashboardHome, navItems, userInfo }: DashboardSidebarContentProps) => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn("hidden md:flex h-full flex-col border-r bg-card overflow-hidden transition-all duration-300", isCollapsed ? "w-20" : "w-64")}>
      {/* Logo / Brand Header */}
      <div className={cn("flex h-16 shrink-0 items-center border-b px-4", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <Logo href={"/"} />
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="group relative flex h-8 w-8 shrink-0
           items-center justify-center cursor-pointer
            bg-white text-[#526b62] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-[#b5d5c6] hover:bg-[#edf5f1] hover:text-[#174c3b] hover:shadow-xs active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f5c4b]/30"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          ) : (
            <PanelLeftClose className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          )}
        </button>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 min-h-0 px-3 py-4">
        <nav className="space-y-6">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && !isCollapsed && (
                <h4 className="mb-3 px-3 text-[11px] font-bold text-[#8fa09b] tracking-wider uppercase">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1.5">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  // Icon Mapper Function
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      title={isCollapsed ? item.title : undefined}
                      className={cn(
                        "flex items-center rounded-md text-sm font-semibold transition-all duration-200",
                        isCollapsed ? "justify-center h-11 w-11 mx-auto" : "gap-3.5 px-4 py-3",
                        isActive
                          ? "bg-[#1f5c4b] text-white shadow-md shadow-[#1f5c4b]/20"
                          : "text-[#5e716c] hover:bg-[#edf4f0] hover:text-[#1f5c4b]",
                      )}
                    >
                      <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-white" : "text-[#5e716c]")} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  );
                })}
              </div>

              {sectionId < navItems.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info At Bottom */}
      <div className="border-t px-3 py-4 shrink-0">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{userInfo.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {userInfo.role.toLocaleLowerCase().replace("_", " ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebarContent