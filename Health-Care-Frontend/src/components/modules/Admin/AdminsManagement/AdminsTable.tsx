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
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { getAdmins } from "@/services/admin.services";
import { PaginationMeta } from "@/types/api.types";
import { IAdmin } from "@/types/admin.types";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CreateAdminFormModal from "./CreateAdminFormModal";
import DeleteAdminConfirmationDialog from "./DeleteAdminConfirmationDialog";
import EditAdminFormModal from "./EditAdminFormModal";
import { adminColumns } from "./adminsColumns";
import ViewAdminProfileDialog from "./ViewAdminProfileDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const ROLE_FILTER_KEY = "user.role";
const STATUS_FILTER_KEY = "user.status";
const ADMIN_FILTER_DEFINITIONS = [
  serverManagedFilter.single(ROLE_FILTER_KEY),
  serverManagedFilter.single(STATUS_FILTER_KEY),
];
const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

const AdminsTable = ({
  initialQueryString,
  canManageAdmins,
}: {
  initialQueryString: string;
  canManageAdmins: boolean;
}) => {
  const searchParams = useSearchParams();
  const rowActions = useRowActionModalState<IAdmin>({
    enableEdit: canManageAdmins,
    enableDelete: canManageAdmins,
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
  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: ADMIN_FILTER_DEFINITIONS,
      updateParams,
    });

  const { data: adminResponse, isLoading, isFetching } = useQuery({
    queryKey: ["admins", queryString],
    queryFn: () => getAdmins(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });

  const admins = adminResponse?.data ?? [];
  const meta: PaginationMeta | undefined = adminResponse?.meta;
  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => [
    {
      id: ROLE_FILTER_KEY,
      label: "Role",
      type: "single-select",
      options: [
        { label: "Admin", value: "ADMIN" },
        { label: "Super admin", value: "SUPER_ADMIN" },
      ],
    },
    {
      id: STATUS_FILTER_KEY,
      label: "Status",
      type: "single-select",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Blocked", value: "BLOCKED" },
      ],
    },
  ], []);
  const filterValuesForTable = useMemo<DataTableFilterValues>(() => ({
    [ROLE_FILTER_KEY]: filterValues[ROLE_FILTER_KEY],
    [STATUS_FILTER_KEY]: filterValues[STATUS_FILTER_KEY],
  }), [filterValues]);

  return (
    <div className="doctor-management">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true">
          <ShieldCheck />
        </div>
        <div>
          <p className="doctor-management-eyebrow">Access directory</p>
          <h1>Admins</h1>
          <p className="doctor-management-description">
            Review administrator accounts, roles, and access status.
          </p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{meta?.total ?? admins.length}</strong>
          <span>administrator accounts</span>
        </div>
      </header>

      <div className="doctor-management-table">
        <DataTable
          data={admins}
          columns={adminColumns}
          actions={rowActions.tableActions}
          actionMenuClassName="doctor-actions-menu"
          filterOptionMenuClassName="doctor-filter-options"
          filterPanelClassName="doctor-filter-panel"
          pageSizeMenuClassName="doctor-pagination-options"
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          loadingMode="skeleton"
          emptyMessage="No administrators found."
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
            placeholder: "Search admins by name, email, contact...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          filters={{
            configs: filterConfigs,
            values: filterValuesForTable,
            onFilterChange: handleFilterChange,
            onClearAll: clearAllFilters,
          }}
          toolbarAction={canManageAdmins ? <CreateAdminFormModal /> : undefined}
          meta={meta}
        />
      </div>

      <ViewAdminProfileDialog
        open={rowActions.isViewDialogOpen}
        onOpenChange={rowActions.onViewOpenChange}
        admin={rowActions.viewingItem}
      />
      {canManageAdmins && (
        <>
          <EditAdminFormModal
            open={rowActions.isEditModalOpen}
            onOpenChange={rowActions.onEditOpenChange}
            admin={rowActions.editingItem}
          />
          <DeleteAdminConfirmationDialog
            open={rowActions.isDeleteDialogOpen}
            onOpenChange={rowActions.onDeleteOpenChange}
            admin={rowActions.deletingItem}
          />
        </>
      )}
    </div>
  );
};

export default AdminsTable;