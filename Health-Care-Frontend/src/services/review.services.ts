"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAdminReview, IMyReview } from "@/types/review.types";

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