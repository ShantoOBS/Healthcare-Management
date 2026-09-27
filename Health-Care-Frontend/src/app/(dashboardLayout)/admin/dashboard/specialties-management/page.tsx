import SpecialtiesTable from "@/components/modules/Admin/SpecialtiesManagement/SpecialtiesTable";
import { getAllSpecialties } from "@/services/specialty.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const SpecialtiesManagementPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["specialties"],
    queryFn: () => getAllSpecialties(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpecialtiesTable />
    </HydrationBoundary>
  );
};

export default SpecialtiesManagementPage;