"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { getAllSpecialties, getDoctors } from "@/services/doctor.services"
import { type IDoctor } from "@/types/doctor.types"
import { type ISpecialty } from "@/types/specialty.types"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"

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

type ConsultationDraftFilters = {
  searchTerm: string
  department: string
  gender: string
  feeMin: string
  feeMax: string
}

const getDraftFiltersFromSearchParams = (
  searchParams: URLSearchParams | { get: (key: string) => string | null; getAll: (key: string) => string[] },
): ConsultationDraftFilters => {
  const departmentFromUrl = searchParams.getAll(SPECIALTIES_FILTER_KEY)[0] ?? "all"

  return {
    searchTerm: searchParams.get("searchTerm") ?? "",
    department: departmentFromUrl || "all",
    gender: searchParams.get("gender") ?? "all",
    feeMin: searchParams.get(`${APPOINTMENT_FEE_FILTER_KEY}[gte]`) ?? "",
    feeMax: searchParams.get(`${APPOINTMENT_FEE_FILTER_KEY}[lte]`) ?? "",
  }
}

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

const DOCTOR_CARD_SKELETON_COUNT = 4

const DoctorCardSkeleton = () => (
  <article className="flex flex-col gap-4 rounded-sm border border-b-4 border-[#dee7e1] border-b-red-500 bg-white p-4 shadow-[0_8px_28px_rgba(24,39,33,0.03)] md:flex-row md:items-center md:p-5">
    <Skeleton className="h-[260px] w-full rounded-[14px] md:h-[220px] md:w-[260px]" />

    <div className="flex-1 space-y-3">
      <Skeleton className="h-8 w-2/3 max-w-[280px]" />
      <Skeleton className="h-4 w-full max-w-[360px]" />
      <Skeleton className="h-4 w-full max-w-[320px]" />

      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-12 w-40 rounded-[12px]" />
        <Skeleton className="h-12 w-44 rounded-[12px]" />
      </div>
    </div>
  </article>
)

const DoctorsListSkeleton = () => (
  <div className="space-y-5">
    {Array.from({ length: DOCTOR_CARD_SKELETON_COUNT }).map((_, index) => (
      <DoctorCardSkeleton key={`doctor-skeleton-${index}`} />
    ))}
  </div>
)

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
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  })

  const queryString = useMemo(() => {
    return getSanitizedConsultationQueryString(queryStringFromUrl || initialQueryString)
  }, [initialQueryString, queryStringFromUrl])

  const [draftFilters, setDraftFilters] = useState<ConsultationDraftFilters>(() =>
    getDraftFiltersFromSearchParams(searchParams),
  )

  const updateDraftFilter = <K extends keyof ConsultationDraftFilters>(
    key: K,
    value: ConsultationDraftFilters[K],
  ) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleApplyFilters = () => {
    updateParams((params) => {
      const normalizedSearchTerm = draftFilters.searchTerm.trim()

      if (normalizedSearchTerm) {
        params.set("searchTerm", normalizedSearchTerm)
      } else {
        params.delete("searchTerm")
      }

      params.delete(SPECIALTIES_FILTER_KEY)
      if (draftFilters.department !== "all" && draftFilters.department.trim()) {
        params.set(SPECIALTIES_FILTER_KEY, draftFilters.department.trim())
      }

      if (draftFilters.gender !== "all" && draftFilters.gender.trim()) {
        params.set("gender", draftFilters.gender.trim())
      } else {
        params.delete("gender")
      }

      params.delete(`${APPOINTMENT_FEE_FILTER_KEY}[gte]`)
      params.delete(`${APPOINTMENT_FEE_FILTER_KEY}[lte]`)

      if (draftFilters.feeMin.trim()) {
        params.set(`${APPOINTMENT_FEE_FILTER_KEY}[gte]`, draftFilters.feeMin.trim())
      }

      if (draftFilters.feeMax.trim()) {
        params.set(`${APPOINTMENT_FEE_FILTER_KEY}[lte]`, draftFilters.feeMax.trim())
      }
    }, { resetPage: true })
  }

  const handleClearFilters = () => {
    const emptyFilters: ConsultationDraftFilters = {
      searchTerm: "",
      department: "all",
      gender: "all",
      feeMin: "",
      feeMax: "",
    }

    setDraftFilters(emptyFilters)

    updateParams((params) => {
      params.delete("searchTerm")
      params.delete(SPECIALTIES_FILTER_KEY)
      params.delete("gender")
      params.delete(`${APPOINTMENT_FEE_FILTER_KEY}[gte]`)
      params.delete(`${APPOINTMENT_FEE_FILTER_KEY}[lte]`)
    }, { resetPage: true })
  }

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

  const isBusy = isLoading || isFetching || isRouteRefreshPending

  const sidebarFieldClassName =
    "mt-3 h-12 w-full border-0 cursor-pointer border-b border-[#d2d9d5] bg-transparent px-2 text-[16px] shadow-none focus-visible:ring-0"

  return (
    <section className="min-h-screen max-w-[1280px] mx-auto py-5
           px-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid  gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <aside className="rounded-sm border border-[#dfe5e1] bg-white p-6 h-fit
         shadow-[0_0_0_1px_rgba(18,26,22,0.02)]">
          <div className="space-y-6">

            <div className="flex gap-2 w-full ">


              <div className="border-b border-[#dfe5e2] pb-4 w-full ">
                <label htmlFor="doctor-department-filter"
                  className="block text-[15px] font-medium text-[#1a2b27]">
                  Department
                </label>
                <Select
                  value={draftFilters.department}
                  onValueChange={(value) => updateDraftFilter("department", value)}
                >
                  <SelectTrigger
                    id="doctor-department-filter"
                    className="mt-3 h-12 w-full border-0 border-b px-2 cursor-pointer
                     border-[#d2d9d5] bg-transparent text-[18px] font-semibold text-[#0f1d1a] shadow-none focus:ring-0"
                  >
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



              <div className="border-b border-[#dfe5e2] pb-4 w-full ">
                <label htmlFor="doctor-gender-filter" className="block text-[15px] font-medium text-[#1a2b27]">
                  Gender
                </label>
                <Select
                  value={draftFilters.gender}
                  onValueChange={(value) => updateDraftFilter("gender", value)}
                >
                  <SelectTrigger id="doctor-gender-filter" className={sidebarFieldClassName}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All genders</SelectItem>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>


            </div>

            <div className="border-b border-[#dfe5e2] pb-4">
              <label htmlFor="doctor-name-filter" className="block text-[15px] font-medium text-[#1a2b27]">
                Doctor&apos;s Name
              </label>
              <Input
                id="doctor-name-filter"
                value={draftFilters.searchTerm}
                onChange={(event) => updateDraftFilter("searchTerm", event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleApplyFilters()
                  }
                }}
                placeholder="Type doctor's name"
                className={sidebarFieldClassName}
              />
            </div>





            <div className="border-b border-[#dfe5e2] pb-4">

              <label className="block text-[15px] font-medium text-[#1a2b27]">Appointment Fee</label>
              <div className="mt-3 space-y-3 flex gap-2">
                <Input
                  type="number"
                  min="0"
                  value={draftFilters.feeMin}
                  onChange={(event) => updateDraftFilter("feeMin", event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleApplyFilters()
                    }
                  }}
                  placeholder="Minimum fee"
                  className={sidebarFieldClassName}
                />
                <Input
                  type="number"
                  min="0"
                  value={draftFilters.feeMax}
                  onChange={(event) => updateDraftFilter("feeMax", event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleApplyFilters()
                    }
                  }}
                  placeholder="Maximum fee"
                  className={sidebarFieldClassName}
                />
              </div>

            </div>

            <div className="space-y-3 pt-1 flex w-full gap-2">
              <Button
                type="button"
                className="h-12 w-1/2 rounded-[12px] cursor-pointer bg-[#4ca27a]
                 text-[15px] font-semibold tracking-[0.08em]
                  text-white shadow-[0_10px_25px_rgba(76,162,122,0.25)] 
                  hover:bg-[#3f8d68]"
                onClick={handleApplyFilters}
                disabled={isBusy}
              >
                SEARCH
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-12 w-1/2 rounded-[12px] border-[#d2d9d5] 
                text-[15px] font-semibold text-[#1a2b27] hover:bg-[#3f8d68] cursor-pointer"
                onClick={handleClearFilters}
                disabled={isBusy}
              >
                CLEAR
              </Button>
            </div>

          </div>
        </aside>

        <div className="space-y-6">
          {isBusy && <DoctorsListSkeleton />}

          {!isBusy && doctors.length === 0 && (
            <div className="rounded-[18px] border border-dashed border-[#d4ddd7] bg-white/50 p-8 text-center text-sm text-[#516961]">
              No doctors found for your current search/filter.
            </div>
          )}

          {!isBusy && doctors.length > 0 && (
            <>
              <div className="space-y-5 ">
                {doctors.map((doctor: IDoctor) => {
                  const specialtiesList = doctor.specialties?.map((item) => item.specialty.title) ?? []

                  return (
                    <article
                      key={String(doctor.id)}
                      className="flex flex-col gap-4 rounded-sm border border-b-red-500 border-b-4
                       border-[#dee7e1] bg-white p-4 shadow-[0_8px_28px_rgba(24,39,33,0.03)] md:flex-row md:items-center md:p-5"
                    >
                      <div className="overflow-hidden rounded-[14px] bg-[#eef3ef] md:w-[260px]">
                        <Avatar className="h-[260px] w-full rounded-none md:h-[220px]">
                          <AvatarImage src={doctor.profilePhoto} alt={doctor.name} className="h-full w-full object-contain" />
                          <AvatarFallback className="h-full w-full rounded-none bg-[#e8efe9] text-3xl text-[#17382f]">
                            {getDoctorInitials(doctor.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1 ">

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

                        <div className="mt-5 flex items-center gap-3">
                          <div>
                            <Button
                              asChild
                              className="h-11 w-full rounded-md border-0 bg-[#4ca27a] text-sm font-semibold text-white transition hover:bg-[#3f8d68]"
                            >
                              <Link href={`/consultation/doctor/${doctor.id}/appointment`}>
                                Get Appointment
                              </Link>
                            </Button>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 rounded-[12px]
                           bg-[#4ca27a] px-6 text-sm
                            font-semibold tracking-[0.02em] cursor-pointer
                             text-white hover:bg-[#3f8d68]"
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