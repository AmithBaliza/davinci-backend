import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as exhibitItineraryService from "./exhibitItinerary.service";

export const createExhibitItinerary = async (req: Request, res: Response) => {
  try {
    const itinerary = await exhibitItineraryService.createExhibitItinerary(
      req.body,
    );
    sendCreated(res, itinerary, "Exhibit itinerary created successfully");
  } catch (error) {
    sendError(res, "Failed to create exhibit itinerary", 400, error);
  }
};

export const getExhibitItineraries = async (req: Request, res: Response) => {
  try {
    const {
      culturalExhibitId,
      isActive,
      isCustom,
      isPreferred,
      minDuration,
      maxDuration,
      limit,
      offset,
    } = req.query;
    const itineraries = await exhibitItineraryService.getExhibitItineraries({
      culturalExhibitId: culturalExhibitId as string | undefined,
      isActive: isActive !== undefined ? isActive === "true" : undefined,
      isCustom: isCustom !== undefined ? isCustom === "true" : undefined,
      isPreferred:
        isPreferred !== undefined ? isPreferred === "true" : undefined,
      minDuration: minDuration !== undefined ? Number(minDuration) : undefined,
      maxDuration: maxDuration !== undefined ? Number(maxDuration) : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, itineraries, "Exhibit itineraries retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve exhibit itineraries", 500, error);
  }
};

export const getExhibitItineraryById = async (req: Request, res: Response) => {
  try {
    const itinerary = await exhibitItineraryService.getExhibitItineraryById(
      req.params.id,
    );
    if (!itinerary) {
      throw new CustomError("Exhibit itinerary not found", 404);
    }
    sendSuccess(res, itinerary, "Exhibit itinerary retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve exhibit itinerary", 500, error);
    }
  }
};

export const updateExhibitItinerary = async (req: Request, res: Response) => {
  try {
    const itinerary = await exhibitItineraryService.updateExhibitItinerary(
      req.params.id,
      req.body,
    );
    sendSuccess(res, itinerary, "Exhibit itinerary updated successfully");
  } catch (error) {
    sendError(res, "Failed to update exhibit itinerary", 400, error);
  }
};

export const deleteExhibitItinerary = async (req: Request, res: Response) => {
  try {
    await exhibitItineraryService.deleteExhibitItinerary(req.params.id);
    sendNoContent(res, "Exhibit itinerary deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete exhibit itinerary", 500, error);
  }
};

export const incrementLikes = async (req: Request, res: Response) => {
  try {
    const itinerary = await exhibitItineraryService.incrementLikes(
      req.params.id,
    );
    sendSuccess(res, itinerary, "Likes incremented successfully");
  } catch (error) {
    sendError(res, "Failed to increment likes", 500, error);
  }
};
