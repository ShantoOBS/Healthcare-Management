import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import { IAdmin } from "@/types/admin.types";
import { ColumnDef } from "@tanstack/react-table";

export const adminColumns: ColumnDef<IAdmin>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Administrator",
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
    id: "user.role",
    accessorKey: "user.role",
    header: "Role",
    cell: ({ row }) => (
      <Badge className="border-[#dce9df] bg-[#f2f7f2] text-[#315a46]" variant="outline">
        {row.original.user.role === "SUPER_ADMIN" ? "Super admin" : "Admin"}
      </Badge>
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
    header: "Joined",
    cell: ({ row }) => (
      <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
    ),
  },
];