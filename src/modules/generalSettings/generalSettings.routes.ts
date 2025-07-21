import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validation";
import * as controller from "./generalSettings.controller";

// Update the single general settings row
import { updateGeneralSettingsSchema } from "./generalSettings.validation";

const router = Router();

router.use(authenticateToken);

// Get the single general settings row
router.get("/", controller.getGeneralSettings);

router.put(
  "/",
  validateBody(updateGeneralSettingsSchema),
  controller.updateGeneralSettings,
);

export default router;
