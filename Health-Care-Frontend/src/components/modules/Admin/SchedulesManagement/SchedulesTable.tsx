"use client"

import DataTable from "@/components/shared/table/DataTable"
import { useRowActionModalState } from "@/hooks/useRowActionModalState"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch"
import { getSchedules } from "@/services/schedule.services"
import { PaginationMeta } from "@/types/api.types"
import { type ISchedule } from "@/types/schedule.types"
import { useQuery } from "@tanstack/react-query"
import { CalendarRange } from "lucide-react"
import { useSearchParams } from "next/navigation"
import CreateScheduleFormModal from "./CreateScheduleFormModal"
import DeleteScheduleConfirmationDialog from "./DeleteScheduleConfirmationDialog"
import EditScheduleFormModal from "./EditScheduleFormModal"
import { schedulesColumns } from "./schedulesColumns"
import ViewScheduleDialog from "./ViewScheduleDialog"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const QUERY_STALE_TIME = 1000 * 60
const QUERY_GC_TIME = 1000 * 60 * 60 * 6

const SchedulesTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams()
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
	} = useRowActionModalState<ISchedule>()

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

	const { data: schedulesResponse, isLoading, isFetching } = useQuery({
		queryKey: ["schedules", queryString],
		queryFn: () => getSchedules(queryString),
		staleTime: QUERY_STALE_TIME,
		gcTime: QUERY_GC_TIME,
	})

	const schedules = schedulesResponse?.data ?? []
	const meta: PaginationMeta | undefined = schedulesResponse?.meta

	return (
		<div className="doctor-management">
			<header className="doctor-management-heading">
				<div className="doctor-management-mark" aria-hidden="true">
					<CalendarRange />
				</div>
				<div>
					<p className="doctor-management-eyebrow">Care operations</p>
					<h1>Schedules</h1>
					<p className="doctor-management-description">
						Manage appointment windows and doctor availability.
					</p>
				</div>
				<div className="doctor-management-count" aria-live="polite">
					<strong>{meta?.total ?? schedules.length}</strong>
					<span>schedule windows</span>
				</div>
			</header>

			<div className="doctor-management-table">
			<DataTable
				data={schedules}
				columns={schedulesColumns}
				actionMenuClassName="doctor-actions-menu"
				pageSizeMenuClassName="doctor-pagination-options"
				isLoading={isLoading || isFetching || isRouteRefreshPending}
				loadingMode="skeleton"
				emptyMessage="No schedules found."
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
					placeholder: "Search schedule by id or datetime...",
					debounceMs: 700,
					onDebouncedChange: handleDebouncedSearchChange,
				}}
				toolbarAction={<CreateScheduleFormModal />}
				meta={meta}
				actions={tableActions}
			/>
			</div>

			<EditScheduleFormModal
				open={isEditModalOpen}
				onOpenChange={onEditOpenChange}
				schedule={editingItem}
			/>

			<DeleteScheduleConfirmationDialog
				open={isDeleteDialogOpen}
				onOpenChange={onDeleteOpenChange}
				schedule={deletingItem}
			/>

			<ViewScheduleDialog
				open={isViewDialogOpen}
				onOpenChange={onViewOpenChange}
				schedule={viewingItem}
			/>
		</div>
	)
}

export default SchedulesTable
