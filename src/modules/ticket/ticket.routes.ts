import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./ticket.controller";
import {
  createTicketSchema,
  ticketIdSchema,
  ticketQuerySchema,
  updateTicketSchema,
} from "./ticket.validation";

import { authenticateToken } from "../../middlewares/auth";

const router = Router();

router.use(authenticateToken);

router.post("/", validateBody(createTicketSchema), controller.createTicket);
router.get("/", validateQuery(ticketQuerySchema), controller.getTickets);
router.get("/:id", validateParams(ticketIdSchema), controller.getTicketById);
router.put(
  "/:id",
  validateParams(ticketIdSchema),
  validateBody(updateTicketSchema),
  controller.updateTicket,
);
router.delete("/:id", validateParams(ticketIdSchema), controller.deleteTicket);

export default router;
