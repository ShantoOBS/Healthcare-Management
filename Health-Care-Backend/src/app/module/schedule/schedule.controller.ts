import { Request, Response } from "express";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { ScheduleService } from "./schedule.service.js";

const createSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const schedule = await ScheduleService.createSchedule(payload);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Schedule created successfully',
        data: schedule
    });
});

const getAllSchedules = catchAsync( async (req : Request, res : Response) => {
    const query = req.query;
    const result = await ScheduleService.getAllSchedules(query as IQueryParams);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});

const getScheduleById = catchAsync( async (req : Request, res : Response) => {
    const { id } = req.params;
    const schedule = await ScheduleService.getScheduleById(id as string);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule retrieved successfully',
        data: schedule
    });
});

const updateSchedule = catchAsync( async (req : Request, res : Response) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedSchedule = await ScheduleService.updateSchedule(id as string, payload);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule updated successfully',
        data: updatedSchedule
    });
});

const deleteSchedule = catchAsync( async (req : Request, res : Response) => {
    const { id } = req.params;
    await ScheduleService.deleteSchedule(id as string);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule deleted successfully',
    });
}
);

const clearAllSchedules = catchAsync( async (req : Request, res : Response) => {
    const result = await ScheduleService.clearAllSchedules();
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'All schedules cleared successfully',
        data: result,
    });
});

const bulkDeleteSchedules = catchAsync( async (req : Request, res : Response) => {
    const { ids } = req.body;
    const result = await ScheduleService.bulkDeleteSchedules(ids);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Selected schedules deleted successfully',
        data: result,
    });
});

export const ScheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    clearAllSchedules,
    bulkDeleteSchedules,
}