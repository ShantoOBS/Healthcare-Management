"use client"

import DataTable from "@/components/shared/table/DataTable"
import {
    DataTableFilterConfig,
    DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters"
import { useRowActionModalState } from "@/hooks/useRowActionModalState"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import {
    serverManagedFilter,
    useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters"
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch"
import { getMyDoctorSchedules } from "@/services/doctorSchedule.services"
import { PaginationMeta } from "@/types/api.types"
import { type IDoctorSchedule } from "@/types/doctorSchedule.types"
import { useQuery } from "@tanstack/react-query"
import { CalendarRange } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import BookScheduleModal from "./BookScheduleModal"
import DeleteMyScheduleConfirmationDialog from "./DeleteMyScheduleConfirmationDialog"
import { doctorSchedulesColumns } from "./doctorSchedulesColumns"
import ViewMyScheduleDialog from "./ViewMyScheduleDialog"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const QUERY_STALE_TIME = 1000 * 60
const QUERY_GC_TIME = 1000 * 60 * 60 * 6

const DOCTOR_SCHEDULE_FILTER_DEFINITIONS = [
	serverManagedFilter.single("isBooked"),
]

const DoctorSchedulesTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams()
	const {
		viewingItem,
		deletingItem,
		isViewDialogOpen,
		isDeleteDialogOpen,
		onViewOpenChange,
		onDeleteOpenChange,
		tableActions,
	} = useRowActionModalState<IDoctorSchedule>({ enableEdit: false })

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

	const {
		searchTermFromUrl,
		handleDebouncedSearchChange,
	} = useServerManagedDataTableSearch({
		searchParams,
		updateParams,
	})

	const {
		filterValues,
		handleFilterChange,
		clearAllFilters,
	} = useServerManagedDataTableFilters({
		searchParams,
		definitions: DOCTOR_SCHEDULE_FILTER_DEFINITIONS,
		updateParams,
	})

	const {
		data: doctorSchedulesResponse,
		isLoading,
		isFetching,
		isError,
	} = useQuery({
		queryKey: ["my-doctor-schedules", queryString],
		queryFn: () => getMyDoctorSchedules(queryString),
		staleTime: QUERY_STALE_TIME,
		gcTime: QUERY_GC_TIME,
	})

	const doctorSchedules = doctorSchedulesResponse?.data ?? []
	const meta: PaginationMeta | undefined = doctorSchedulesResponse?.meta

	const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
		return [
			{
				id: "isBooked",
				label: "Status",
				type: "single-select",
				options: [
					{ label: "Booked", value: "true" },
					{ label: "Available", value: "false" },
				],
			},
		]
	}, [])

	const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
		return {
			isBooked: filterValues.isBooked,
		}
	}, [filterValues])

	return (
		<>
			<div className="doctor-management">
				<header className="doctor-management-heading">
					<div className="doctor-management-mark" aria-hidden="true">
						<CalendarRange />
					</div>
					<div>
						<p className="doctor-management-eyebrow">Care practice</p>
						<h1>My schedules</h1>
						<p className="doctor-management-description">
							Track your assigned slots and book upcoming availability.
						</p>
					</div>
					<div className="doctor-management-count" aria-live="polite">
						<strong>{meta?.total ?? doctorSchedules.length}</strong>
						<span>assigned slots</span>
					</div>
				</header>

				<div className="doctor-management-table space-y-4">
					{isError ? (
						<div
							role="alert"
							className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
						>
							Your schedules could not be loaded. Refresh the page to try again.
						</div>
					) : (
						<DataTable
							data={doctorSchedules}
							columns={doctorSchedulesColumns}
							isLoading={isLoading || isFetching || isRouteRefreshPending}
							loadingMode="skeleton"
							emptyMessage="No schedules assigned yet."
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
								placeholder: "Search by doctor id, schedule id...",
								debounceMs: 700,
								onDebouncedChange: handleDebouncedSearchChange,
							}}
							filters={{
								configs: filterConfigs,
								values: filterValuesForTable,
								onFilterChange: handleFilterChange,
								onClearAll: clearAllFilters,
							}}
							toolbarAction={<BookScheduleModal />}
							meta={meta}
							actions={tableActions}
						/>
					)}
				</div>
			</div>

			<DeleteMyScheduleConfirmationDialog
				open={isDeleteDialogOpen}
				onOpenChange={onDeleteOpenChange}
				doctorSchedule={deletingItem}
			/>

			<ViewMyScheduleDialog
				open={isViewDialogOpen}
				onOpenChange={onViewOpenChange}
				doctorSchedule={viewingItem}
			/>
		</>
	)
}

export default DoctorSchedulesTable
