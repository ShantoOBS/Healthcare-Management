"use server";

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
  formData: FormData
): Promise<ApiResponse<any> | ApiErrorResponse> => {
  try {
    return await updateMyPatientProfile(formData);
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error, "Failed to update profile"),
    };
  }
};
