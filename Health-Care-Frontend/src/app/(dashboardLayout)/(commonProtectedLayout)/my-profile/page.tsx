import MyProfileClient from "@/components/modules/Profile/MyProfileClient";
import { getUserInfo } from "@/services/auth.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME = 1000 * 60; // 1 minute
const QUERY_GC_TIME = 1000 * 60 * 60 * 6; // 6 hours

const MyProfilePage = async () => {
  const userInfo = await getUserInfo();
  const queryClient = new QueryClient();

  if (userInfo) {
    queryClient.setQueryData(["my-profile"], userInfo);
  } else {
    await queryClient.prefetchQuery({
      queryKey: ["my-profile"],
      queryFn: getUserInfo,
      staleTime: QUERY_STALE_TIME,
      gcTime: QUERY_GC_TIME,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyProfileClient initialUserInfo={userInfo} />
    </HydrationBoundary>
  );
};

export default MyProfilePage;