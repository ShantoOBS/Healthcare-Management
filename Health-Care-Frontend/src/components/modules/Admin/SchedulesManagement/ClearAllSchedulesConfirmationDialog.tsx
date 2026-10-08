"use client"

import { clearAllSchedulesAction } from "@/app/(dashboardLayout)/admin/dashboard/schedules-management/_action"
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
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ClearAllSchedulesConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalCount?: number
  onSuccess?: () => void
}

const ClearAllSchedulesConfirmationDialog = ({
  open,
  onOpenChange,
  totalCount,
  onSuccess,
}: ClearAllSchedulesConfirmationDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: clearAllSchedulesAction,
  })

  const handleConfirmClearAll = async () => {
    const result = await mutateAsync()

    if (!result.success) {
      toast.error(result.message || "Failed to clear all schedules")
      return
    }

    toast.success(result.message || "All schedules have been permanently cleared")
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
            <AlertTriangle aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Clear all schedules?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-bold text-[#1a2d29]">
              all {totalCount !== undefined ? `${totalCount} ` : ""}schedules
            </span>{" "}
            from the system. This action is irreversible and will remove all doctor time slots and unfulfilled schedule mappings.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="doctor-delete-footer">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(event) => {
              event.preventDefault()
              void handleConfirmClearAll()
            }}
            disabled={isPending}
          >
            {isPending ? "Clearing all..." : "Yes, Clear All Schedules"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ClearAllSchedulesConfirmationDialog
