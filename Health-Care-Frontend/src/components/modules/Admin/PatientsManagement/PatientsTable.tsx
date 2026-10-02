"use client";

import DataTable from "@/components/shared/table/DataTable";
import {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";
import {
  serverManagedFilter,
  useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { getPatients } from "@/services/patient.services";
import { PaginationMeta } from "@/types/api.types";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { IPatient } from "@/types/patient.types";
import { useQuery } from "@tanstack/react-query";
import { UsersRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import DeletePatientConfirmationDialog from "./DeletePatientConfirmationDialog";
import EditPatientFormModal from "./EditPatientFormModal";
import { patientColumns } from "./patientsColumns";
import ViewPatientProfileDialog from "./ViewPatientProfileDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const STATUS_FILTER_KEY = "user.status";
const PATIENT_FILTER_DEFINITIONS = [serverManagedFilter.single(STATUS_FILTER_KEY)];
const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

const PatientsTable = ({ initialQueryString }: { initialQueryString: string }) => {
  const searchParams = useSearchParams();
  const {
    viewingItem,
    editingItem,
    deletingItem,
    isViewDialogOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onEditOpenChange,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<IPatient>();
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
  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: PATIENT_FILTER_DEFINITIONS,
      updateParams,
    });

  const { data: patientResponse, isLoading, isFetching } = useQuery({
    queryKey: ["patients", queryString],
    queryFn: () => getPatients(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });

  const patients = patientResponse?.data ?? [];
  const meta: PaginationMeta | undefined = patientResponse?.meta;
  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => [
    {
      id: STATUS_FILTER_KEY,
      label: "Account status",
      type: "single-select",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Blocked", value: "BLOCKED" },
      ],
    },
  ], []);
  const filterValuesForTable = useMemo<DataTableFilterValues>(() => ({
    [STATUS_FILTER_KEY]: filterValues[STATUS_FILTER_KEY],
  }), [filterValues]);

  return (
    <div className="doctor-management">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true">
          <UsersRound />
        </div>
        <div>
          <p className="doctor-management-eyebrow">Patient directory</p>
          <h1>Patients</h1>
          <p className="doctor-management-description">
            Review patient contact details and account status.
          </p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{meta?.total ?? patients.length}</strong>
          <span>registered patients</span>
        </div>
      </header>

      <div className="doctor-management-table">
        <DataTable
          data={patients}
          columns={patientColumns}
          actions={tableActions}
          actionMenuClassName="doctor-actions-menu"
          filterOptionMenuClassName="doctor-filter-options"
          filterPanelClassName="doctor-filter-panel"
          pageSizeMenuClassName="doctor-pagination-options"
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          loadingMode="skeleton"
          emptyMessage="No patients found."
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
            placeholder: "Search patients by name, email, contact...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          filters={{
            configs: filterConfigs,
            values: filterValuesForTable,
            onFilterChange: handleFilterChange,
            onClearAll: clearAllFilters,
          }}
          meta={meta}
        />
      </div>

      <ViewPatientProfileDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        patient={viewingItem}
      />
      <EditPatientFormModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        patient={editingItem}
      />
      <DeletePatientConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        patient={deletingItem}
      />
    </div>
  );
};

export default PatientsTable;