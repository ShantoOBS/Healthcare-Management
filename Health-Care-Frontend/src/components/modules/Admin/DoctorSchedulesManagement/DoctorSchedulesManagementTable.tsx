"use client"

import DataTable from "@/components/shared/table/DataTable"
import {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters"
import { serverManagedFilter, useServerManagedDataTableFilters } from "@/hooks/useServerManagedDataTableFilters"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch"
import { getDoctorSchedules } from "@/services/doctorSchedule.services"
import { type PaginationMeta } from "@/types/api.types"
import { useQuery } from "@tanstack/react-query"
import { CalendarClock } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { doctorSchedulesManagementColumns } from "./doctorSchedulesManagementColumns"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const QUERY_STALE_TIME = 1000 * 60
const QUERY_GC_TIME = 1000 * 60 * 60 * 6
const FILTER_DEFINITIONS = [serverManagedFilter.single("isBooked")]

const DoctorSchedulesManagementTable = ({
  initialQueryString,
}: {
  initialQueryString: string
}) => {
  const searchParams = useSearchParams()
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
  })
  const queryString = queryStringFromUrl || initialQueryString

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({ searchParams, updateParams })
  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: FILTER_DEFINITIONS,
      updateParams,
    })

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["doctor-schedules", queryString],
    queryFn: () => getDoctorSchedules(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  const doctorSchedules = response?.data ?? []
  const meta: PaginationMeta | undefined = response?.meta
  const filterConfigs = useMemo<DataTableFilterConfig[]>(
    () => [
      {
        id: "isBooked",
        label: "Status",
        type: "single-select",
        options: [
          { label: "Booked", value: "true" },
          { label: "Available", value: "false" },
        ],
      },
    ],
    [],
  )
  const filterValuesForTable = useMemo<DataTableFilterValues>(
    () => ({ isBooked: filterValues.isBooked }),
    [filterValues],
  )
  return (
    <div className="doctor-management">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true">
          <CalendarClock />
        </div>
        <div>
          <p className="doctor-management-eyebrow">Care operations</p>
          <h1>Doctor Schedules</h1>
          <p className="doctor-management-description">
            Review doctor assignments and see which schedule slots are booked.
          </p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{meta?.total ?? doctorSchedules.length}</strong>
          <span>doctor schedule assignments</span>
        </div>
      </header>

      <div className="doctor-management-table">
        {isError ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            Doctor schedules could not be loaded. Refresh the page to try again.
          </div>
        ) : (
          <DataTable
            data={doctorSchedules}
            columns={doctorSchedulesManagementColumns}
            actionMenuClassName="doctor-actions-menu"
            pageSizeMenuClassName="doctor-pagination-options"
            isLoading={isLoading || isFetching || isRouteRefreshPending}
            loadingMode="skeleton"
            emptyMessage="No doctor schedule assignments found."
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
              placeholder: "Search doctor schedule by doctor or schedule id...",
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
        )}
      </div>
    </div>
  )
}

export default DoctorSchedulesManagementTable
