import { BloodGroup, Gender } from "../../../generated/prisma/enums.js";


export interface IUpdatePatientInfoPayload {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string | null;
    address?: string | null;
}

export interface IUpdateDoctorInfoPayload {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string | null;
    address?: string | null;
    gender?: Gender;
    qualification?: string | null;
    designation?: string | null;
    currentWorkingPlace?: string | null;
    experience?: number | string | null;
    appointmentFee?: number | string | null;
    description?: string | null;
}

export interface IUpdateAdminInfoPayload {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string | null;
}

export interface IUpdatePatientHealthDataPayload {
    gender?: Gender | null;
    dateOfBirth?: Date | string | null;
    bloodGroup?: BloodGroup | null;
    hasAllergies?: boolean;
    hasDiabetes?: boolean;
    height?: string | null;
    weight?: string | null;
    smokingStatus?: boolean;
    dietaryPreferences?: string | null;
    pregnancyStatus?: boolean;
    mentalHealthHistory?: string | null;
    immunizationStatus?: string | null;
    hasPastSurgeries?: boolean;
    recentAnxiety?: boolean;
    recentDepression?: boolean;
    maritalStatus?: string | null;
}

export interface IUpdatePatientMedicalReportPayload {
    reportName?: string;
    reportLink?: string;
    shouldDelete?: boolean;
    reportId?: string;
}

export interface IUpdatePatientProfilePayload {
    name?: string;
    profilePhoto?: string;
    patientInfo?: IUpdatePatientInfoPayload;
    patientHealthData?: IUpdatePatientHealthDataPayload;
    doctorInfo?: IUpdateDoctorInfoPayload;
    adminInfo?: IUpdateAdminInfoPayload;
    medicalReports?: IUpdatePatientMedicalReportPayload[];
}

export interface IUpdatePatientAdminPayload {
    patientInfo: {
        name?: string;
        contactNumber?: string;
        address?: string;
    };
}