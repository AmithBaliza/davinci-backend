import { z } from "zod";

// Validation schemas for SurveyQuestion
export const createSurveyQuestionSchema = z.object({
  isActive: z.boolean().optional(),
  isOptional: z.boolean().optional(),
  order: z.number().int("Order must be an integer"),
  type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "INPUT", "RATING"]),
  questions: z.record(z.string()),
  answers: z.record(z.any()),
});

export const updateSurveyQuestionSchema = z
  .object({
    isActive: z.boolean().optional(),
    isOptional: z.boolean().optional(),
    order: z.number().int("Order must be an integer").optional(),
    type: z
      .enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "INPUT", "RATING"])
      .optional(),
    questions: z.record(z.string()).optional(),
    answers: z.record(z.any()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const surveyQuestionIdSchema = z.object({
  id: z.string().min(1, "Invalid survey question ID format"),
});

export const surveyQuestionQuerySchema = z.object({
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  type: z
    .enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "INPUT", "RATING"])
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
export type CreateSurveyQuestionInput = z.infer<
  typeof createSurveyQuestionSchema
>;
export type UpdateSurveyQuestionInput = z.infer<
  typeof updateSurveyQuestionSchema
>;
export type SurveyQuestionIdParams = z.infer<typeof surveyQuestionIdSchema>;
export type SurveyQuestionQueryParams = z.infer<
  typeof surveyQuestionQuerySchema
>;
