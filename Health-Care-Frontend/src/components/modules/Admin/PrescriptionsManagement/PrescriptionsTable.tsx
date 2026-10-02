"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllPrescriptions } from "@/services/prescription.services";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { prescriptionColumns } from "./prescriptionsColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

const PrescriptionsTable = ({ initialQueryString }: { initialQueryString: string }) => {
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

  const { data: prescriptionResponse, isLoading, isFetching } = useQuery({
    queryKey: ["admin-prescriptions", queryString],
    queryFn: () => getAllPrescriptions(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });
  const prescriptions = prescriptionResponse?.data ?? [];
  const meta: PaginationMeta | undefined = prescriptionResponse?.meta;

  return (
    <div className="doctor-management">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true">
          <FileText />
        </div>
        <div>
          <p className="doctor-management-eyebrow">Care records</p>
          <h1>Prescriptions</h1>
          <p className="doctor-management-description">
            Review patient instructions, follow-ups, and prescription documents.
          </p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{meta?.total ?? prescriptions.length}</strong>
          <span>prescriptions</span>
        </div>
      </header>

      <div className="doctor-management-table">
        <DataTable
          data={prescriptions}
          columns={prescriptionColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          loadingMode="skeleton"
          emptyMessage="No prescriptions found."
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
          meta={meta}
        />
      </div>
    </div>
  );
};

export default PrescriptionsTable;