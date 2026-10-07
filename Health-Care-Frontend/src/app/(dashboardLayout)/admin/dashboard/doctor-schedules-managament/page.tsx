
import DoctorSchedulesManagementTable from "@/components/modules/Admin/DoctorSchedulesManagement/DoctorSchedulesManagementTable"
import { getDoctorSchedules } from "@/services/doctorSchedule.services"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"

const QUERY_STALE_TIME = 1000 * 60
const QUERY_GC_TIME = 1000 * 60 * 60 * 6

const DoctorSchedulesManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const queryParams = await searchParams
  const queryString = Object.keys(queryParams)
    .flatMap((key) => {
      const value = queryParams[key]
      if (value === undefined) return []

      return (Array.isArray(value) ? value : [value]).map(
        (item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`,
      )
    })
    .join("&")

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["doctor-schedules", queryString],
    queryFn: () => getDoctorSchedules(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorSchedulesManagementTable initialQueryString={queryString} />
    </HydrationBoundary>
  )
}

export default DoctorSchedulesManagementPage