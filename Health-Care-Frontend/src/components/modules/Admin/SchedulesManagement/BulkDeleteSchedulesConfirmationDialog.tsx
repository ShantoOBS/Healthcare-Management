"use client"

import { bulkDeleteSchedulesAction } from "@/app/(dashboardLayout)/admin/dashboard/schedules-management/_action"
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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface BulkDeleteSchedulesConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIds: string[]
  onSuccess?: () => void
}

const BulkDeleteSchedulesConfirmationDialog = ({
  open,
  onOpenChange,
  selectedIds,
  onSuccess,
}: BulkDeleteSchedulesConfirmationDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: bulkDeleteSchedulesAction,
  })

  const handleConfirmBulkDelete = async () => {
    if (!selectedIds.length) {
      toast.error("No schedules selected")
      return
    }

    const result = await mutateAsync(selectedIds)

    if (!result.success) {
      toast.error(result.message || "Failed to delete selected schedules")
      return
    }

    toast.success(
      result.message ||
        `Successfully deleted ${selectedIds.length} marked schedule${selectedIds.length > 1 ? "s" : ""}`,
    )
    onOpenChange(false)
    onSuccess?.()

    void queryClient.invalidateQueries({ queryKey: ["schedules"] })
    void queryClient.refetchQueries({ queryKey: ["schedules"], type: "active" })
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="doctor-delete-dialog">
        <AlertDialogHeader className="doctor-delete-header">
          <AlertDialogMedia className="doctor-delete-icon">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete marked schedules?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-bold text-[#1a2d29]">
              {selectedIds.length} selected schedule{selectedIds.length > 1 ? "s" : ""}
            </span>
            ? This action cannot be undone and will unassign any associated slots.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="doctor-delete-footer">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(event) => {
              event.preventDefault()
              void handleConfirmBulkDelete()
            }}
            disabled={isPending}
          >
            {isPending
              ? "Deleting..."
              : `Delete ${selectedIds.length} Schedule${selectedIds.length > 1 ? "s" : ""}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BulkDeleteSchedulesConfirmationDialog
