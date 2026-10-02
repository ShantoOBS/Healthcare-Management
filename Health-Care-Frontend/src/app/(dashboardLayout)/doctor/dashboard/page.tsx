import RoleDashboardContent from "@/components/modules/Dashboord/RoleDashboardContent";
import { getDashboardData } from "@/services/dashboard.services";
import { IDoctorDashboardData } from "@/types/dashboard.types";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME = 30 * 1000;
const QUERY_GC_TIME = 5 * 60 * 1000;

const DoctorsDashboard = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["doctor-dashboard-data"],
    queryFn: () => getDashboardData<IDoctorDashboardData>(),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoleDashboardContent role="doctor" />
    </HydrationBoundary>
  );
};

export default DoctorsDashboard;
