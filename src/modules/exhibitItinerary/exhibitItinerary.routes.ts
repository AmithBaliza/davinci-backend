import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./exhibitItinerary.controller";
import {
  createExhibitItinerarySchema,
  exhibitItineraryIdSchema,
  exhibitItineraryQuerySchema,
  updateExhibitItinerarySchema,
} from "./exhibitItinerary.validation";

const router = Router();

router.post(
  "/",
  validateBody(createExhibitItinerarySchema),
  controller.createExhibitItinerary,
);
router.get(
  "/",
  validateQuery(exhibitItineraryQuerySchema),
  controller.getExhibitItineraries,
);
router.get(
  "/:id",
  validateParams(exhibitItineraryIdSchema),
  controller.getExhibitItineraryById,
);
router.put(
  "/:id",
  validateParams(exhibitItineraryIdSchema),
  validateBody(updateExhibitItinerarySchema),
  controller.updateExhibitItinerary,
);
router.delete(
  "/:id",
  validateParams(exhibitItineraryIdSchema),
  controller.deleteExhibitItinerary,
);
router.patch(
  "/:id/like",
  validateParams(exhibitItineraryIdSchema),
  controller.incrementLikes,
);

export default router;
