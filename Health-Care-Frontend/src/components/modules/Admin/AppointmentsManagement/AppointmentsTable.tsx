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
import { getAllAppointments } from "@/services/appointment.services";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { appointmentColumns } from "./appointmentsColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const STATUS_FILTER_KEY = "status";
const PAYMENT_FILTER_KEY = "paymentStatus";
const APPOINTMENT_FILTER_DEFINITIONS = [
  serverManagedFilter.single(STATUS_FILTER_KEY),
  serverManagedFilter.single(PAYMENT_FILTER_KEY),
];
const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

const AppointmentsTable = ({ initialQueryString }: { initialQueryString: string }) => {
  const searchParams = useSearchParams();
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
      definitions: APPOINTMENT_FILTER_DEFINITIONS,
      updateParams,
    });

  const { data: appointmentResponse, isLoading, isFetching } = useQuery({
    queryKey: ["admin-appointments", queryString],
    queryFn: () => getAllAppointments(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });
  const appointments = appointmentResponse?.data ?? [];
  const meta: PaginationMeta | undefined = appointmentResponse?.meta;
  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => [
    {
      id: STATUS_FILTER_KEY,
      label: "Appointment status",
      type: "single-select",
      options: [
        { label: "Scheduled", value: "SCHEDULED" },
        { label: "In progress", value: "INPROGRESS" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Canceled", value: "CANCELED" },
      ],
    },
    {
      id: PAYMENT_FILTER_KEY,
      label: "Payment status",
      type: "single-select",
      options: [
        { label: "Paid", value: "PAID" },
        { label: "Unpaid", value: "UNPAID" },
      ],
    },
  ], []);
  const filterValuesForTable = useMemo<DataTableFilterValues>(() => ({
    [STATUS_FILTER_KEY]: filterValues[STATUS_FILTER_KEY],
    [PAYMENT_FILTER_KEY]: filterValues[PAYMENT_FILTER_KEY],
  }), [filterValues]);

  return (
    <div className="doctor-management">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true">
          <CalendarDays />
        </div>
        <div>
          <p className="doctor-management-eyebrow">Care operations</p>
          <h1>Appointments</h1>
          <p className="doctor-management-description">
            Review bookings, schedules, and payment status.
          </p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{meta?.total ?? appointments.length}</strong>
          <span>appointments</span>
        </div>
      </header>

      <div className="doctor-management-table">
        <DataTable
          data={appointments}
          columns={appointmentColumns}
          filterOptionMenuClassName="doctor-filter-options"
          filterPanelClassName="doctor-filter-panel"
          pageSizeMenuClassName="doctor-pagination-options"
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          loadingMode="skeleton"
          emptyMessage="No appointments found."
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
            placeholder: "Search by patient or doctor name...",
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
    </div>
  );
};

export default AppointmentsTable;