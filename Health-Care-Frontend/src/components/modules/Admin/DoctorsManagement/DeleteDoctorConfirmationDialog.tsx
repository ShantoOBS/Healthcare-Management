"use client"

import { deleteDoctorAction } from "@/app/(dashboardLayout)/admin/dashboard/doctors-management/_action"
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
} from "@/components/ui/alert-dialog"
import { type IDoctor } from "@/types/doctor.types"
import { Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteDoctorConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctor: IDoctor | null
}

const DeleteDoctorConfirmationDialog = ({
  open,
  onOpenChange,
  doctor,
}: DeleteDoctorConfirmationDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteDoctorAction,
  })

  const handleConfirmDelete = async () => {
    if (!doctor) {
      toast.error("Doctor not found")
      return
    }

    const result = await mutateAsync(String(doctor.id))

    if (!result.success) {
      toast.error(result.message || "Failed to delete doctor")
      return
    }

    toast.success(result.message || "Doctor deleted successfully")
    onOpenChange(false)

    void queryClient.invalidateQueries({ queryKey: ["doctors"] })
    void queryClient.refetchQueries({ queryKey: ["doctors"], type: "active" })
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="doctor-delete-dialog">
        <AlertDialogHeader className="doctor-delete-header">
          <AlertDialogMedia className="doctor-delete-icon">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete doctor?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {doctor?.name ?? "this doctor"}? This action will mark the doctor and
            linked user as deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="doctor-delete-footer">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(event) => {
              event.preventDefault()
              void handleConfirmDelete()
            }}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteDoctorConfirmationDialog