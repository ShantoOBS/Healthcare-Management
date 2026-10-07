"use client"
import Logo from "@/components/shared/Logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetTitle } from "@/components/ui/sheet";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardMobileSidebarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardMobileSidebar = ({ dashboardHome, navItems, userInfo }: DashboardMobileSidebarProps) => {
  const pathname = usePathname()
  return (
    <div className="flex h-full max-h-screen flex-col bg-white text-[#1a2d29] overflow-hidden">
      {/* Logo Header */}
      <div className="flex h-20 items-center border-b border-[#f0f4f2] px-6 flex-shrink-0">
        <Link href={dashboardHome} className="flex items-center gap-2">
          <Logo />
        </Link>
      </div>

      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

      {/* Vertically Scrollable Navigation Area */}
      <ScrollArea className="flex-1 min-h-0 px-4 py-5 touch-pan-y">
        <nav className="space-y-6 pb-6">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-3 px-3 text-[11px] font-bold text-[#8fa09b] tracking-wider uppercase">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1.5">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "flex items-center gap-3.5 rounded-md px-4 py-3 text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "bg-[#1f5c4b] text-white shadow-md shadow-[#1f5c4b]/20"
                          : "text-[#5e716c] hover:bg-[#edf4f0] hover:text-[#1f5c4b]",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-[#5e716c]")} />
                      <span className="flex-1 truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info Footer */}
      <div className="border-t border-[#f0f4f2] p-4 bg-[#fbfdfc] flex-shrink-0">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-[#e5ebe7] shadow-sm">
          <div className="h-9 w-9 rounded-full bg-[#1f5c4b] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {userInfo.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate text-[#1a2d29]">{userInfo.name}</p>
            <p className="text-[11px] text-[#788a85] capitalize">
              {userInfo.role.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMobileSidebar

