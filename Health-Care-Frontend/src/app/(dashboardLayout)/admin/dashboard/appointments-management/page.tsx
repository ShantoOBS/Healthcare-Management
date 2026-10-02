
import AppointmentsTable from "@/components/modules/Admin/AppointmentsManagement/AppointmentsTable";
import { getAllAppointments } from "@/services/appointment.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

const AppointmentsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParams = await searchParams;
  const queryString = Object.entries(queryParams)
    .flatMap(([key, value]) => {
      if (value === undefined) return [];
      const values = Array.isArray(value) ? value : [value];
      return values.map(
        (item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`,
      );
    })
    .join("&");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["admin-appointments", queryString],
    queryFn: () => getAllAppointments(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppointmentsTable initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default AppointmentsManagementPage;