import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./activatedTicket.controller";
import {
  activatedTicketIdSchema,
  activatedTicketQuerySchema,
  createActivatedTicketSchema,
  updateActivatedTicketSchema,
} from "./activatedTicket.validation";

const router = Router();

router.use(authenticateToken);

// Create
router.post(
  "/",
  validateBody(createActivatedTicketSchema),
  controller.createActivatedTicket,
);

// Read all
router.get(
  "/",
  validateQuery(activatedTicketQuerySchema),
  controller.getActivatedTickets,
);

// Read one
router.get(
  "/:id",
  validateParams(activatedTicketIdSchema),
  controller.getActivatedTicketById,
);

// Update
router.put(
  "/:id",
  validateParams(activatedTicketIdSchema),
  validateBody(updateActivatedTicketSchema),
  controller.updateActivatedTicket,
);

// Delete
router.delete(
  "/:id",
  validateParams(activatedTicketIdSchema),
  controller.deleteActivatedTicket,
);

// Get all active tickets for a user
router.get("/user/active", controller.getActiveTicketsForUser);

export default router;
