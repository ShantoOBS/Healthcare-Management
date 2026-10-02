/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";

export async function getDashboardData<TData = IAdminDashboardData>(): Promise<ApiResponse<TData> | ApiErrorResponse> {
    try {
        const response = await httpClient.get<TData>("/stats")

        return response;
    } catch (error : any) {
      console.log(error, "From Dashboard Server Action");
      return {
        success: false,
        message: error.message || "An error occurred while fetching dashboard data.",
      }  
    }
}