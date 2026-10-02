"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteAdmin } from "@/services/admin.services";
import { IAdmin } from "@/types/admin.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteAdminConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: IAdmin | null;
}

const DeleteAdminConfirmationDialog = ({ open, onOpenChange, admin }: DeleteAdminConfirmationDialogProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!admin) throw new Error("Administrator not found");
      return deleteAdmin(String(admin.id));
    },
    onSuccess: () => {
      toast.success("Administrator deleted successfully");
      onOpenChange(false);
      void queryClient.invalidateQueries({ queryKey: ["admins"] });
      router.refresh();
    },
    onError: () => toast.error("Could not delete administrator. Please try again."),
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="doctor-delete-dialog">
        <AlertDialogHeader className="doctor-delete-header">
          <AlertDialogMedia className="doctor-delete-icon"><Trash2 aria-hidden="true" /></AlertDialogMedia>
          <AlertDialogTitle>Delete administrator?</AlertDialogTitle>
          <AlertDialogDescription>
            {admin?.name ?? "This administrator"} and their linked account will be soft-deleted, and active sessions will be revoked.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="doctor-delete-footer">
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              deleteMutation.mutate();
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete administrator"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAdminConfirmationDialog;