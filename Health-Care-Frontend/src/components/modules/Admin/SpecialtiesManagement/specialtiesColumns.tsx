import DateCell from "@/components/shared/cell/DateCell";
import { ISpecialty } from "@/types/specialty.types";
import { ColumnDef } from "@tanstack/react-table";
import { Stethoscope } from "lucide-react";
import Image from "next/image";

export const specialtiesColumns: ColumnDef<ISpecialty>[] = [
  {
    id: "icon",
    header: "Icon",
    enableSorting: false,
    cell: ({ row }) => {
      const icon = row.original.icon;
      const title = row.original.title;

      return (
        <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-lg border border-[#e5ebe7] bg-[#f5f8f6]">
          {icon ? (
            <Image
              src={icon}
              alt={title}
              fill
              className="object-contain p-1.5"
              unoptimized
            />
          ) : (
            <Stethoscope className="size-5 text-[#1f5c4b]" />
          )}
        </div>
      );
    },
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Specialty",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-[#17372d]">{row.original.title}</span>
        {row.original.description && (
          <span className="line-clamp-1 max-w-md text-xs text-muted-foreground">
            {row.original.description}
          </span>
        )}
      </div>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      if (!row.original.createdAt) {
        return <span className="text-sm text-muted-foreground">N/A</span>;
      }
      return <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />;
    },
  },
];
