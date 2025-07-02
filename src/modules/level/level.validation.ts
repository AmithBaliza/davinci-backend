import { z } from "zod";

// Base validation schemas for Level model
export const createLevelSchema = z.object({
  culturalExhibitId: z.string().uuid("Invalid cultural exhibit ID format"),
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
  mainImage: z.string().url("Invalid main image URL"),
  mapImage: z.string().url("Invalid map image URL"),
  order: z
    .number()
    .int("Order must be an integer")
    .min(0, "Order must be non-negative"),
});

export const updateLevelSchema = z
  .object({
    culturalExhibitId: z
      .string()
      .uuid("Invalid cultural exhibit ID format")
      .optional(),
    name: z.record(z.string().min(1, "Name cannot be empty")).optional(),
    description: z
      .record(z.string().min(1, "Description cannot be empty"))
      .optional(),
    mainImage: z.string().url("Invalid main image URL").optional(),
    mapImage: z.string().url("Invalid map image URL").optional(),
    order: z
      .number()
      .int("Order must be an integer")
      .min(0, "Order must be non-negative")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

export const levelIdSchema = z.object({
  id: z.string().uuid("Invalid level ID format"),
});

export const levelQuerySchema = z.object({
  culturalExhibitId: z
    .string()
    .uuid("Invalid cultural exhibit ID format")
    .optional(),
  order: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0) {
        throw new Error("Order must be non-negative");
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
export type CreateLevelInput = z.infer<typeof createLevelSchema>;
export type UpdateLevelInput = z.infer<typeof updateLevelSchema>;
export type LevelIdParams = z.infer<typeof levelIdSchema>;
export type LevelQueryParams = z.infer<typeof levelQuerySchema>;
