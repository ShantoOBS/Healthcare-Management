import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Button } from "@/components/ui/button";
import { IAdminPrescription } from "@/types/prescription.types";
import { ColumnDef } from "@tanstack/react-table";
import { differenceInMinutes } from "date-fns";
import { ExternalLink, FileText } from "lucide-react";

const getAppointmentWindow = (prescription: IAdminPrescription) => {
  const start = prescription.appointment.schedule?.startDateTime;
  const end = prescription.appointment.schedule?.endDateTime;
  if (!start || !end) return "Schedule unavailable";

  const duration = differenceInMinutes(new Date(end), new Date(start));
  if (duration <= 0) return "Invalid schedule";
  return `${duration} min appointment`;
};

export const prescriptionColumns: ColumnDef<IAdminPrescription>[] = [
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
    header: "Prescribed by",
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
    id: "appointment.schedule.startDateTime",
    accessorKey: "appointment.schedule.startDateTime",
    header: "Appointment",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.appointment.schedule?.startDateTime ? (
          <DateCell
            date={row.original.appointment.schedule.startDateTime}
            formatString="MMM dd, yyyy hh:mm a"
          />
        ) : (
          <span className="text-sm text-muted-foreground">Not available</span>
        )}
        <span className="text-xs text-muted-foreground">
          {getAppointmentWindow(row.original)}
        </span>
      </div>
    ),
  },
  {
    id: "followUpDate",
    accessorKey: "followUpDate",
    header: "Follow-up",
    cell: ({ row }) => (
      <DateCell date={row.original.followUpDate} formatString="MMM dd, yyyy" />
    ),
  },
  {
    id: "instructions",
    accessorKey: "instructions",
    header: "Instructions",
    enableSorting: false,
    cell: ({ row }) => (
      <p className="max-w-64 truncate text-sm text-muted-foreground" title={row.original.instructions}>
        {row.original.instructions}
      </p>
    ),
  },
  {
    id: "pdfUrl",
    header: "Document",
    enableSorting: false,
    cell: ({ row }) => row.original.pdfUrl ? (
      <Button asChild variant="outline" size="icon-sm" aria-label="Open prescription PDF" title="Open prescription PDF">
        <a href={row.original.pdfUrl} target="_blank" rel="noreferrer">
          <FileText aria-hidden="true" />
          <ExternalLink aria-hidden="true" />
        </a>
      </Button>
    ) : (
      <span className="text-sm text-muted-foreground">Unavailable</span>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Issued",
    cell: ({ row }) => (
      <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
    ),
  },
];