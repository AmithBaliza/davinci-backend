import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./llmModel.controller";
import {
  createLLMModelSchema,
  llmModelIdSchema,
  llmModelQuerySchema,
  updateLLMModelSchema,
} from "./llmModel.validation";

const router = Router();

router.use(authenticateToken);

// Create
router.post("/", validateBody(createLLMModelSchema), controller.createLLMModel);

// Read all
router.get("/", validateQuery(llmModelQuerySchema), controller.getLLMModels);

// Read one
router.get(
  "/:id",
  validateParams(llmModelIdSchema),
  controller.getLLMModelById,
);

// Update
router.put(
  "/:id",
  validateParams(llmModelIdSchema),
  validateBody(updateLLMModelSchema),
  controller.updateLLMModel,
);

// Delete
router.delete(
  "/:id",
  validateParams(llmModelIdSchema),
  controller.deleteLLMModel,
);

export default router;
