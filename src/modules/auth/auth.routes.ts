import { Router } from "express";
import { authenticateToken, requireRole } from "../../middlewares/auth";
import { validateBody, validateParams } from "../../middlewares/validation";
import * as controller from "./auth.controller";
import {
  createCustomTokenSchema,
  deleteUserSchema,
  emailParamSchema,
  revokeTokensSchema,
  setCustomClaimsSchema,
} from "./auth.validation";

const router = Router();

// Public routes for token verification
router.post("/verify", authenticateToken, controller.verifyToken);

// Protected routes (authentication required)
router.use(authenticateToken);

// User routes
router.post("/refresh", controller.refreshUserData);

// Admin routes (require SUPERADMIN role)
router.post(
  "/custom-claims",
  requireRole("SUPERADMIN"),
  validateBody(setCustomClaimsSchema),
  controller.setCustomClaims,
);

router.post(
  "/revoke-tokens",
  requireRole("SUPERADMIN"),
  validateBody(revokeTokensSchema),
  controller.revokeRefreshTokens,
);

router.delete(
  "/user",
  requireRole("SUPERADMIN"),
  validateBody(deleteUserSchema),
  controller.deleteFirebaseUser,
);

router.get(
  "/user/:email",
  requireRole("SUPERADMIN"),
  validateParams(emailParamSchema),
  controller.getUserByEmail,
);

router.post(
  "/custom-token",
  requireRole("SUPERADMIN"),
  validateBody(createCustomTokenSchema),
  controller.createCustomToken,
);

export default router;
