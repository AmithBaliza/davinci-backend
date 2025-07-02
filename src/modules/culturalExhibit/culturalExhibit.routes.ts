import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./culturalExhibit.controller";
import {
  createCulturalExhibitSchema,
  exhibitIdSchema,
  exhibitQuerySchema,
  updateCulturalExhibitSchema,
} from "./culturalExhibit.validation";

const router = Router();

router.post(
  "/",
  validateBody(createCulturalExhibitSchema),
  controller.createCulturalExhibit,
);
router.get(
  "/",
  validateQuery(exhibitQuerySchema),
  controller.getCulturalExhibits,
);
router.get(
  "/:id",
  validateParams(exhibitIdSchema),
  controller.getCulturalExhibitById,
);
router.put(
  "/:id",
  validateParams(exhibitIdSchema),
  validateBody(updateCulturalExhibitSchema),
  controller.updateCulturalExhibit,
);
router.delete(
  "/:id",
  validateParams(exhibitIdSchema),
  controller.deleteCulturalExhibit,
);

export default router;
