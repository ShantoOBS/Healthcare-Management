import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const logoutRequest = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Logout failed");
  }

  return data;
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
