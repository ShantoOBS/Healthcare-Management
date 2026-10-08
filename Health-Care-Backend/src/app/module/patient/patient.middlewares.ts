import { NextFunction, Request, Response } from "express";
import { IUpdatePatientInfoPayload, IUpdatePatientProfilePayload } from "./patient.interface.js";

export const updateMyPatientProfileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let payload: IUpdatePatientProfilePayload = req.body;

    if (req.body?.data) {
        try {
            payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
        } catch {
            payload = {};
        }
    }

    if (!payload || typeof payload !== "object") {
        payload = {};
    }

    const files = req.files as { [fieldName: string]: Express.Multer.File[] | undefined } | undefined;

    if (files?.profilePhoto?.[0]) {
        const photoUrl = files.profilePhoto[0].path;
        payload.profilePhoto = photoUrl;

        if (payload.patientInfo) {
            payload.patientInfo.profilePhoto = photoUrl;
        }
        if (payload.doctorInfo) {
            payload.doctorInfo.profilePhoto = photoUrl;
        }
        if (payload.adminInfo) {
            payload.adminInfo.profilePhoto = photoUrl;
        }
    }

    if (files?.medicalReports && files.medicalReports.length > 0) {
        const newReports = files.medicalReports.map(file => ({
            reportName: file.originalname || `Medical Report - ${new Date().getTime()}`,
            reportLink: file.path,
        }));

        if (payload.medicalReports && Array.isArray(payload.medicalReports)) {
            payload.medicalReports = [...payload.medicalReports, ...newReports];
        } else {
            payload.medicalReports = newReports;
        }
    }

    req.body = payload;
    next();
};