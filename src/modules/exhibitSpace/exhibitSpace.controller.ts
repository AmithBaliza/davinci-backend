import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as exhibitSpaceService from "./exhibitSpace.service";

export const createExhibitSpace = async (req: Request, res: Response) => {
  try {
    const exhibitSpace = await exhibitSpaceService.createExhibitSpace(req.body);
    sendCreated(res, exhibitSpace, "Exhibit space created successfully");
  } catch (error) {
    sendError(res, "Failed to create exhibit space", 400, error);
  }
};

export const getExhibitSpaces = async (req: Request, res: Response) => {
  try {
    const { culturalExhibitId, levelId, limit, offset } = req.query;
    const exhibitSpaces = await exhibitSpaceService.getExhibitSpaces({
      culturalExhibitId: culturalExhibitId as string | undefined,
      levelId: levelId as string | undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, exhibitSpaces, "Exhibit spaces retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve exhibit spaces", 500, error);
  }
};

export const getExhibitSpaceById = async (req: Request, res: Response) => {
  try {
    const exhibitSpace = await exhibitSpaceService.getExhibitSpaceById(
      req.params.id,
    );
    if (!exhibitSpace) {
      throw new CustomError("Exhibit space not found", 404);
    }
    sendSuccess(res, exhibitSpace, "Exhibit space retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve exhibit space", 500, error);
    }
  }
};

export const updateExhibitSpace = async (req: Request, res: Response) => {
  try {
    const exhibitSpace = await exhibitSpaceService.updateExhibitSpace(
      req.params.id,
      req.body,
    );
    sendSuccess(res, exhibitSpace, "Exhibit space updated successfully");
  } catch (error) {
    sendError(res, "Failed to update exhibit space", 400, error);
  }
};

export const deleteExhibitSpace = async (req: Request, res: Response) => {
  try {
    await exhibitSpaceService.deleteExhibitSpace(req.params.id);
    sendNoContent(res, "Exhibit space deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete exhibit space", 500, error);
  }
};
