import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./surveyResponse.controller";
import {
  createSurveyAnswerSchema,
  createSurveyResponseSchema,
  surveyAnswerIdSchema,
  surveyAnswerQuerySchema,
  surveyResponseIdSchema,
  surveyResponseQuerySchema,
  updateSurveyAnswerSchema,
  updateSurveyResponseSchema,
} from "./surveyResponse.validation";

const router = Router();

router.use(authenticateToken);

// SurveyResponse routes
router.post(
  "/",
  validateBody(createSurveyResponseSchema),
  controller.createSurveyResponse,
);
router.get(
  "/",
  validateQuery(surveyResponseQuerySchema),
  controller.getSurveyResponses,
);
router.get(
  "/:id",
  validateParams(surveyResponseIdSchema),
  controller.getSurveyResponseById,
);
router.put(
  "/:id",
  validateParams(surveyResponseIdSchema),
  validateBody(updateSurveyResponseSchema),
  controller.updateSurveyResponse,
);
router.delete(
  "/:id",
  validateParams(surveyResponseIdSchema),
  controller.deleteSurveyResponse,
);

// SurveyAnswer routes
router.post(
  "/answers",
  validateBody(createSurveyAnswerSchema),
  controller.createSurveyAnswer,
);
router.get(
  "/answers",
  validateQuery(surveyAnswerQuerySchema),
  controller.getSurveyAnswers,
);
router.get(
  "/answers/:id",
  validateParams(surveyAnswerIdSchema),
  controller.getSurveyAnswerById,
);
router.put(
  "/answers/:id",
  validateParams(surveyAnswerIdSchema),
  validateBody(updateSurveyAnswerSchema),
  controller.updateSurveyAnswer,
);
router.delete(
  "/answers/:id",
  validateParams(surveyAnswerIdSchema),
  controller.deleteSurveyAnswer,
);

export default router;
