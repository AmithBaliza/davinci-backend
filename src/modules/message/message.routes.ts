import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./message.controller";
import {
  createMessageSchema,
  messageIdSchema,
  messageQuerySchema,
  updateMessageSchema,
} from "./message.validation";

const router = Router();

router.use(authenticateToken);

// Create
router.post("/", validateBody(createMessageSchema), controller.createMessage);

// Read all
router.get("/", validateQuery(messageQuerySchema), controller.getMessages);

// Read one
router.get("/:id", validateParams(messageIdSchema), controller.getMessageById);

// Update
router.put(
  "/:id",
  validateParams(messageIdSchema),
  validateBody(updateMessageSchema),
  controller.updateMessage,
);

// Delete
router.delete(
  "/:id",
  validateParams(messageIdSchema),
  controller.deleteMessage,
);

export default router;
