/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export type IRegisterResponse = ILoginResponse & {
  patient?: {
    id: string;
    userId: string;
    name: string;
    email: string;
  };
};

export const registerAction = async (
  payload: IRegisterPayload,
  redirectPath?: string,
): Promise<IRegisterResponse | ApiErrorResponse> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0]?.message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<IRegisterResponse>("/auth/register", parsedPayload.data);

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, emailVerified, needPasswordChange, email } = user;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

    if (!emailVerified) {
      redirect(`/verify-email?email=${encodeURIComponent(email)}`);
    }

    if (needPasswordChange) {
      redirect(`/reset-password?email=${encodeURIComponent(email)}`);
    }

    const targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);

    redirect(targetPath);
  } catch (error: any) {
    console.log(error, "error");

    if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    if (error?.response?.data?.message === "Email not verified") {
      redirect(`/verify-email?email=${encodeURIComponent(payload.email)}`);
    }

    const message = error?.response?.data?.message || error?.message || "Registration failed";

    return {
      success: false,
      message: `Registration failed: ${message}`,
    };
  }
};
