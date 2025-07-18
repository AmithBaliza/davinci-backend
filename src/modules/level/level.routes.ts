import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./level.controller";
import {
  createLevelSchema,
  levelIdSchema,
  levelQuerySchema,
  updateLevelSchema,
} from "./level.validation";

import { authenticateToken } from "../../middlewares/auth";

const router = Router();

router.use(authenticateToken);

router.post("/", validateBody(createLevelSchema), controller.createLevel);
router.get("/", validateQuery(levelQuerySchema), controller.getLevels);
router.get("/:id", validateParams(levelIdSchema), controller.getLevelById);
router.put(
  "/:id",
  validateParams(levelIdSchema),
  validateBody(updateLevelSchema),
  controller.updateLevel,
);
router.delete("/:id", validateParams(levelIdSchema), controller.deleteLevel);

export default router;
