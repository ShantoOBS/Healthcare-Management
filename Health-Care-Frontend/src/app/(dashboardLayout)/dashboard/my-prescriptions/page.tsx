import MyPrescriptionsList from "@/components/modules/Patient/Appointments/MyPrescriptionsList";
import { getMyPrescriptions } from "@/services/prescription.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

const MyPrescriptionsPage = async () => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["my-prescriptions"],
		queryFn: getMyPrescriptions,
		staleTime: QUERY_STALE_TIME,
		gcTime: QUERY_GC_TIME,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<MyPrescriptionsList />
		</HydrationBoundary>
	);
};

export default MyPrescriptionsPage;
