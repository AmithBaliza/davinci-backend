import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./exhibitSpace.controller";
import {
  createExhibitSpaceSchema,
  exhibitSpaceIdSchema,
  exhibitSpaceQuerySchema,
  updateExhibitSpaceSchema,
} from "./exhibitSpace.validation";

import { authenticateToken } from "../../middlewares/auth";

const router = Router();

router.use(authenticateToken);

router.post(
  "/",
  validateBody(createExhibitSpaceSchema),
  controller.createExhibitSpace,
);
router.get(
  "/",
  validateQuery(exhibitSpaceQuerySchema),
  controller.getExhibitSpaces,
);
router.get(
  "/:id",
  validateParams(exhibitSpaceIdSchema),
  controller.getExhibitSpaceById,
);
router.put(
  "/:id",
  validateParams(exhibitSpaceIdSchema),
  validateBody(updateExhibitSpaceSchema),
  controller.updateExhibitSpace,
);
router.delete(
  "/:id",
  validateParams(exhibitSpaceIdSchema),
  controller.deleteExhibitSpace,
);

export default router;
