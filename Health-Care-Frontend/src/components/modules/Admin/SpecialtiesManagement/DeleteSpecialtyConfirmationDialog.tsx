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
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type ISpecialty } from "@/types/specialty.types"
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
      <AlertDialogContent className="rounded-2xl border-[#e5ebe7] p-6 bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-[#1a2d29]">Delete Specialty</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-[#657873]">
            Are you sure you want to delete <span className="font-bold text-[#1a2d29]">{specialty?.title || "this specialty"}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="pt-2">
          <AlertDialogCancel disabled={isPending} className="rounded-xl border-[#e5ebe7] text-[#5e716c]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              void handleConfirmDelete()
            }}
            disabled={isPending}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            {isPending ? "Deleting..." : "Delete Specialty"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteSpecialtyConfirmationDialog
