"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  IAdminReview,
  ICreateReviewPayload,
  IMyReview,
  IUpdateReviewPayload,
} from "@/types/review.types";

export const createReview = async (payload: ICreateReviewPayload) => {
  try {
    return await httpClient.post<unknown>("/reviews", payload);
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const getMyReviews = async () => {
  try {
    return await httpClient.get<IMyReview[]>("/reviews/my-reviews");
  } catch (error) {
    console.error("Error fetching my reviews:", error);
    throw error;
  }
};

export const getAllReviews = async (queryString: string) => {
  try {
    return await httpClient.get<IAdminReview[]>(
      queryString ? `/reviews?${queryString}` : "/reviews",
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const updateReview = async (reviewId: string, payload: IUpdateReviewPayload) => {
  try {
    return await httpClient.patch<unknown>(`/reviews/${reviewId}`, payload);
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};