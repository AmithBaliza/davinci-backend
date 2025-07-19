import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as tourService from "./tour.service";

export const createTour = async (req: Request, res: Response) => {
  try {
    const tour = await tourService.createTour(req.body);
    sendCreated(res, tour, "Tour created successfully");
  } catch (error) {
    sendError(res, "Failed to create tour", 400, error);
  }
};

export const getTours = async (req: Request, res: Response) => {
  try {
    const {
      adminUserId,
      activatedTicketId,
      exhibitItineraryId,
      culturalExhibitId,
      isStarted,
      userInteracted,
      memberId,
      limit,
      offset,
    } = req.query;
    const tours = await tourService.getTours({
      adminUserId: adminUserId as string | undefined,
      activatedTicketId: activatedTicketId as string | undefined,
      exhibitItineraryId: exhibitItineraryId as string | undefined,
      culturalExhibitId: culturalExhibitId as string | undefined,
      isStarted: isStarted !== undefined ? isStarted === "true" : undefined,
      userInteracted:
        userInteracted !== undefined ? userInteracted === "true" : undefined,
      memberId: memberId as string | undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, tours, "Tours retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve tours", 500, error);
  }
};

export const getTourById = async (req: Request, res: Response) => {
  try {
    const tour = await tourService.getTourById(req.params.id);
    if (!tour) {
      throw new CustomError("Tour not found", 404);
    }
    sendSuccess(res, tour, "Tour retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve tour", 500, error);
    }
  }
};

export const updateTour = async (req: Request, res: Response) => {
  try {
    const tour = await tourService.updateTour(req.params.id, req.body);
    sendSuccess(res, tour, "Tour updated successfully");
  } catch (error) {
    sendError(res, "Failed to update tour", 400, error);
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    await tourService.deleteTour(req.params.id);
    sendNoContent(res, "Tour deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete tour", 500, error);
  }
};
