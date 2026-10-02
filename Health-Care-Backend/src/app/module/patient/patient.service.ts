import { Patient, Prisma } from "../../../generated/prisma/client.js";
import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums.js";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config.js";
import AppError from "../../errorHelpers/AppError.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";
import { prisma } from "../../lib/prisma.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { patientFilterableFields, patientSearchableFields } from "./patient.constant.js";
import { IUpdatePatientAdminPayload, IUpdatePatientHealthDataPayload, IUpdatePatientProfilePayload } from "./patient.interface.js";
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

const updateMyProfile = async (user : IRequestUser , payload : IUpdatePatientProfilePayload) => {
    // throw new Error("This is an intentional error to test Sentry integration in the backend.");
    const patientData = await prisma.patient.findUniqueOrThrow({
        where : {
            email : user.email
        },
        include:{
            patientHealthData : true,
            medicalReports : true,
        }
    });

    await prisma.$transaction(async (tx) => {
        if(payload.patientInfo){
            await tx.patient.update({
                where : {
                    id : patientData.id
                },
                data : {
                    ...payload.patientInfo
                }
            });

            if(payload.patientInfo.name || payload.patientInfo.profilePhoto){
                const userData = {
                    name : payload.patientInfo.name ? payload.patientInfo.name : patientData.name,
                    image : payload.patientInfo.profilePhoto ? payload.patientInfo.profilePhoto : patientData.profilePhoto,
                }
                await tx.user.update({
                    where: {
                        id: patientData.userId
                    },
                    data: {
                        ...userData
                    }
                });
            };

            
        }

        if (payload.patientHealthData) {
            const healthDataToSave: IUpdatePatientHealthDataPayload = {
                ...payload.patientHealthData,
            };

            if (payload.patientHealthData.dateOfBirth) {
                healthDataToSave.dateOfBirth = convertToDateTime(
                    typeof healthDataToSave.dateOfBirth === "string" ? healthDataToSave.dateOfBirth : undefined
                ) as Date;
            }

            await tx.patientHealthData.upsert({
                where: {
                    patientId: patientData.id
                },
                update: healthDataToSave,
                create: {
                    patientId: patientData.id,
                    ...healthDataToSave
                }
            })
        }

        if(payload.medicalReports && Array.isArray(payload.medicalReports) && payload.medicalReports.length > 0){
            for (const report of payload.medicalReports){
                if(report.shouldDelete && report.reportId){
                    const deletedReport = await tx.medicalReport.delete({
                        where : {
                            id : report.reportId,
                        }
                    });

                    if(deletedReport.reportLink){
                        await deleteFileFromCloudinary(deletedReport.reportLink);
                    }
                }else if(report.reportName && report.reportLink){
                    await tx.medicalReport.create({
                        data : {
                            patientId : patientData.id,
                            reportName : report.reportName,
                            reportLink : report.reportLink,
                        }
                    });
                }
            }
        }
    });

    const result = await prisma.patient.findUnique({
        where: {
            id: patientData.id
        },
        include: {
            user: true,
            patientHealthData: true,
            medicalReports: true,
        }
    });

    return result;
};

export const PatientService = {
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    updateMyProfile,
}