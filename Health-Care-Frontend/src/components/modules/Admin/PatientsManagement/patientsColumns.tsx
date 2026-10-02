import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { IPatient } from "@/types/patient.types";
import { ColumnDef } from "@tanstack/react-table";

export const patientColumns: ColumnDef<IPatient>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Patient",
    cell: ({ row }) => (
      <div className="doctor-identity-cell">
        <UserInfoCell
          name={row.original.name}
          email={row.original.email}
          profilePhoto={row.original.profilePhoto ?? undefined}
        />
      </div>
    ),
  },
  {
    id: "contactNumber",
    accessorKey: "contactNumber",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.contactNumber || "Not provided"}
      </span>
    ),
  },
  {
    id: "address",
    accessorKey: "address",
    header: "Address",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="max-w-56 truncate text-sm text-muted-foreground">
        {row.original.address || "Not provided"}
      </span>
    ),
  },
  {
    id: "user.status",
    accessorKey: "user.status",
    header: "Account status",
    cell: ({ row }) => (
      <span className="doctor-status-cell">
        <StatusBadgeCell status={row.original.user.status} />
      </span>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Registered",
    cell: ({ row }) => (
      <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
    ),
  },
];