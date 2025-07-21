import { z } from "zod";

// Validation schemas for SurveyResponse
export const createSurveyResponseSchema = z.object({
  tourId: z.string().min(1, "tourId is required"),
  userId: z.string().min(1, "userId is required"),
  itineraryId: z.string().min(1, "itineraryId is required"),
});

export const updateSurveyResponseSchema = z
  .object({
    tourId: z.string().optional(),
    userId: z.string().optional(),
    itineraryId: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const surveyResponseIdSchema = z.object({
  id: z.string().min(1, "Invalid survey response ID format"),
});

export const surveyResponseQuerySchema = z.object({
  userId: z.string().optional(),
  tourId: z.string().optional(),
  itineraryId: z.string().optional(),
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

// Validation schemas for SurveyAnswer
export const createSurveyAnswerSchema = z.object({
  surveyResponseId: z.string().min(1, "surveyResponseId is required"),
  questionId: z.string().optional().nullable(),
  language: z.string().min(1, "language is required"),
  questionText: z.string().min(1, "questionText is required"),
  answer: z.string().optional().nullable(),
  answerArray: z.array(z.string()).optional(),
});

export const updateSurveyAnswerSchema = z
  .object({
    questionId: z.string().optional().nullable(),
    language: z.string().optional(),
    questionText: z.string().optional(),
    answer: z.string().optional().nullable(),
    answerArray: z.array(z.string()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const surveyAnswerIdSchema = z.object({
  id: z.string().min(1, "Invalid survey answer ID format"),
});

export const surveyAnswerQuerySchema = z.object({
  surveyResponseId: z.string().optional(),
  questionId: z.string().optional(),
  userId: z.string().optional(),
  language: z.string().optional(),
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
export type CreateSurveyResponseInput = z.infer<
  typeof createSurveyResponseSchema
>;
export type UpdateSurveyResponseInput = z.infer<
  typeof updateSurveyResponseSchema
>;
export type SurveyResponseIdParams = z.infer<typeof surveyResponseIdSchema>;
export type SurveyResponseQueryParams = z.infer<
  typeof surveyResponseQuerySchema
>;

export type CreateSurveyAnswerInput = z.infer<typeof createSurveyAnswerSchema>;
export type UpdateSurveyAnswerInput = z.infer<typeof updateSurveyAnswerSchema>;
export type SurveyAnswerIdParams = z.infer<typeof surveyAnswerIdSchema>;
export type SurveyAnswerQueryParams = z.infer<typeof surveyAnswerQuerySchema>;
