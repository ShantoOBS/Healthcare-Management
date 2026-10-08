import SpecialtiesTable from "@/components/modules/Admin/SpecialtiesManagement/SpecialtiesTable";
import { getAllSpecialties } from "@/services/specialty.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

const SpecialtiesManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParams = await searchParams;
  const queryString = Object.entries(queryParams)
    .flatMap(([key, value]) => {
      if (value === undefined) {
        return [];
      }

      const values = Array.isArray(value) ? value : [value];
      return values.map(
        (item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`,
      );
    })
    .join("&");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["specialties", queryString],
    queryFn: () => getAllSpecialties(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpecialtiesTable initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default SpecialtiesManagementPage;