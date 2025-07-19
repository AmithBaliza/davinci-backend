import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./tour.controller";
import {
  createTourSchema,
  tourIdSchema,
  tourQuerySchema,
  updateTourSchema,
} from "./tour.validation";

const router = Router();

router.use(authenticateToken);

// Create
router.post("/", validateBody(createTourSchema), controller.createTour);

// Read all
router.get("/", validateQuery(tourQuerySchema), controller.getTours);

// Read one
router.get("/:id", validateParams(tourIdSchema), controller.getTourById);

// Update
router.put(
  "/:id",
  validateParams(tourIdSchema),
  validateBody(updateTourSchema),
  controller.updateTour,
);

// Delete
router.delete("/:id", validateParams(tourIdSchema), controller.deleteTour);

export default router;
