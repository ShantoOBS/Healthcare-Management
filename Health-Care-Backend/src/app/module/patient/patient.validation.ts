import z from "zod";
import { BloodGroup, Gender } from "../../../generated/prisma/enums.js";

const emptyStringToUndefined = (val: unknown) => (typeof val === "string" && val.trim() === "" ? undefined : val);

const updatePatientProfileZodSchema = z.object({
    name: z.string().min(1, "Name cannot be empty").max(100, "Name must be less than 100 characters").optional(),
    profilePhoto: z.string().optional(),
    patientInfo: z.object({
        name: z.string().min(1, "Name cannot be empty").max(100, "Name must be less than 100 characters").optional(),
        profilePhoto: z.string().optional(),
        contactNumber: z.preprocess(emptyStringToUndefined, z.string().max(20, "Contact number must be less than 20 characters").nullable().optional()),
        address: z.preprocess(emptyStringToUndefined, z.string().max(200, "Address must be less than 200 characters").nullable().optional()),
    }).optional(),
    patientHealthData: z.object({
        gender: z.preprocess(emptyStringToUndefined, z.enum([Gender.FEMALE, Gender.MALE, Gender.OTHER]).optional()),
        dateOfBirth: z.preprocess(emptyStringToUndefined, z.string().refine((date) => !date || !isNaN(Date.parse(date)), {
            message: "Invalid date format",
        }).optional()),
        bloodGroup: z.preprocess(emptyStringToUndefined, z.enum([
            BloodGroup.A_POSITIVE,
            BloodGroup.A_NEGATIVE,
            BloodGroup.B_POSITIVE,
            BloodGroup.B_NEGATIVE,
            BloodGroup.AB_POSITIVE,
            BloodGroup.AB_NEGATIVE,
            BloodGroup.O_POSITIVE,
            BloodGroup.O_NEGATIVE
        ]).optional()),
        hasAllergies: z.boolean().optional(),
        hasDiabetes: z.boolean().optional(),
        height: z.preprocess(emptyStringToUndefined, z.string().nullable().optional()),
        weight: z.preprocess(emptyStringToUndefined, z.string().nullable().optional()),
        smokingStatus: z.boolean().optional(),
        dietaryPreferences: z.preprocess(emptyStringToUndefined, z.string().nullable().optional()),
        pregnancyStatus: z.boolean().optional(),
        mentalHealthHistory: z.preprocess(emptyStringToUndefined, z.string().nullable().optional()),
        immunizationStatus: z.preprocess(emptyStringToUndefined, z.string().nullable().optional()),
        hasPastSurgeries: z.boolean().optional(),
        recentAnxiety: z.boolean().optional(),
        recentDepression: z.boolean().optional(),
        maritalStatus: z.preprocess(emptyStringToUndefined, z.string().nullable().optional()),
    }).optional(),
    doctorInfo: z.object({
        name: z.string().min(1).max(100).optional(),
        profilePhoto: z.string().optional(),
        contactNumber: z.preprocess(emptyStringToUndefined, z.string().max(20).nullable().optional()),
        address: z.preprocess(emptyStringToUndefined, z.string().max(200).nullable().optional()),
        gender: z.preprocess(emptyStringToUndefined, z.enum([Gender.FEMALE, Gender.MALE, Gender.OTHER]).optional()),
        qualification: z.preprocess(emptyStringToUndefined, z.string().nullable().optional()),
        designation: z.preprocess(emptyStringToUndefined, z.string().nullable().optional()),
        currentWorkingPlace: z.preprocess(emptyStringToUndefined, z.string().nullable().optional()),
        experience: z.union([z.number(), z.string()]).optional(),
        appointmentFee: z.union([z.number(), z.string()]).optional(),
        description: z.preprocess(emptyStringToUndefined, z.string().nullable().optional()),
    }).optional(),
    adminInfo: z.object({
        name: z.string().min(1).max(100).optional(),
        profilePhoto: z.string().optional(),
        contactNumber: z.preprocess(emptyStringToUndefined, z.string().max(20).nullable().optional()),
    }).optional(),
    medicalReports: z.array(z.object({
        shouldDelete: z.boolean().optional(),
        reportId: z.string().uuid().optional(),
        reportName: z.string().optional(),
        reportLink: z.string().optional(),
    })).optional().refine((reports) => {
        if (!reports || reports.length === 0) return true;

        for (const report of reports) {
            if (report.shouldDelete === true && !report.reportId) {
                return false;
            }
            if (report.reportId && !report.shouldDelete) {
                return false;
            }
            if (report.reportName && !report.reportLink) {
                return false;
            }
            if (report.reportLink && !report.reportName) {
                return false;
            }
        }
        return true;
    }, {
        message: "Invalid medical report data. If shouldDelete is true, reportId must be provided. If reportName is provided, reportLink must also be provided."
    })
})

const updatePatientAdminZodSchema = z.object({
    patientInfo: z.object({
        name: z.string().min(1).max(100).optional(),
        contactNumber: z.string().max(20).optional(),
        address: z.string().max(200).optional(),
    }).refine((patientInfo) => Object.values(patientInfo).some((value) => value !== undefined), {
        message: "Provide at least one patient field to update",
    }),
})

export const PatientValidation = {
    updatePatientProfileZodSchema,
    updatePatientAdminZodSchema,
}