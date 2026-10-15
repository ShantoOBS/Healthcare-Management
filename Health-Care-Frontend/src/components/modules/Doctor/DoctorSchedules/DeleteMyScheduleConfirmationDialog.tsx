"use client"

import { deleteMyDoctorScheduleAction } from "@/app/(dashboardLayout)/doctor/dashboard/my-schedules/_action"
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
import { type IDoctorSchedule } from "@/types/doctorSchedule.types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteMyScheduleConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctorSchedule: IDoctorSchedule | null
}

const getScheduleLabel = (doctorSchedule: IDoctorSchedule | null) => {
  const value = doctorSchedule?.schedule?.startDateTime

  if (!value) {
    return "this schedule"
  }

  const dateValue = new Date(value)
  if (Number.isNaN(dateValue.getTime())) {
    return "this schedule"
  }

  return `schedule starting ${format(dateValue, "MMM dd, yyyy hh:mm a")}`
}

const DeleteMyScheduleConfirmationDialog = ({
  open,
  onOpenChange,
  doctorSchedule,
}: DeleteMyScheduleConfirmationDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteMyDoctorScheduleAction,
  })

  const handleConfirmDelete = async () => {
    if (!doctorSchedule) {
      toast.error("Schedule not found")
      return
    }

    if (doctorSchedule.isBooked) {
      toast.error("This schedule is already booked by a patient and cannot be removed")
      return
    }

    const result = await mutateAsync(doctorSchedule.scheduleId)

    if (!result.success) {
      toast.error(result.message || "Failed to remove schedule")
      return
    }

    toast.success(result.message || "Schedule removed successfully")
    onOpenChange(false)

    void queryClient.invalidateQueries({ queryKey: ["my-doctor-schedules"] })
    void queryClient.refetchQueries({ queryKey: ["my-doctor-schedules"], type: "active" })
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="doctor-delete-dialog">
        <AlertDialogHeader className="doctor-delete-header">
          <AlertDialogMedia className="doctor-delete-icon">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Remove my schedule?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {getScheduleLabel(doctorSchedule)}? This action cannot be undone.
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
            {isPending ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteMyScheduleConfirmationDialog
