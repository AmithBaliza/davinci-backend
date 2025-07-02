import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as culturalExhibitService from "./culturalExhibit.service";

export const createCulturalExhibit = async (req: Request, res: Response) => {
  try {
    const exhibit = await culturalExhibitService.createCulturalExhibit(
      req.body,
    );
    sendCreated(res, exhibit, "Cultural exhibit created successfully");
  } catch (error) {
    sendError(res, "Failed to create cultural exhibit", 400, error);
  }
};

export const getCulturalExhibits = async (_req: Request, res: Response) => {
  try {
    const exhibits = await culturalExhibitService.getCulturalExhibits();
    sendSuccess(res, exhibits, "Cultural exhibits retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve cultural exhibits", 500, error);
  }
};

export const getCulturalExhibitById = async (req: Request, res: Response) => {
  try {
    const exhibit = await culturalExhibitService.getCulturalExhibitById(
      req.params.id,
    );
    if (!exhibit) {
      throw new CustomError("Cultural exhibit not found", 404);
    }
    sendSuccess(res, exhibit, "Cultural exhibit retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve cultural exhibit", 500, error);
    }
  }
};

export const updateCulturalExhibit = async (req: Request, res: Response) => {
  try {
    const exhibit = await culturalExhibitService.updateCulturalExhibit(
      req.params.id,
      req.body,
    );
    sendSuccess(res, exhibit, "Cultural exhibit updated successfully");
  } catch (error) {
    sendError(res, "Failed to update cultural exhibit", 400, error);
  }
};

export const deleteCulturalExhibit = async (req: Request, res: Response) => {
  try {
    await culturalExhibitService.deleteCulturalExhibit(req.params.id);
    sendNoContent(res, "Cultural exhibit deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete cultural exhibit", 500, error);
  }
};
