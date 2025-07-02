import { z } from "zod";

// Validation schemas for ExhibitItinerary model
export const createExhibitItinerarySchema = z
  .object({
    name: z
      .record(z.string().min(1, "Name cannot be empty"))
      .refine(
        (obj) => Object.keys(obj).length > 0,
        "Name is required in at least one language",
      ),
    description: z
      .record(z.string().min(1, "Description cannot be empty"))
      .refine(
        (obj) => Object.keys(obj).length > 0,
        "Description is required in at least one language",
      ),
    minDuration: z
      .number()
      .int("Min duration must be an integer")
      .min(1, "Min duration must be at least 1 minute"),
    maxDuration: z
      .number()
      .int("Max duration must be an integer")
      .min(1, "Max duration must be at least 1 minute"),
    isActive: z.boolean().default(true),
    isCustom: z.boolean().default(false),
    isPreferred: z.boolean().default(false),
    likes: z
      .number()
      .int("Likes must be an integer")
      .min(0, "Likes cannot be negative")
      .default(0),
    images: z.array(z.string().url("Invalid image URL")).default([]),
    rank: z
      .number()
      .int("Rank must be an integer")
      .min(0, "Rank cannot be negative"),
    culturalPiecesRanking: z.record(z.any()),
    culturalExhibitId: z.string().uuid("Invalid cultural exhibit ID format"),
  })
  .refine((data) => data.maxDuration >= data.minDuration, {
    message: "Max duration must be greater than or equal to min duration",
    path: ["maxDuration"],
  });

export const updateExhibitItinerarySchema = z
  .object({
    name: z.record(z.string().min(1, "Name cannot be empty")).optional(),
    description: z
      .record(z.string().min(1, "Description cannot be empty"))
      .optional(),
    minDuration: z
      .number()
      .int("Min duration must be an integer")
      .min(1, "Min duration must be at least 1 minute")
      .optional(),
    maxDuration: z
      .number()
      .int("Max duration must be an integer")
      .min(1, "Max duration must be at least 1 minute")
      .optional(),
    isActive: z.boolean().optional(),
    isCustom: z.boolean().optional(),
    isPreferred: z.boolean().optional(),
    likes: z
      .number()
      .int("Likes must be an integer")
      .min(0, "Likes cannot be negative")
      .optional(),
    images: z.array(z.string().url("Invalid image URL")).optional(),
    rank: z
      .number()
      .int("Rank must be an integer")
      .min(0, "Rank cannot be negative")
      .optional(),
    culturalPiecesRanking: z.record(z.any()).optional(),
    culturalExhibitId: z
      .string()
      .uuid("Invalid cultural exhibit ID format")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.minDuration !== undefined && data.maxDuration !== undefined) {
        return data.maxDuration >= data.minDuration;
      }
      return true;
    },
    {
      message: "Max duration must be greater than or equal to min duration",
      path: ["maxDuration"],
    },
  )
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

export const exhibitItineraryIdSchema = z.object({
  id: z.string().uuid("Invalid exhibit itinerary ID format"),
});

export const exhibitItineraryQuerySchema = z.object({
  culturalExhibitId: z
    .string()
    .uuid("Invalid cultural exhibit ID format")
    .optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  isCustom: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  isPreferred: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  minDuration: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 1) {
        throw new Error("Min duration must be at least 1");
      }
      return num;
    })
    .optional(),
  maxDuration: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 1) {
        throw new Error("Max duration must be at least 1");
      }
      return num;
    })
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
export type CreateExhibitItineraryInput = z.infer<
  typeof createExhibitItinerarySchema
>;
export type UpdateExhibitItineraryInput = z.infer<
  typeof updateExhibitItinerarySchema
>;
export type ExhibitItineraryIdParams = z.infer<typeof exhibitItineraryIdSchema>;
export type ExhibitItineraryQueryParams = z.infer<
  typeof exhibitItineraryQuerySchema
>;
