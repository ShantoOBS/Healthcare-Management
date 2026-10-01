import { NextFunction, Request, Response } from "express";

export const createDoctorProfilePhotoMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    if (typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
    }

    if (req.file) {
        req.body = {
            ...req.body,
            doctor: {
                ...req.body?.doctor,
                profilePhoto: req.file.path,
            },
        };
    }

    next();
};