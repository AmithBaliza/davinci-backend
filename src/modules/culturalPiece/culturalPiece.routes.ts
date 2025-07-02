import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./culturalPiece.controller";
import {
  createCulturalPieceSchema,
  culturalPieceIdSchema,
  culturalPieceQuerySchema,
  updateCulturalPieceSchema,
} from "./culturalPiece.validation";

const router = Router();

router.post(
  "/",
  validateBody(createCulturalPieceSchema),
  controller.createCulturalPiece,
);
router.get(
  "/",
  validateQuery(culturalPieceQuerySchema),
  controller.getCulturalPieces,
);
router.get(
  "/:id",
  validateParams(culturalPieceIdSchema),
  controller.getCulturalPieceById,
);
router.put(
  "/:id",
  validateParams(culturalPieceIdSchema),
  validateBody(updateCulturalPieceSchema),
  controller.updateCulturalPiece,
);
router.delete(
  "/:id",
  validateParams(culturalPieceIdSchema),
  controller.deleteCulturalPiece,
);

export default router;
