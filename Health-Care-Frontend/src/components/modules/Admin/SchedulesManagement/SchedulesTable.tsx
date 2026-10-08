"use client"

import { useState } from "react"
import DataTable from "@/components/shared/table/DataTable"
import { useRowActionModalState } from "@/hooks/useRowActionModalState"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch"
import { getSchedules } from "@/services/schedule.services"
import { PaginationMeta } from "@/types/api.types"
import { type ISchedule } from "@/types/schedule.types"
import { useQuery } from "@tanstack/react-query"
import { CalendarRange, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { type RowSelectionState } from "@tanstack/react-table"
import CreateScheduleFormModal from "./CreateScheduleFormModal"
import DeleteScheduleConfirmationDialog from "./DeleteScheduleConfirmationDialog"
import EditScheduleFormModal from "./EditScheduleFormModal"
import BulkDeleteSchedulesConfirmationDialog from "./BulkDeleteSchedulesConfirmationDialog"
import ClearAllSchedulesConfirmationDialog from "./ClearAllSchedulesConfirmationDialog"
import { schedulesColumns } from "./schedulesColumns"
import ViewScheduleDialog from "./ViewScheduleDialog"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const QUERY_STALE_TIME = 1000 * 60
const QUERY_GC_TIME = 1000 * 60 * 60 * 6

const SchedulesTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
	const [isClearAllOpen, setIsClearAllOpen] = useState(false)

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

	const selectedScheduleIds = Object.keys(rowSelection).filter(
		(id) => rowSelection[id],
	)
	const selectedCount = selectedScheduleIds.length

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

			<div className="doctor-management-table space-y-4">
				{selectedCount > 0 && (
					<div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50/80 px-4 py-3 text-sm dark:border-red-900/40 dark:bg-red-950/30">
						<div className="flex items-center gap-2.5 text-red-900 dark:text-red-200">
							<span className="flex size-6 items-center justify-center rounded-full bg-red-200/80 text-xs font-bold text-red-800 dark:bg-red-900/80 dark:text-red-200">
								{selectedCount}
							</span>
							<span className="font-medium">
								{selectedCount} schedule{selectedCount > 1 ? "s" : ""} marked for deletion
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setRowSelection({})}
								className="h-8 text-xs text-muted-foreground hover:text-foreground"
							>
								Deselect all
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={() => setIsBulkDeleteOpen(true)}
								className="h-8 gap-1.5 shadow-xs"
							>
								<Trash2 className="h-3.5 w-3.5" />
								Delete marked ({selectedCount})
							</Button>
						</div>
					</div>
				)}

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
					rowSelection={{
						state: rowSelection,
						onRowSelectionChange: setRowSelection,
					}}
					getRowId={(row) => row.id}
					search={{
						initialValue: searchTermFromUrl,
						placeholder: "Search schedule by id or datetime...",
						debounceMs: 700,
						onDebouncedChange: handleDebouncedSearchChange,
					}}
					toolbarAction={
						<div className="flex items-center gap-2">
							{(meta?.total ?? schedules.length) > 0 && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setIsClearAllOpen(true)}
									className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/30"
								>
									<Trash2 className="h-4 w-4 mr-1.5" />
									Clear all schedules
								</Button>
							)}
							<CreateScheduleFormModal />
						</div>
					}
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

			<BulkDeleteSchedulesConfirmationDialog
				open={isBulkDeleteOpen}
				onOpenChange={setIsBulkDeleteOpen}
				selectedIds={selectedScheduleIds}
				onSuccess={() => setRowSelection({})}
			/>

			<ClearAllSchedulesConfirmationDialog
				open={isClearAllOpen}
				onOpenChange={setIsClearAllOpen}
				totalCount={meta?.total ?? schedules.length}
				onSuccess={() => setRowSelection({})}
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
