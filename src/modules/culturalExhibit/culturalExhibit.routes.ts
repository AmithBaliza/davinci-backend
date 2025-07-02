import { Router } from "express";
import * as controller from "./culturalExhibit.controller";

const router = Router();

router.post("/", controller.createCulturalExhibit);
router.get("/", controller.getCulturalExhibits);
router.get("/:id", controller.getCulturalExhibitById);
router.put("/:id", controller.updateCulturalExhibit);
router.delete("/:id", controller.deleteCulturalExhibit);

export default router;
