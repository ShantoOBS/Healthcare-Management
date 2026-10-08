"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllSpecialties } from "@/services/specialty.services";
import { PaginationMeta } from "@/types/api.types";
import { ISpecialty } from "@/types/specialty.types";
import { useQuery } from "@tanstack/react-query";
import { Plus, Stethoscope } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateSpecialtyModal from "./CreateSpecialtyModal";
import DeleteSpecialtyConfirmationDialog from "./DeleteSpecialtyConfirmationDialog";
import { specialtiesColumns } from "./specialtiesColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

interface SpecialtiesTableProps {
  initialQueryString: string;
}

export default function SpecialtiesTable({ initialQueryString }: SpecialtiesTableProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const searchParams = useSearchParams();

  const {
    deletingItem,
    isDeleteDialogOpen,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<ISpecialty>({
    enableView: false,
    enableEdit: false,
    enableDelete: true,
  });

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({ searchParams, updateParams });

  const { data: specialtiesResponse, isLoading, isFetching } = useQuery({
    queryKey: ["specialties", queryString],
    queryFn: () => getAllSpecialties(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });

  const specialties = specialtiesResponse?.data ?? [];
  const meta: PaginationMeta | undefined = specialtiesResponse?.meta;

  return (
    <div className="doctor-management">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true">
          <Stethoscope />
        </div>
        <div>
          <p className="doctor-management-eyebrow">Clinical taxonomy</p>
          <h1>Specialties</h1>
          <p className="doctor-management-description">
            Manage medical departments and their directory icons.
          </p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{meta?.total ?? specialties.length}</strong>
          <span>specialties</span>
        </div>
      </header>

      <div className="doctor-management-table">
        <DataTable
          data={specialties}
          columns={specialtiesColumns}
          actions={tableActions}
          actionMenuClassName="doctor-actions-menu"
          pageSizeMenuClassName="doctor-pagination-options"
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          loadingMode="skeleton"
          emptyMessage="No specialties found."
          sorting={{
            state: optimisticSortingState,
            onSortingChange: handleSortingChange,
          }}
          pagination={{
            state: optimisticPaginationState,
            onPaginationChange: handlePaginationChange,
          }}
          search={{
            initialValue: searchTermFromUrl,
            placeholder: "Search specialties by title or description...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          toolbarAction={
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add specialty
            </Button>
          }
          meta={meta}
        />
      </div>

      <CreateSpecialtyModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <DeleteSpecialtyConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        specialty={deletingItem}
      />
    </div>
  );
}
