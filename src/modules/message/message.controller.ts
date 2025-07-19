import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as messageService from "./message.service";

export const createMessage = async (req: Request, res: Response) => {
  try {
    const message = await messageService.createMessage(req.body);
    sendCreated(res, message, "Message created successfully");
  } catch (error) {
    sendError(res, "Failed to create message", 400, error);
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      tourId,
      culturalPieceId,
      fromBot,
      isInitial,
      limit,
      offset,
    } = req.query;
    const messages = await messageService.getMessages({
      userId: userId as string | undefined,
      tourId: tourId as string | undefined,
      culturalPieceId: culturalPieceId as string | undefined,
      fromBot: fromBot !== undefined ? fromBot === "true" : undefined,
      isInitial: isInitial !== undefined ? isInitial === "true" : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, messages, "Messages retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve messages", 500, error);
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  try {
    const message = await messageService.getMessageById(req.params.id);
    if (!message) {
      throw new CustomError("Message not found", 404);
    }
    sendSuccess(res, message, "Message retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve message", 500, error);
    }
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const message = await messageService.updateMessage(req.params.id, req.body);
    sendSuccess(res, message, "Message updated successfully");
  } catch (error) {
    sendError(res, "Failed to update message", 400, error);
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    await messageService.deleteMessage(req.params.id);
    sendNoContent(res, "Message deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete message", 500, error);
  }
};
