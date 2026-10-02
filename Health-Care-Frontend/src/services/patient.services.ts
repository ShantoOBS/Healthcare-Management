"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
    type IPatient,
    type IPatientDetails,
    type IPatientProfileUpdate,
} from "@/types/patient.types";

export const getPatients = async (queryString: string) => {
    try {
        return await httpClient.get<IPatient[]>(queryString ? `/patients?${queryString}` : "/patients");
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;
    }
}

export const getPatientById = async (id: string) => {
    try {
        return await httpClient.get<IPatientDetails>(`/patients/${id}`);
    } catch (error) {
        console.error("Error fetching patient:", error);
        throw error;
    }
}

export const updatePatient = async (id: string, payload: IPatientProfileUpdate) => {
    try {
        return await httpClient.patch<IPatientDetails>(`/patients/${id}`, payload);
    } catch (error) {
        console.error("Error updating patient:", error);
        throw error;
    }
}

export const deletePatient = async (id: string) => {
    try {
        return await httpClient.delete<{ message: string }>(`/patients/${id}`);
    } catch (error) {
        console.error("Error deleting patient:", error);
        throw error;
    }
}

export const updateMyPatientProfile = async (formData: FormData) => {
    try {
        const response = await httpClient.patch<any>("/patients/update-my-profile", formData);
        return response;
    } catch (error) {
        console.error("Error updating patient profile:", error);
        throw error;
    }
}
