import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as llmModelService from "./llmModel.service";

export const createLLMModel = async (req: Request, res: Response) => {
  try {
    const model = await llmModelService.createLLMModel(req.body);
    sendCreated(res, model, "LLM model created successfully");
  } catch (error) {
    sendError(res, "Failed to create LLM model", 400, error);
  }
};

export const getLLMModels = async (req: Request, res: Response) => {
  try {
    const { isActive, isBackup, provider, name, healthStatus, limit, offset } =
      req.query;
    const models = await llmModelService.getLLMModels({
      isActive: isActive !== undefined ? isActive === "true" : undefined,
      isBackup: isBackup !== undefined ? isBackup === "true" : undefined,
      provider: provider as string | undefined,
      name: name as string | undefined,
      healthStatus:
        healthStatus !== undefined ? healthStatus === "true" : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, models, "LLM models retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve LLM models", 500, error);
  }
};

export const getLLMModelById = async (req: Request, res: Response) => {
  try {
    const model = await llmModelService.getLLMModelById(req.params.id);
    if (!model) {
      throw new CustomError("LLM model not found", 404);
    }
    sendSuccess(res, model, "LLM model retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve LLM model", 500, error);
    }
  }
};

export const updateLLMModel = async (req: Request, res: Response) => {
  try {
    const model = await llmModelService.updateLLMModel(req.params.id, req.body);
    sendSuccess(res, model, "LLM model updated successfully");
  } catch (error) {
    sendError(res, "Failed to update LLM model", 400, error);
  }
};

export const deleteLLMModel = async (req: Request, res: Response) => {
  try {
    await llmModelService.deleteLLMModel(req.params.id);
    sendNoContent(res, "LLM model deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete LLM model", 500, error);
  }
};
