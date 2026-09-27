import { logoutUser } from "@/services/auth.services";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const logoutRequest = async () => {
  return await logoutUser();
};

interface UseLogoutOptions {
  redirectTo?: string;
  onSuccess?: () => void;
}

export const useLogout = (options?: UseLogoutOptions) => {
  const router = useRouter();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: (_, __, ___) => {
      options?.onSuccess?.();
      router.push(options?.redirectTo ?? "/login");
      router.refresh();
    },
  });
};

export default useLogout;
