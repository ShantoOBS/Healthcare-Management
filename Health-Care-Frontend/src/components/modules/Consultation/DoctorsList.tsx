"use client"

import DataTableFilters, {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters"
import BookAppointmentModal from "@/components/modules/Patient/Appointments/BookAppointmentModal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import {
  serverManagedFilter,
  useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters"
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch"
import { getAllSpecialties, getDoctors } from "@/services/doctor.services"
import { type IDoctor } from "@/types/doctor.types"
import { type ISpecialty } from "@/types/specialty.types"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 12
const SPECIALTIES_FILTER_KEY = "specialties.specialty.title"
const APPOINTMENT_FEE_FILTER_KEY = "appointmentFee"
const CONSULTATION_ALLOWED_QUERY_KEYS = new Set([
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "searchTerm",
  "gender",
  SPECIALTIES_FILTER_KEY,
  `${APPOINTMENT_FEE_FILTER_KEY}[gte]`,
  `${APPOINTMENT_FEE_FILTER_KEY}[lte]`,
])

const CONSULTATION_FILTER_DEFINITIONS = [
  serverManagedFilter.single("gender"),
  serverManagedFilter.multi(SPECIALTIES_FILTER_KEY),
  serverManagedFilter.range(APPOINTMENT_FEE_FILTER_KEY),
]

const getSanitizedConsultationQueryString = (queryString: string) => {
  const currentParams = new URLSearchParams(queryString)
  const sanitizedParams = new URLSearchParams()

  currentParams.forEach((value, key) => {
    if (!CONSULTATION_ALLOWED_QUERY_KEYS.has(key)) {
      return
    }

    const normalizedValue = value.trim()
    if (!normalizedValue) {
      return
    }

    if (key === SPECIALTIES_FILTER_KEY) {
      sanitizedParams.append(key, normalizedValue)
      return
    }

    sanitizedParams.set(key, normalizedValue)
  })

  return sanitizedParams.toString()
}

const getDoctorInitials = (name: string) => {
  const parts = name.trim().split(/\s+/)
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "")
  return initials.join("") || "DR"
}

const Pagination = ({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  isLoading: boolean
  onPageChange: (page: number) => void
}) => {
  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isLoading || currentPage <= 1}
      >
        Prev
      </Button>

      {pageNumbers.map((page) => (
        <Button
          key={page}
          type="button"
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => onPageChange(page)}
          disabled={isLoading}
        >
          {page}
        </Button>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLoading || currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  )
}

const DoctorsList = ({
  initialQueryString,
  isAuthenticated,
  viewerRole,
}: {
  initialQueryString: string
  isAuthenticated: boolean
  viewerRole?: string | null
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

  const queryString = useMemo(() => {
    return getSanitizedConsultationQueryString(queryStringFromUrl || initialQueryString)
  }, [initialQueryString, queryStringFromUrl])

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
    definitions: CONSULTATION_FILTER_DEFINITIONS,
    updateParams,
  })

  const { data: doctorsResponse, isLoading, isFetching } = useQuery({
    queryKey: ["doctors", queryString],
    queryFn: () => getDoctors(queryString),
  })

  const { data: specialtiesResponse } = useQuery({
    queryKey: ["specialties"],
    queryFn: getAllSpecialties,
    staleTime: 1000 * 60 * 60 * 6,
    gcTime: 1000 * 60 * 60 * 24,
  })

  const doctors = doctorsResponse?.data ?? []
  const meta = doctorsResponse?.meta
  const specialties = useMemo(() => specialtiesResponse?.data ?? [], [specialtiesResponse?.data])

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    return [
      {
        id: "gender",
        label: "Gender",
        type: "single-select",
        options: [
          { label: "Male", value: "MALE" },
          { label: "Female", value: "FEMALE" },
          { label: "Other", value: "OTHER" },
        ],
      },
      {
        id: SPECIALTIES_FILTER_KEY,
        label: "Specialties",
        type: "multi-select",
        options: specialties.map((specialty: ISpecialty) => ({
          label: specialty.title,
          value: specialty.title,
        })),
      },
      {
        id: APPOINTMENT_FEE_FILTER_KEY,
        label: "Fee Range",
        type: "range",
      },
    ]
  }, [specialties])

  const filterValuesForControls = useMemo<DataTableFilterValues>(() => {
    return {
      gender: filterValues.gender,
      [SPECIALTIES_FILTER_KEY]: filterValues[SPECIALTIES_FILTER_KEY],
      [APPOINTMENT_FEE_FILTER_KEY]: filterValues[APPOINTMENT_FEE_FILTER_KEY],
    }
  }, [filterValues])

  const isBusy = isLoading || isFetching || isRouteRefreshPending

  return (
    <section className="min-h-screen max-w-[1280px] mx-auto py-5
           px-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid  gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <aside className="rounded-sm border border-[#dfe5e1] bg-white p-6 shadow-[0_0_0_1px_rgba(18,26,22,0.02)]">
          <div className="space-y-6">
            <div className="border-b border-[#dfe5e2] pb-4">
              <label className="block text-[15px] font-medium text-[#1a2b27]">Department</label>
              <Select
                value={Array.isArray(filterValues[SPECIALTIES_FILTER_KEY]) ? filterValues[SPECIALTIES_FILTER_KEY]?.[0] ?? "all" : (filterValues[SPECIALTIES_FILTER_KEY] as string | undefined) ?? "all"}
                onValueChange={(value) => {
                  handleFilterChange(
                    SPECIALTIES_FILTER_KEY,
                    value === "all" ? undefined : [value],
                  )
                }}
              >
                <SelectTrigger className="mt-3 h-12 w-full border-0 border-b border-[#d2d9d5] bg-transparent px-0 text-[18px] font-semibold text-[#0f1d1a] shadow-none focus:ring-0">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All specialties</SelectItem>
                  {specialties.map((specialty: ISpecialty) => (
                    <SelectItem key={specialty.id} value={specialty.title}>
                      {specialty.title.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border-b border-[#dfe5e2] pb-4">
              <label className="block text-[15px] font-medium text-[#1a2b27]">Doctor&apos;s Name</label>
              <Input
                value={searchTermFromUrl ?? ""}
                onChange={(event) => handleDebouncedSearchChange(event.target.value)}
                placeholder="Type doctor's name"
                className="mt-3 h-12 border-0 border-b border-[#d2d9d5] bg-transparent px-0 text-[16px] shadow-none focus-visible:ring-0"
                disabled={isBusy}
              />
            </div>

            <Button
              type="button"
              className="h-12 w-full rounded-[12px] bg-[#4ca27a] text-[15px] font-semibold tracking-[0.08em] text-white shadow-[0_10px_25px_rgba(76,162,122,0.25)] hover:bg-[#3f8d68]"
              onClick={() => handleDebouncedSearchChange(searchTermFromUrl ?? "")}
            >
              SEARCH
            </Button>
          </div>
        </aside>

        <div className="space-y-6">
          {isBusy && (
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              Loading doctors...
            </div>
          )}

          {!isBusy && doctors.length === 0 && (
            <div className="rounded-[18px] border border-dashed border-[#d4ddd7] bg-white/50 p-8 text-center text-sm text-[#516961]">
              No doctors found for your current search/filter.
            </div>
          )}

          {!isBusy && doctors.length > 0 && (
            <>
              <div className="space-y-5">
                {doctors.map((doctor: IDoctor) => {
                  const specialtiesList = doctor.specialties?.map((item) => item.specialty.title) ?? []

                  return (
                    <article
                      key={String(doctor.id)}
                      className="flex flex-col gap-4 rounded-sm border
                       border-[#dee7e1] bg-white p-4 shadow-[0_8px_28px_rgba(24,39,33,0.03)] md:flex-row md:items-center md:p-5"
                    >
                      <div className="overflow-hidden rounded-[14px] bg-[#eef3ef] md:w-[260px]">
                        <Avatar className="h-[260px] w-full rounded-none md:h-[220px]">
                          <AvatarImage src={doctor.profilePhoto} alt={doctor.name} className="h-full w-full object-cover" />
                          <AvatarFallback className="h-full w-full rounded-none bg-[#e8efe9] text-3xl text-[#17382f]">
                            {getDoctorInitials(doctor.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-[22px] font-medium leading-[1.1] tracking-[-0.05em] text-[#d93d3d] sm:text-[30px]">
                          {doctor.name}
                        </h3>

                        <div className="mt-3 space-y-2 text-[15px] leading-7 text-[#31473f]">
                          <p>
                            <span className="font-medium text-[#1f2d29]">Speciality - </span>
                            {specialtiesList[0] ?? "Consultant"}
                          </p>

                          <p>
                            <span className="font-medium text-[#1f2d29]">Degree - </span>
                            {doctor.designation || "Medical Specialist"}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <Button type="button" className="h-12 rounded-[12px] bg-[#4ca27a] px-6 text-sm font-semibold tracking-[0.02em] text-white hover:bg-[#3f8d68]">
                            Get Appointment
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 rounded-[12px] border border-[#4ca27a] bg-transparent px-6 text-sm font-semibold tracking-[0.02em] text-[#1d453a] hover:bg-[#edf7f1]"
                            asChild
                          >
                            <Link href={`/consultation/doctor/${doctor.id}`}>
                              Doctor&apos;s Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="space-y-3 pt-2">
                <Pagination
                  currentPage={optimisticPaginationState.pageIndex + 1}
                  totalPages={meta?.totalPages ?? 1}
                  isLoading={isBusy}
                  onPageChange={(page) => {
                    handlePaginationChange({
                      pageIndex: page - 1,
                      pageSize: optimisticPaginationState.pageSize,
                    })
                  }}
                />

                <p className="text-center text-sm text-muted-foreground">
                  Total {meta?.total ?? doctors.length} doctors
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default DoctorsList