"use client";

import PublicFooter from "@/components/shared/PublicFooter";
import PublicNavbar from "@/components/shared/PublicNavbar";
import { usePathname } from "next/navigation";

export default function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password") || pathname.startsWith("/verify-email");

  return (
    <div className="min-h-screen bg-[#e8eeeb] text-foreground">
      {!isAuthRoute && <PublicNavbar />}
      {children}
      {!isAuthRoute && <PublicFooter />}
    </div>
  );
}
