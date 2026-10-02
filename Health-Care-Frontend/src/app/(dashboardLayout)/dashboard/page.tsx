import RoleDashboardContent from "@/components/modules/Dashboord/RoleDashboardContent";
import { getDashboardData } from "@/services/dashboard.services";
import { IPatientDashboardData } from "@/types/dashboard.types";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME = 30 * 1000;
const QUERY_GC_TIME = 5 * 60 * 1000;

const PatientDashboard = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["patient-dashboard-data"],
    queryFn: () => getDashboardData<IPatientDashboardData>(),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoleDashboardContent role="patient" />
    </HydrationBoundary>
  );
};

export default PatientDashboard;
