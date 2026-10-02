"use client";

import { deletePatient } from "@/services/patient.services";
import { IPatient } from "@/types/patient.types";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeletePatientConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: IPatient | null;
}

const DeletePatientConfirmationDialog = ({
  open,
  onOpenChange,
  patient,
}: DeletePatientConfirmationDialogProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!patient) throw new Error("Patient not found");
      return deletePatient(String(patient.id));
    },
    onSuccess: () => {
      toast.success("Patient deleted successfully");
      onOpenChange(false);
      void queryClient.invalidateQueries({ queryKey: ["patients"] });
      router.refresh();
    },
    onError: () => toast.error("Could not delete patient. Please try again."),
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="doctor-delete-dialog">
        <AlertDialogHeader className="doctor-delete-header">
          <AlertDialogMedia className="doctor-delete-icon"><Trash2 aria-hidden="true" /></AlertDialogMedia>
          <AlertDialogTitle>Delete patient?</AlertDialogTitle>
          <AlertDialogDescription>
            {patient?.name ?? "This patient"} and their linked account will be soft-deleted, and active sessions will be revoked.
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
            {deleteMutation.isPending ? "Deleting..." : "Delete patient"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePatientConfirmationDialog;