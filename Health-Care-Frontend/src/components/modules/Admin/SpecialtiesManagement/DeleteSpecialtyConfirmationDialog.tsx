"use client"

import { deleteSpecialtyAction } from "@/app/(dashboardLayout)/admin/dashboard/specialties-management/_action"
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
import { type ISpecialty } from "@/types/specialty.types"
import { Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteSpecialtyConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  specialty: ISpecialty | null
}

const DeleteSpecialtyConfirmationDialog = ({
  open,
  onOpenChange,
  specialty,
}: DeleteSpecialtyConfirmationDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteSpecialtyAction,
  })

  const handleConfirmDelete = async () => {
    if (!specialty) {
      toast.error("Specialty not found")
      return
    }

    const result = await mutateAsync(specialty.id)

    if (!result.success) {
      toast.error(result.message || "Failed to delete specialty")
      return
    }

    toast.success("Specialty deleted successfully")
    onOpenChange(false)

    void queryClient.invalidateQueries({ queryKey: ["specialties"] })
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="doctor-delete-dialog">
        <AlertDialogHeader className="doctor-delete-header">
          <AlertDialogMedia className="doctor-delete-icon">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete specialty?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-bold text-[#1a2d29]">{specialty?.title || "this specialty"}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="doctor-delete-footer">
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              void handleConfirmDelete()
            }}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? "Deleting..." : "Delete Specialty"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteSpecialtyConfirmationDialog
