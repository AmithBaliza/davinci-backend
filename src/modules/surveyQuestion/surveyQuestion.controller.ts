import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as surveyQuestionService from "./surveyQuestion.service";

export const createSurveyQuestion = async (req: Request, res: Response) => {
  try {
    const question = await surveyQuestionService.createSurveyQuestion(req.body);
    sendCreated(res, question, "Survey question created successfully");
  } catch (error) {
    sendError(res, "Failed to create survey question", 400, error);
  }
};

export const getSurveyQuestions = async (req: Request, res: Response) => {
  try {
    const { isActive, type, limit, offset } = req.query;
    const questions = await surveyQuestionService.getSurveyQuestions({
      isActive: isActive !== undefined ? isActive === "true" : undefined,
      type: type as string | undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, questions, "Survey questions retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve survey questions", 500, error);
  }
};

export const getSurveyQuestionById = async (req: Request, res: Response) => {
  try {
    const question = await surveyQuestionService.getSurveyQuestionById(
      req.params.id,
    );
    if (!question) {
      throw new CustomError("Survey question not found", 404);
    }
    sendSuccess(res, question, "Survey question retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve survey question", 500, error);
    }
  }
};

export const updateSurveyQuestion = async (req: Request, res: Response) => {
  try {
    const question = await surveyQuestionService.updateSurveyQuestion(
      req.params.id,
      req.body,
    );
    sendSuccess(res, question, "Survey question updated successfully");
  } catch (error) {
    sendError(res, "Failed to update survey question", 400, error);
  }
};

export const deleteSurveyQuestion = async (req: Request, res: Response) => {
  try {
    await surveyQuestionService.deleteSurveyQuestion(req.params.id);
    sendNoContent(res, "Survey question deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete survey question", 500, error);
  }
};
