"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ISpecialty } from "@/types/specialty.types";

export const getAllSpecialties = async (queryString?: string) => {
    try {
        const specialties = await httpClient.get<ISpecialty[]>(queryString ? `/specialties?${queryString}` : "/specialties");
        return specialties;
    } catch (error) {
        console.error("Error fetching specialties:", error);
        throw error;
    }
}

export const createSpecialty = async (formData: FormData) => {
    try {
        const response = await httpClient.post<ISpecialty>("/specialties", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response;
    } catch (error) {
        console.error("Error creating specialty:", error);
        throw error;
    }
}

export const deleteSpecialty = async (id: string) => {
    try {
        const response = await httpClient.delete<boolean>(`/specialties/${id}`);
        return response;
    } catch (error) {
        console.error("Error deleting specialty:", error);
        throw error;
    }
}
