"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAdminPrescription, IMyPrescription } from "@/types/prescription.types";

export interface ICreatePrescriptionPayload {
  appointmentId: string;
  instructions: string;
  followUpDate?: string;
}

export interface IUpdatePrescriptionPayload {
  instructions?: string;
  followUpDate?: string;
}

export const getMyPrescriptions = async () => {
  try {
    return await httpClient.get<IMyPrescription[]>("/prescriptions/my-prescriptions");
  } catch (error) {
    console.error("Error fetching my prescriptions:", error);
    throw error;
  }
};

export const createPrescription = async (payload: ICreatePrescriptionPayload) => {
  try {
    return await httpClient.post<IMyPrescription>("/prescriptions", payload);
  } catch (error) {
    console.error("Error creating prescription:", error);
    throw error;
  }
};

export const updatePrescription = async (
  prescriptionId: string,
  payload: IUpdatePrescriptionPayload,
) => {
  try {
    return await httpClient.patch<IMyPrescription>(`/prescriptions/${prescriptionId}`, payload);
  } catch (error) {
    console.error("Error updating prescription:", error);
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