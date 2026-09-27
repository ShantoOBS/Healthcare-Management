"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const updateMyPatientProfile = async (formData: FormData) => {
    try {
        const response = await httpClient.patch<any>("/patients/update-my-profile", formData);
        return response;
    } catch (error) {
        console.error("Error updating patient profile:", error);
        throw error;
    }
}
