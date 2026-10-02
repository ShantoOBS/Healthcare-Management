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
import { getAllReviews } from "@/services/review.services";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { reviewColumns } from "./reviewsColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const RATING_FILTER_KEY = "rating";
const REVIEW_FILTER_DEFINITIONS = [serverManagedFilter.range(RATING_FILTER_KEY)];
const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

const ReviewsTable = ({ initialQueryString }: { initialQueryString: string }) => {
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
      definitions: REVIEW_FILTER_DEFINITIONS,
      updateParams,
    });

  const { data: reviewResponse, isLoading, isFetching } = useQuery({
    queryKey: ["admin-reviews", queryString],
    queryFn: () => getAllReviews(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });
  const reviews = reviewResponse?.data ?? [];
  const meta: PaginationMeta | undefined = reviewResponse?.meta;
  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => [
    { id: RATING_FILTER_KEY, label: "Rating range", type: "range" },
  ], []);
  const filterValuesForTable = useMemo<DataTableFilterValues>(() => ({
    [RATING_FILTER_KEY]: filterValues[RATING_FILTER_KEY],
  }), [filterValues]);

  return (
    <div className="doctor-management">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true">
          <MessageSquareText />
        </div>
        <div>
          <p className="doctor-management-eyebrow">Patient feedback</p>
          <h1>Reviews</h1>
          <p className="doctor-management-description">
            Review patient ratings and comments across the care team.
          </p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{meta?.total ?? reviews.length}</strong>
          <span>reviews</span>
        </div>
      </header>

      <div className="doctor-management-table">
        <DataTable
          data={reviews}
          columns={reviewColumns}
          filterOptionMenuClassName="doctor-filter-options"
          filterPanelClassName="doctor-filter-panel"
          pageSizeMenuClassName="doctor-pagination-options"
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          loadingMode="skeleton"
          emptyMessage="No reviews found."
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
            placeholder: "Search by patient, doctor, or comment...",
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

export default ReviewsTable;