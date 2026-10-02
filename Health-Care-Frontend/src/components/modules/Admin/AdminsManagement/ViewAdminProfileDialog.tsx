"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAdminById } from "@/services/admin.services";
import { IAdmin } from "@/types/admin.types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface ViewAdminProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: IAdmin | null;
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not provided" : format(date, "MMM dd, yyyy");
};

const ViewAdminProfileDialog = ({ open, onOpenChange, admin }: ViewAdminProfileDialogProps) => {
  const adminId = admin?.id ?? "";
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-details", adminId],
    queryFn: () => getAdminById(adminId),
    enabled: open && adminId.length > 0,
    staleTime: 1000 * 60,
  });
  const details = data?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="doctor-profile-dialog max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0 sm:w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-3rem)]">
        <DialogHeader className="doctor-dialog-header border-b px-6 py-5 pr-14">
          <DialogTitle className="doctor-dialog-title">Administrator profile</DialogTitle>
          <DialogDescription className="doctor-dialog-description">
            Account identity, role, and access status.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 p-6">
          {isLoading && <p className="text-sm text-muted-foreground">Loading administrator...</p>}
          {isError && <p className="text-sm text-destructive">Could not load this administrator.</p>}
          {details && (
            <>
              <div className="doctor-profile-hero">
                <div className="doctor-profile-avatar grid place-items-center rounded-full bg-[#e2efe4] font-semibold text-[#174c3b]">
                  {details.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AD"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="doctor-profile-eyebrow">Administrator</p>
                  <h2 className="doctor-profile-name">{details.name}</h2>
                  <p className="doctor-profile-email">{details.email}</p>
                </div>
                <span className="doctor-profile-status rounded-full border px-2.5 py-1 text-xs font-semibold">
                  {details.user.status.toLowerCase()}
                </span>
              </div>
              <section className="doctor-profile-section">
                <h3>Account details</h3>
                <div className="doctor-profile-details">
                  <p><span>Role</span>{details.user.role === "SUPER_ADMIN" ? "Super admin" : "Admin"}</p>
                  <p><span>Contact</span>{details.contactNumber || "Not provided"}</p>
                  <p><span>Joined</span>{formatDate(details.createdAt)}</p>
                  <p><span>Last updated</span>{formatDate(details.updatedAt)}</p>
                </div>
              </section>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAdminProfileDialog;