import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { IAdminReview } from "@/types/review.types";
import { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

export const reviewColumns: ColumnDef<IAdminReview>[] = [
  {
    id: "patient.name",
    accessorKey: "patient.name",
    header: "Patient",
    cell: ({ row }) => (
      <div className="doctor-identity-cell">
        <UserInfoCell
          name={row.original.patient.name}
          email={row.original.patient.email}
          profilePhoto={row.original.patient.profilePhoto ?? undefined}
        />
      </div>
    ),
  },
  {
    id: "doctor.name",
    accessorKey: "doctor.name",
    header: "Doctor",
    cell: ({ row }) => (
      <div className="doctor-identity-cell">
        <UserInfoCell
          name={row.original.doctor.name}
          email={row.original.doctor.email}
          profilePhoto={row.original.doctor.profilePhoto ?? undefined}
        />
      </div>
    ),
  },
  {
    id: "rating",
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="doctor-rating-cell">
        <Star aria-hidden="true" className="fill-current" />
        {row.original.rating.toFixed(1)}
      </span>
    ),
  },
  {
    id: "comment",
    accessorKey: "comment",
    header: "Comment",
    enableSorting: false,
    cell: ({ row }) => (
      <p className="max-w-72 truncate text-sm text-muted-foreground" title={row.original.comment || "No written comment"}>
        {row.original.comment || "No written comment"}
      </p>
    ),
  },
  {
    id: "appointment.schedule.startDateTime",
    accessorKey: "appointment.schedule.startDateTime",
    header: "Appointment",
    cell: ({ row }) => row.original.appointment.schedule?.startDateTime ? (
      <DateCell
        date={row.original.appointment.schedule.startDateTime}
        formatString="MMM dd, yyyy hh:mm a"
      />
    ) : <span className="text-sm text-muted-foreground">Not available</span>,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Reviewed",
    cell: ({ row }) => <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />,
  },
];