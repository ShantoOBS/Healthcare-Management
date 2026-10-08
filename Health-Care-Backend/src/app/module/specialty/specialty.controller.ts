
import { Request, Response } from "express";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { SpecialtyService } from "./specialty.service.js";

const createSpecialty = catchAsync(
    async (req: Request, res: Response) => {
       
        const payload = {
            ...req.body,
            icon : req.file?.path
        };
        const result = await SpecialtyService.createSpecialty(payload);
        sendResponse(res, {
            httpStatusCode: 201,
            success: true,
            message: 'Specialty created successfully',
            data: result
        });
    }
)

const getAllSpecialties = catchAsync(
    async (req: Request, res: Response) => {
        const query = req.query;
        const result = await SpecialtyService.getAllSpecialties(query as IQueryParams);
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: 'Specialties fetched successfully',
            data: result.data,
            meta: result.meta,
        });
    }
)

const deleteSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await SpecialtyService.deleteSpecialty(id as string);
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: 'Specialty deleted successfully',
            data: result
        });
    }
)

export const SpecialtyController = {
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty
}