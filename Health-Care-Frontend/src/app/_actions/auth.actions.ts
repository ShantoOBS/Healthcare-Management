"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    message: "Choose a password different from your current password",
    path: ["newPassword"],
  });

interface ChangePasswordResult {
  accessToken: string;
  refreshToken: string;
  token: string;
}

export const changePasswordAction = async (payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const parsedPayload = changePasswordSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false as const,
      message: parsedPayload.error.issues[0]?.message || "Check your password details",
    };
  }

  try {
    const response = await httpClient.post<ChangePasswordResult>("/auth/change-password", {
      currentPassword: parsedPayload.data.currentPassword,
      newPassword: parsedPayload.data.newPassword,
    });
    const { accessToken, refreshToken, token } = response.data;

    if (accessToken) await setTokenInCookies("accessToken", accessToken);
    if (refreshToken) await setTokenInCookies("refreshToken", refreshToken);
    if (token) await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

    return {
      success: true as const,
      message: response.message || "Password changed successfully",
    };
  } catch (error: unknown) {
    const message =
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
        ? error.response.data.message
        : error instanceof Error
          ? error.message
          : "Unable to change password";

    return { success: false as const, message };
  }
};