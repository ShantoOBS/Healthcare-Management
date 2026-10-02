"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAdmin } from "@/services/admin.services";
import { IAdmin } from "@/types/admin.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditAdminFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: IAdmin | null;
}

const EditAdminFormModal = ({ open, onOpenChange, admin }: EditAdminFormModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    if (!open || !admin) return;
    setName(admin.name);
    setContactNumber(admin.contactNumber ?? "");
  }, [admin, open]);

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!admin) throw new Error("Administrator not found");
      return updateAdmin(String(admin.id), {
        admin: { name: name.trim(), contactNumber: contactNumber.trim() },
      });
    },
    onSuccess: () => {
      toast.success("Administrator updated successfully");
      onOpenChange(false);
      void queryClient.invalidateQueries({ queryKey: ["admins"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-details", admin?.id] });
      router.refresh();
    },
    onError: () => toast.error("Could not update administrator. Please try again."),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="doctor-form-dialog doctor-edit-dialog max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0 sm:w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-3rem)]">
        <DialogHeader className="doctor-dialog-header border-b px-6 py-5 pr-14">
          <DialogTitle className="doctor-dialog-title">Edit administrator</DialogTitle>
          <DialogDescription className="doctor-dialog-description">
            Update the name and contact number. Email and role are read-only.
          </DialogDescription>
        </DialogHeader>
        <div className="doctor-form-body">
          <form className="doctor-form space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="admin-name">Full name</Label>
              <Input id="admin-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={100} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" value={admin?.email ?? ""} readOnly disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-contact">Contact number</Label>
              <Input id="admin-contact" value={contactNumber} onChange={(event) => setContactNumber(event.target.value)} maxLength={14} />
            </div>
            <div className="doctor-form-footer flex items-center justify-end gap-3 border-t">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={updateMutation.isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={updateMutation.isPending || !name.trim()}>
                {updateMutation.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminFormModal;