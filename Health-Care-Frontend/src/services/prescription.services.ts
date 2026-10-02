"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAdminPrescription, IMyPrescription } from "@/types/prescription.types";

export const getMyPrescriptions = async () => {
  try {
    return await httpClient.get<IMyPrescription[]>("/prescriptions/my-prescriptions");
  } catch (error) {
    console.error("Error fetching my prescriptions:", error);
    throw error;
  }
};

export const getAllPrescriptions = async (queryString: string) => {
  try {
    return await httpClient.get<IAdminPrescription[]>(
      queryString ? `/prescriptions?${queryString}` : "/prescriptions",
    );
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    throw error;
  }
};