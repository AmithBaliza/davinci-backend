import { z } from "zod";

// Validation schema for updating general settings
export const updateGeneralSettingsSchema = z.object({
  activeLLMModelId: z
    .string()
    .min(1, "activeLLMModelId is required")
    .optional(),
  importantNotice: z.record(z.string()).optional(),
  helpBotEnabled: z.boolean().optional(),
});
