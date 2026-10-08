import { Patient, Prisma } from "../../../generated/prisma/client.js";
import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums.js";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config.js";
import AppError from "../../errorHelpers/AppError.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";
import { prisma } from "../../lib/prisma.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { AuthService } from "../auth/auth.service.js";
import { patientFilterableFields, patientSearchableFields } from "./patient.constant.js";
import { IUpdatePatientAdminPayload, IUpdatePatientProfilePayload } from "./patient.interface.js";
import { convertToDateTime } from "./patient.utils.js";

const getAllPatients = async (query: IQueryParams) => {
    const queryBuilder = new QueryBuilder<Patient, Prisma.PatientWhereInput, Prisma.PatientInclude>(
        prisma.patient,
        query,
        {
            searchableFields: patientSearchableFields,
            filterableFields: patientFilterableFields,
        }
    );

    return queryBuilder
        .search()
        .filter()
        .where({ isDeleted: false })
        .include({
            user: {
                select: {
                    id: true,
                    status: true,
                    createdAt: true,
                },
            },
        })
        .paginate()
        .sort()
        .fields()
        .execute();
};

const getPatientById = async (id: string) => {
    const patient = await prisma.patient.findFirst({
        where: { id, isDeleted: false },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    status: true,
                    createdAt: true,
                },
            },
            patientHealthData: true,
            medicalReports: {
                select: {
                    id: true,
                    reportName: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!patient) {
        throw new AppError(status.NOT_FOUND, "Patient not found");
    }

    return patient;
};

const updatePatient = async (id: string, payload: IUpdatePatientAdminPayload) => {
    const patient = await prisma.patient.findFirst({
        where: { id, isDeleted: false },
        select: { id: true, userId: true },
    });

    if (!patient) {
        throw new AppError(status.NOT_FOUND, "Patient not found");
    }

    await prisma.$transaction(async (tx) => {
        await tx.patient.update({
            where: { id },
            data: payload.patientInfo,
        });

        if (payload.patientInfo.name) {
            await tx.user.update({
                where: { id: patient.userId },
                data: { name: payload.patientInfo.name },
            });
        }
    });

    return getPatientById(id);
};

const deletePatient = async (id: string) => {
    const patient = await prisma.patient.findFirst({
        where: { id, isDeleted: false },
        select: { id: true, userId: true },
    });

    if (!patient) {
        throw new AppError(status.NOT_FOUND, "Patient not found");
    }

    const deletedAt = new Date();
    await prisma.$transaction(async (tx) => {
        await tx.patient.update({
            where: { id },
            data: { isDeleted: true, deletedAt },
        });
        await tx.user.update({
            where: { id: patient.userId },
            data: { isDeleted: true, deletedAt, status: UserStatus.DELETED },
        });
        await tx.session.deleteMany({ where: { userId: patient.userId } });
    });

    return { message: "Patient deleted successfully" };
};

const updateMyProfile = async (user: IRequestUser, payload: IUpdatePatientProfilePayload) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: { id: user.userId },
        include: {
            patient: {
                include: {
                    patientHealthData: true,
                    medicalReports: true,
                },
            },
            doctor: {
                include: {
                    specialties: {
                        include: {
                            specialty: true,
                        },
                    },
                },
            },
            admin: true,
        },
    });

    const photoUrl = payload.profilePhoto || payload.patientInfo?.profilePhoto || payload.doctorInfo?.profilePhoto || payload.adminInfo?.profilePhoto;
    const commonName = payload.name || payload.patientInfo?.name || payload.doctorInfo?.name || payload.adminInfo?.name;

    await prisma.$transaction(async (tx) => {
        // 1. Update User model if name or image changed
        if (commonName || photoUrl) {
            await tx.user.update({
                where: { id: userData.id },
                data: {
                    ...(commonName ? { name: commonName } : {}),
                    ...(photoUrl ? { image: photoUrl } : {}),
                },
            });
        }

        // 2. Handle Patient Profile
        if (userData.patient) {
            const patientInfo = payload.patientInfo || {};
            const patientName = patientInfo.name || commonName;
            const patientPhoto = patientInfo.profilePhoto || photoUrl;

            const patientUpdateData: Prisma.PatientUpdateInput = {};
            if (patientName) patientUpdateData.name = patientName;
            if (patientPhoto) patientUpdateData.profilePhoto = patientPhoto;
            if (patientInfo.contactNumber !== undefined) patientUpdateData.contactNumber = patientInfo.contactNumber;
            if (patientInfo.address !== undefined) patientUpdateData.address = patientInfo.address;

            if (Object.keys(patientUpdateData).length > 0) {
                await tx.patient.update({
                    where: { id: userData.patient.id },
                    data: patientUpdateData,
                });
            }

            if (payload.patientHealthData && Object.keys(payload.patientHealthData).length > 0) {
                const healthData = { ...payload.patientHealthData };
                if (healthData.dateOfBirth) {
                    healthData.dateOfBirth = convertToDateTime(
                        typeof healthData.dateOfBirth === "string" ? healthData.dateOfBirth : undefined
                    ) as Date;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const healthDataToSave: any = {};
                for (const [key, value] of Object.entries(healthData)) {
                    if (value !== undefined && value !== "") {
                        healthDataToSave[key] = value;
                    }
                }

                if (userData.patient.patientHealthData) {
                    if (Object.keys(healthDataToSave).length > 0) {
                        await tx.patientHealthData.update({
                            where: { patientId: userData.patient.id },
                            data: healthDataToSave,
                        });
                    }
                } else {
                    if (
                        healthDataToSave.gender &&
                        healthDataToSave.dateOfBirth &&
                        healthDataToSave.bloodGroup &&
                        healthDataToSave.height &&
                        healthDataToSave.weight
                    ) {
                        await tx.patientHealthData.create({
                            data: {
                                patientId: userData.patient.id,
                                ...healthDataToSave,
                            },
                        });
                    }
                }
            }

            if (payload.medicalReports && Array.isArray(payload.medicalReports) && payload.medicalReports.length > 0) {
                for (const report of payload.medicalReports) {
                    if (report.shouldDelete && report.reportId) {
                        const deletedReport = await tx.medicalReport.delete({
                            where: { id: report.reportId },
                        });
                        if (deletedReport.reportLink) {
                            await deleteFileFromCloudinary(deletedReport.reportLink);
                        }
                    } else if (report.reportName && report.reportLink) {
                        await tx.medicalReport.create({
                            data: {
                                patientId: userData.patient.id,
                                reportName: report.reportName,
                                reportLink: report.reportLink,
                            },
                        });
                    }
                }
            }
        }

        // 3. Handle Doctor Profile
        if (userData.doctor) {
            const doctorInfo = payload.doctorInfo || {};
            const docName = doctorInfo.name || commonName;
            const docPhoto = doctorInfo.profilePhoto || photoUrl;

            const docUpdateData: Prisma.DoctorUpdateInput = {};
            if (docName) docUpdateData.name = docName;
            if (docPhoto) docUpdateData.profilePhoto = docPhoto;
            if (doctorInfo.contactNumber !== undefined) docUpdateData.contactNumber = doctorInfo.contactNumber;
            if (doctorInfo.address !== undefined) docUpdateData.address = doctorInfo.address;
            if (doctorInfo.gender) docUpdateData.gender = doctorInfo.gender;
            if (doctorInfo.qualification !== undefined) docUpdateData.qualification = doctorInfo.qualification || "";
            if (doctorInfo.designation !== undefined) docUpdateData.designation = doctorInfo.designation || "";
            if (doctorInfo.currentWorkingPlace !== undefined) docUpdateData.currentWorkingPlace = doctorInfo.currentWorkingPlace || "";
            if (doctorInfo.experience !== undefined && doctorInfo.experience !== null && doctorInfo.experience !== "") {
                docUpdateData.experience = Number(doctorInfo.experience);
            }
            if (doctorInfo.appointmentFee !== undefined && doctorInfo.appointmentFee !== null && doctorInfo.appointmentFee !== "") {
                docUpdateData.appointmentFee = Number(doctorInfo.appointmentFee);
            }
            if (doctorInfo.description !== undefined) docUpdateData.description = doctorInfo.description;

            if (Object.keys(docUpdateData).length > 0) {
                await tx.doctor.update({
                    where: { id: userData.doctor.id },
                    data: docUpdateData,
                });
            }
        }

        // 4. Handle Admin Profile
        if (userData.admin) {
            const adminInfo = payload.adminInfo || {};
            const adminName = adminInfo.name || commonName;
            const adminPhoto = adminInfo.profilePhoto || photoUrl;

            const adminUpdateData: Prisma.AdminUpdateInput = {};
            if (adminName) adminUpdateData.name = adminName;
            if (adminPhoto) adminUpdateData.profilePhoto = adminPhoto;
            if (adminInfo.contactNumber !== undefined) adminUpdateData.contactNumber = adminInfo.contactNumber;

            if (Object.keys(adminUpdateData).length > 0) {
                await tx.admin.update({
                    where: { id: userData.admin.id },
                    data: adminUpdateData,
                });
            }
        }
    });

    return AuthService.getMe(user);
};

export const PatientService = {
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    updateMyProfile,
};