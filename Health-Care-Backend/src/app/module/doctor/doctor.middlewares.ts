import { NextFunction, Request, Response } from "express";

export const doctorProfilePhotoMiddleware = (req: Request, res: Response, next: NextFunction) => {
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