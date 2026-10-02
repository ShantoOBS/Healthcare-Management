import { Request, Response } from "express";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { PatientService } from "./patient.service.js";

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
    const result = await PatientService.getAllPatients(req.query as IQueryParams);

    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Patients fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getPatientById = catchAsync(async (req: Request, res: Response) => {
    const patient = await PatientService.getPatientById(req.params.id as string);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Patient fetched successfully",
        data: patient,
    });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
    const patient = await PatientService.updatePatient(req.params.id as string, req.body);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Patient updated successfully",
        data: patient,
    });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
    const result = await PatientService.deletePatient(req.params.id as string);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Patient deleted successfully",
        data: result,
    });
});

const updateMyProfile = catchAsync(async (req : Request, res : Response) =>{

    const user = req.user as IRequestUser;
    const payload = req.body;
 

    const result = await PatientService.updateMyProfile(user, payload);

    sendResponse(res, {
        success: true,
        httpStatusCode : status.OK,
        message : "Profile updated successfully",
        data : result
    });
})

export const PatientController = {
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    updateMyProfile
}