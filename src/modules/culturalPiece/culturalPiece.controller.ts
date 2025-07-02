import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as culturalPieceService from "./culturalPiece.service";

export const createCulturalPiece = async (req: Request, res: Response) => {
  try {
    const culturalPiece = await culturalPieceService.createCulturalPiece(
      req.body,
    );
    sendCreated(res, culturalPiece, "Cultural piece created successfully");
  } catch (error) {
    sendError(res, "Failed to create cultural piece", 400, error);
  }
};

export const getCulturalPieces = async (req: Request, res: Response) => {
  try {
    const {
      culturalExhibitId,
      levelId,
      exhibitSpaceId,
      type,
      isActive,
      greetingAudioAvailable,
      limit,
      offset,
    } = req.query;
    const pieces = await culturalPieceService.getCulturalPieces({
      culturalExhibitId: culturalExhibitId as string | undefined,
      levelId: levelId as string | undefined,
      exhibitSpaceId: exhibitSpaceId as string | undefined,
      type: type as string | undefined,
      isActive: isActive !== undefined ? isActive === "true" : undefined,
      greetingAudioAvailable:
        greetingAudioAvailable !== undefined
          ? greetingAudioAvailable === "true"
          : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, pieces, "Cultural pieces retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve cultural pieces", 500, error);
  }
};

export const getCulturalPieceById = async (req: Request, res: Response) => {
  try {
    const piece = await culturalPieceService.getCulturalPieceById(
      req.params.id,
    );
    if (!piece) {
      throw new CustomError("Cultural piece not found", 404);
    }
    sendSuccess(res, piece, "Cultural piece retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve cultural piece", 500, error);
    }
  }
};

export const updateCulturalPiece = async (req: Request, res: Response) => {
  try {
    const piece = await culturalPieceService.updateCulturalPiece(
      req.params.id,
      req.body,
    );
    sendSuccess(res, piece, "Cultural piece updated successfully");
  } catch (error) {
    sendError(res, "Failed to update cultural piece", 400, error);
  }
};

export const deleteCulturalPiece = async (req: Request, res: Response) => {
  try {
    await culturalPieceService.deleteCulturalPiece(req.params.id);
    sendNoContent(res, "Cultural piece deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete cultural piece", 500, error);
  }
};
