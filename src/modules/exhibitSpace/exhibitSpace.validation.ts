import { z } from "zod";

// Validation schemas for ExhibitSpace model
export const createExhibitSpaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  culturalExhibitId: z.string().uuid("Invalid cultural exhibit ID format"),
  levelId: z.string().uuid("Invalid level ID format"),
  image: z.string().url("Invalid image URL"),
});

export const updateExhibitSpaceSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    culturalExhibitId: z
      .string()
      .uuid("Invalid cultural exhibit ID format")
      .optional(),
    levelId: z.string().uuid("Invalid level ID format").optional(),
    image: z.string().url("Invalid image URL").optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

export const exhibitSpaceIdSchema = z.object({
  id: z.string().uuid("Invalid exhibit space ID format"),
});

export const exhibitSpaceQuerySchema = z.object({
  culturalExhibitId: z
    .string()
    .uuid("Invalid cultural exhibit ID format")
    .optional(),
  levelId: z.string().uuid("Invalid level ID format").optional(),
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
export type CreateExhibitSpaceInput = z.infer<typeof createExhibitSpaceSchema>;
export type UpdateExhibitSpaceInput = z.infer<typeof updateExhibitSpaceSchema>;
export type ExhibitSpaceIdParams = z.infer<typeof exhibitSpaceIdSchema>;
export type ExhibitSpaceQueryParams = z.infer<typeof exhibitSpaceQuerySchema>;
