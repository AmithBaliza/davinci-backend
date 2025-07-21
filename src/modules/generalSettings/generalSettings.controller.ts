import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import * as generalSettingsService from "./generalSettings.service";

export const getGeneralSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await generalSettingsService.getGeneralSettings();
    if (!settings) {
      return sendError(res, "General settings not found", 404);
    }
    sendSuccess(res, settings, "General settings retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve general settings", 500, error);
  }
};

export const updateGeneralSettings = async (req: Request, res: Response) => {
  try {
    const settings = await generalSettingsService.updateGeneralSettings(
      req.body,
    );
    sendSuccess(res, settings, "General settings updated successfully");
  } catch (error) {
    sendError(res, "Failed to update general settings", 400, error);
  }
};
