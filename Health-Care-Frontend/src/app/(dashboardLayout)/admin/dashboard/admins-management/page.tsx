
import AdminsTable from "@/components/modules/Admin/AdminsManagement/AdminsTable";
import { getAdmins } from "@/services/admin.services";
import { getUserInfo } from "@/services/auth.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME = 1000 * 60;
const QUERY_GC_TIME = 1000 * 60 * 60 * 6;

const AdminsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const [queryParams, userInfo] = await Promise.all([searchParams, getUserInfo()]);
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
    queryKey: ["admins", queryString],
    queryFn: () => getAdmins(queryString),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminsTable
        initialQueryString={queryString}
        canManageAdmins={userInfo?.role === "SUPER_ADMIN"}
      />
    </HydrationBoundary>
  );
};

export default AdminsManagementPage;