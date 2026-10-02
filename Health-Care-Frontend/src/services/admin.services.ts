"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAdmin, IAdminUpdatePayload, ICreateAdminPayload } from "@/types/admin.types";

export const createAdmin = async (payload: ICreateAdminPayload) => {
  try {
    return await httpClient.post<IAdmin>("/users/create-admin", payload);
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};

export const getAdmins = async (queryString: string) => {
  try {
    return await httpClient.get<IAdmin[]>(queryString ? `/admins?${queryString}` : "/admins");
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};

export const getAdminById = async (id: string) => {
  try {
    return await httpClient.get<IAdmin>(`/admins/${id}`);
  } catch (error) {
    console.error("Error fetching admin:", error);
    throw error;
  }
};

export const updateAdmin = async (id: string, payload: IAdminUpdatePayload) => {
  try {
    return await httpClient.patch<IAdmin>(`/admins/${id}`, payload);
  } catch (error) {
    console.error("Error updating admin:", error);
    throw error;
  }
};

export const deleteAdmin = async (id: string) => {
  try {
    return await httpClient.delete<unknown>(`/admins/${id}`);
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};