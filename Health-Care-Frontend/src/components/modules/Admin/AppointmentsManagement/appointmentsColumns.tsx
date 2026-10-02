import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import { IAppointment } from "@/types/appointment.types";
import { ColumnDef } from "@tanstack/react-table";

const appointmentStatusStyle: Record<string, string> = {
  SCHEDULED: "border-[#dce9df] bg-[#f2f7f2] text-[#315a46]",
  INPROGRESS: "border-[#d8e6ea] bg-[#f0f7f8] text-[#315d67]",
  COMPLETED: "border-[#d7ebdc] bg-[#eef8f0] text-[#28613d]",
  CANCELED: "border-[#f1d8d2] bg-[#fff5f2] text-[#a73d2b]",
};

const paymentStatusStyle: Record<string, string> = {
  PAID: "border-[#d7ebdc] bg-[#eef8f0] text-[#28613d]",
  UNPAID: "border-[#f1e8c8] bg-[#fffaf0] text-[#755d1e]",
  FAILED: "border-[#f1d8d2] bg-[#fff5f2] text-[#a73d2b]",
};

const getStatusLabel = (value?: string) => {
  if (!value) return "Unknown";
  return value === "INPROGRESS" ? "In progress" : value.toLowerCase().replace(/^./, (letter) => letter.toUpperCase());
};

export const appointmentColumns: ColumnDef<IAppointment>[] = [
  {
    id: "patient.name",
    accessorKey: "patient.name",
    header: "Patient",
    cell: ({ row }) => (
      <div className="doctor-identity-cell">
        <UserInfoCell
          name={row.original.patient?.name || "Unknown patient"}
          email={row.original.patient?.email || "No email listed"}
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
          name={row.original.doctor?.name || "Unknown doctor"}
          email={row.original.doctor?.email || "No email listed"}
          profilePhoto={row.original.doctor?.profilePhoto}
        />
      </div>
    ),
  },
  {
    id: "schedule.startDateTime",
    accessorKey: "schedule.startDateTime",
    header: "Scheduled for",
    cell: ({ row }) => row.original.schedule?.startDateTime ? (
      <DateCell date={row.original.schedule.startDateTime} formatString="MMM dd, yyyy hh:mm a" />
    ) : <span className="text-sm text-muted-foreground">Not scheduled</span>,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Appointment",
    cell: ({ row }) => {
      const status = row.original.status?.toUpperCase() ?? "UNKNOWN";
      return (
        <Badge className={`appointment-status-badge ${appointmentStatusStyle[status] ?? "border-border bg-muted text-muted-foreground"}`} variant="outline">
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    id: "paymentStatus",
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.original.paymentStatus?.toUpperCase() ?? "UNKNOWN";
      return (
        <Badge className={`appointment-status-badge ${paymentStatusStyle[status] ?? "border-border bg-muted text-muted-foreground"}`} variant="outline">
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Booked",
    cell: ({ row }) => row.original.createdAt ? (
      <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
    ) : <span className="text-sm text-muted-foreground">N/A</span>,
  },
];