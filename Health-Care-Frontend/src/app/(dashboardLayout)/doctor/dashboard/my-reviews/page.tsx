import DoctorReviewsList from "@/components/modules/Doctor/DoctorReviewsList";
import { getMyReviews } from "@/services/review.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

const DoctorsMyReviewsPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["doctor-my-reviews"],
    queryFn: getMyReviews,
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorReviewsList />
    </HydrationBoundary>
  );
};

export default DoctorsMyReviewsPage