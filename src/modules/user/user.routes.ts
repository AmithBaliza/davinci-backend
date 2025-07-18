import { Router } from "express";
import { authenticateToken, requireRole } from "../../middlewares/auth";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validation";
import * as controller from "./user.controller";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  userQuerySchema,
} from "./user.validation";

const router = Router();

// Public routes (no authentication required)
router.post("/", validateBody(createUserSchema), controller.createUser);

// Protected routes (authentication required)
router.use(authenticateToken);

// Current user routes
router.get("/me", controller.getCurrentUser);
router.put("/me", validateBody(updateUserSchema), controller.updateCurrentUser);
router.post("/me/sync", controller.syncUserFromFirebase);
router.patch(
  "/me/notifications/increment",
  controller.incrementNotificationCount,
);
router.patch("/me/notifications/reset", controller.resetNotificationCount);

// Admin routes (require SUPERADMIN role)
router.get(
  "/",
  requireRole("SUPERADMIN"),
  validateQuery(userQuerySchema),
  controller.getUsers,
);
router.get("/stats", requireRole("SUPERADMIN"), controller.getUserStats);
router.get(
  "/:id",
  requireRole("SUPERADMIN"),
  validateParams(userIdSchema),
  controller.getUserById,
);
router.put(
  "/:id",
  requireRole("SUPERADMIN"),
  validateParams(userIdSchema),
  validateBody(updateUserSchema),
  controller.updateUser,
);
router.delete(
  "/:id",
  requireRole("SUPERADMIN"),
  validateParams(userIdSchema),
  controller.deleteUser,
);

export default router;
