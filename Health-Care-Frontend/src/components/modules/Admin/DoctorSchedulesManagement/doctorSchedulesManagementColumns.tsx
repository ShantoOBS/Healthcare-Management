import DateCell from "@/components/shared/cell/DateCell"
import { Badge } from "@/components/ui/badge"
import { type IDoctorSchedule } from "@/types/doctorSchedule.types"
import { ColumnDef } from "@tanstack/react-table"
import { differenceInMinutes } from "date-fns"

const getDurationLabel = (doctorSchedule: IDoctorSchedule) => {
  const startDateTime = doctorSchedule.schedule?.startDateTime
  const endDateTime = doctorSchedule.schedule?.endDateTime

  if (!startDateTime || !endDateTime) return "N/A"

  const durationInMinutes = differenceInMinutes(
    new Date(endDateTime),
    new Date(startDateTime),
  )

  return durationInMinutes > 0 ? `${durationInMinutes} mins` : "N/A"
}

export const doctorSchedulesManagementColumns: ColumnDef<IDoctorSchedule>[] = [
  {
    id: "doctor",
    accessorFn: (row) => row.doctor?.user?.name ?? row.doctor?.name ?? "",
    header: "Doctor",
    enableSorting: false,
    cell: ({ row }) => {
      const doctor = row.original.doctor
      const name = doctor?.user?.name ?? doctor?.name ?? "Unknown doctor"
      const email = doctor?.user?.email ?? doctor?.email

      return (
        <div className="min-w-36 space-y-0.5">
          <p className="font-medium">{name}</p>
          {email && <p className="text-xs text-muted-foreground">{email}</p>}
        </div>
      )
    },
  },
  {
    id: "startDateTime",
    accessorFn: (row) => row.schedule?.startDateTime ?? "",
    header: "Schedule Start",
    enableSorting: false,
    cell: ({ row }) => {
      const startDateTime = row.original.schedule?.startDateTime
      return startDateTime
        ? <DateCell date={startDateTime} formatString="MMM dd, yyyy hh:mm a" />
        : <span className="text-sm text-muted-foreground">N/A</span>
    },
  },
  {
    id: "endDateTime",
    accessorFn: (row) => row.schedule?.endDateTime ?? "",
    header: "Schedule End",
    enableSorting: false,
    cell: ({ row }) => {
      const endDateTime = row.original.schedule?.endDateTime
      return endDateTime
        ? <DateCell date={endDateTime} formatString="MMM dd, yyyy hh:mm a" />
        : <span className="text-sm text-muted-foreground">N/A</span>
    },
  },
  {
    id: "duration",
    header: "Duration",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="schedule-duration-cell">{getDurationLabel(row.original)}</span>
    ),
  },
  {
    id: "isBooked",
    accessorKey: "isBooked",
    header: "Status",
    cell: ({ row }) => {
      const isBooked = row.original.isBooked

      return (
        <Badge variant={isBooked ? "destructive" : "secondary"}>
          {isBooked ? "Booked" : "Available"}
        </Badge>
      )
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Assigned On",
    cell: ({ row }) => {
      const assignedAt = row.original.createdAt
      return assignedAt
        ? <DateCell date={assignedAt} formatString="MMM dd, yyyy" />
        : <span className="text-sm text-muted-foreground">N/A</span>
    },
  },
]
