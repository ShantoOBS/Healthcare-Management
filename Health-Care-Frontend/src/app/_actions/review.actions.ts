"use server";

import { createReview, updateReview } from "@/services/review.services";
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types";
import { type ICreateReviewPayload, type IUpdateReviewPayload } from "@/types/review.types";

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

export const createReviewAction = async (
  payload: ICreateReviewPayload,
): Promise<ApiResponse<unknown> | ApiErrorResponse> => {
  const appointmentId = payload.appointmentId?.trim();
  const comment = payload.comment?.trim();

  if (!appointmentId) {
    return { success: false, message: "Enter your appointment ID" };
  }

  if (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
    return { success: false, message: "Choose a rating from 1 to 5 stars" };
  }

  if (!comment) {
    return { success: false, message: "Write a comment before submitting" };
  }

  try {
    return await createReview({ appointmentId, rating: payload.rating, comment });
  } catch (error: unknown) {
    return { success: false, message: getActionErrorMessage(error, "Failed to submit review") };
  }
};

export const updateReviewAction = async (
  reviewId: string,
  payload: IUpdateReviewPayload,
): Promise<ApiResponse<unknown> | ApiErrorResponse> => {
  const comment = payload.comment?.trim();

  if (!reviewId?.trim()) {
    return { success: false, message: "Review ID is required" };
  }

  if (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
    return { success: false, message: "Choose a rating from 1 to 5 stars" };
  }

  if (!comment) {
    return { success: false, message: "Write a comment before saving" };
  }

  try {
    return await updateReview(reviewId, { rating: payload.rating, comment });
  } catch (error: unknown) {
    return { success: false, message: getActionErrorMessage(error, "Failed to update review") };
  }
};