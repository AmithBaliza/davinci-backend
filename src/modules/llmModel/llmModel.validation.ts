import { z } from "zod";

// Validation schemas for LLMModel
export const createLLMModelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  provider: z.string().min(1, "Provider is required"),
  apiUrl: z.string().url("apiUrl must be a valid URL"),
  apiKey: z.string().min(1, "API key is required"),
  isActive: z.boolean().optional(),
  isBackup: z.boolean().optional(),
  healthStatus: z.boolean().optional(),
  config: z.any().optional(),
});

export const updateLLMModelSchema = z
  .object({
    name: z.string().min(1, "Model name is required").optional(),
    provider: z.string().min(1, "Provider is required").optional(),
    apiUrl: z.string().url("apiUrl must be a valid URL").optional(),
    apiKey: z.string().min(1, "API key is required").optional(),
    isActive: z.boolean().optional(),
    isBackup: z.boolean().optional(),
    healthStatus: z.boolean().optional(),
    config: z.any().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const llmModelIdSchema = z.object({
  id: z.string().min(1, "Invalid LLM model ID format"),
});

export const llmModelQuerySchema = z.object({
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  isBackup: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  provider: z.string().optional(),
  name: z.string().optional(),
  healthStatus: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  limit: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 1 || num > 100) {
        throw new Error("Limit must be between 1 and 100");
      }
      return num;
    })
    .optional(),
  offset: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0) {
        throw new Error("Offset must be non-negative");
      }
      return num;
    })
    .optional(),
});

// Type exports
export type CreateLLMModelInput = z.infer<typeof createLLMModelSchema>;
export type UpdateLLMModelInput = z.infer<typeof updateLLMModelSchema>;
export type LLMModelIdParams = z.infer<typeof llmModelIdSchema>;
export type LLMModelQueryParams = z.infer<typeof llmModelQuerySchema>;
