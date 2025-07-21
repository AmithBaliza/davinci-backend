import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./surveyQuestion.controller";
import {
  createSurveyQuestionSchema,
  surveyQuestionIdSchema,
  surveyQuestionQuerySchema,
  updateSurveyQuestionSchema,
} from "./surveyQuestion.validation";

const router = Router();

router.use(authenticateToken);

// Create
router.post(
  "/",
  validateBody(createSurveyQuestionSchema),
  controller.createSurveyQuestion,
);

// Read all
router.get(
  "/",
  validateQuery(surveyQuestionQuerySchema),
  controller.getSurveyQuestions,
);

// Read one
router.get(
  "/:id",
  validateParams(surveyQuestionIdSchema),
  controller.getSurveyQuestionById,
);

// Update
router.put(
  "/:id",
  validateParams(surveyQuestionIdSchema),
  validateBody(updateSurveyQuestionSchema),
  controller.updateSurveyQuestion,
);

// Delete
router.delete(
  "/:id",
  validateParams(surveyQuestionIdSchema),
  controller.deleteSurveyQuestion,
);

export default router;
