
import SchedulesTable from "@/components/modules/Admin/SchedulesManagement/SchedulesTable"
import { getSchedules } from "@/services/schedule.services"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"

const QUERY_STALE_TIME = 1000 * 60
const QUERY_GC_TIME = 1000 * 60 * 60 * 6

const SchedulesManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const queryParamsObjects = await searchParams

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key]

      if (value === undefined) {
        return ""
      }

      if (Array.isArray(value)) {
        return value
          .map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
          .join("&")
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .filter(Boolean)
    .join("&")

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["schedules", queryString],
    queryFn: () => getSchedules(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SchedulesTable initialQueryString={queryString} />
    </HydrationBoundary>
  )
}

export default SchedulesManagementPage