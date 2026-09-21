import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/doctor.types";

interface IStatusBadgeCellProps {
    status?: UserStatus | string;
}

const StatusBadgeCell = ({ status }: IStatusBadgeCellProps) => {
  const normalizedStatus = status?.toUpperCase?.() ?? "unknown";
  const variant =
    normalizedStatus === UserStatus.ACTIVE
      ? "default"
      : normalizedStatus === UserStatus.BLOCKED
        ? "destructive"
        : "secondary";

  return (
    <Badge variant={variant}>
      <span className="text-sm capitalize">{normalizedStatus.toLowerCase()}</span>
    </Badge>
  );
};

export default StatusBadgeCell