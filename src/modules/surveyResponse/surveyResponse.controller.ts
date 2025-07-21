import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as surveyResponseService from "./surveyResponse.service";

// SurveyResponse

export const createSurveyResponse = async (req: Request, res: Response) => {
  try {
    const response = await surveyResponseService.createSurveyResponse(req.body);
    sendCreated(res, response, "Survey response created successfully");
  } catch (error) {
    sendError(res, "Failed to create survey response", 400, error);
  }
};

export const getSurveyResponses = async (req: Request, res: Response) => {
  try {
    const { userId, tourId, itineraryId, limit, offset } = req.query;
    const responses = await surveyResponseService.getSurveyResponses({
      userId: userId as string | undefined,
      tourId: tourId as string | undefined,
      itineraryId: itineraryId as string | undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, responses, "Survey responses retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve survey responses", 500, error);
  }
};

export const getSurveyResponseById = async (req: Request, res: Response) => {
  try {
    const response = await surveyResponseService.getSurveyResponseById(
      req.params.id,
    );
    if (!response) {
      throw new CustomError("Survey response not found", 404);
    }
    sendSuccess(res, response, "Survey response retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve survey response", 500, error);
    }
  }
};

export const updateSurveyResponse = async (req: Request, res: Response) => {
  try {
    const response = await surveyResponseService.updateSurveyResponse(
      req.params.id,
      req.body,
    );
    sendSuccess(res, response, "Survey response updated successfully");
  } catch (error) {
    sendError(res, "Failed to update survey response", 400, error);
  }
};

export const deleteSurveyResponse = async (req: Request, res: Response) => {
  try {
    await surveyResponseService.deleteSurveyResponse(req.params.id);
    sendNoContent(res, "Survey response deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete survey response", 500, error);
  }
};

// SurveyAnswer

export const createSurveyAnswer = async (req: Request, res: Response) => {
  try {
    const answer = await surveyResponseService.createSurveyAnswer(req.body);
    sendCreated(res, answer, "Survey answer created successfully");
  } catch (error) {
    sendError(res, "Failed to create survey answer", 400, error);
  }
};

export const getSurveyAnswers = async (req: Request, res: Response) => {
  try {
    const { surveyResponseId, questionId, userId, language, limit, offset } =
      req.query;
    const answers = await surveyResponseService.getSurveyAnswers({
      surveyResponseId: surveyResponseId as string | undefined,
      questionId: questionId as string | undefined,
      userId: userId as string | undefined,
      language: language as string | undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, answers, "Survey answers retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve survey answers", 500, error);
  }
};

export const getSurveyAnswerById = async (req: Request, res: Response) => {
  try {
    const answer = await surveyResponseService.getSurveyAnswerById(
      req.params.id,
    );
    if (!answer) {
      throw new CustomError("Survey answer not found", 404);
    }
    sendSuccess(res, answer, "Survey answer retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve survey answer", 500, error);
    }
  }
};

export const updateSurveyAnswer = async (req: Request, res: Response) => {
  try {
    const answer = await surveyResponseService.updateSurveyAnswer(
      req.params.id,
      req.body,
    );
    sendSuccess(res, answer, "Survey answer updated successfully");
  } catch (error) {
    sendError(res, "Failed to update survey answer", 400, error);
  }
};

export const deleteSurveyAnswer = async (req: Request, res: Response) => {
  try {
    await surveyResponseService.deleteSurveyAnswer(req.params.id);
    sendNoContent(res, "Survey answer deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete survey answer", 500, error);
  }
};
