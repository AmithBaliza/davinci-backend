import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as levelService from "./level.service";

export const createLevel = async (req: Request, res: Response) => {
  try {
    const level = await levelService.createLevel(req.body);
    sendCreated(res, level, "Level created successfully");
  } catch (error) {
    sendError(res, "Failed to create level", 400, error);
  }
};

export const getLevels = async (req: Request, res: Response) => {
  try {
    const { culturalExhibitId, order, limit, offset } = req.query;
    const levels = await levelService.getLevels({
      culturalExhibitId: culturalExhibitId as string | undefined,
      order: order !== undefined ? Number(order) : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, levels, "Levels retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve levels", 500, error);
  }
};

export const getLevelById = async (req: Request, res: Response) => {
  try {
    const level = await levelService.getLevelById(req.params.id);
    if (!level) {
      throw new CustomError("Level not found", 404);
    }
    sendSuccess(res, level, "Level retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve level", 500, error);
    }
  }
};

export const updateLevel = async (req: Request, res: Response) => {
  try {
    const level = await levelService.updateLevel(req.params.id, req.body);
    sendSuccess(res, level, "Level updated successfully");
  } catch (error) {
    sendError(res, "Failed to update level", 400, error);
  }
};

export const deleteLevel = async (req: Request, res: Response) => {
  try {
    await levelService.deleteLevel(req.params.id);
    sendNoContent(res, "Level deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete level", 500, error);
  }
};
