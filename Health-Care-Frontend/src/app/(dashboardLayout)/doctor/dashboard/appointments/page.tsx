import DoctorAppointmentsList from "@/components/modules/Doctor/DoctorAppointmentsList";
import { getMyAppointments } from "@/services/appointment.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

const DoctorsAppointmentsPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["doctor-my-appointments"],
    queryFn: getMyAppointments,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorAppointmentsList />
    </HydrationBoundary>
  );
};

export default DoctorsAppointmentsPage