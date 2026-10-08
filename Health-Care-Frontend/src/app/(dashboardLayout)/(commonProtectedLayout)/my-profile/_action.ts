"use server";

import { revalidatePath } from "next/cache";
import { updateMyPatientProfile } from "@/services/patient.services";
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types";

const getActionErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (
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
  ) {
    return error.response.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const updatePatientProfileAction = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: FormData
): Promise<ApiResponse<any> | ApiErrorResponse> => {
  try {
    const res = await updateMyPatientProfile(formData);
    revalidatePath("/my-profile");
    return res;
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error, "Failed to update profile"),
    };
  }
};

export const updateMyProfileAction = updatePatientProfileAction;

