import { z } from "zod";

// Base validation schemas based on actual Prisma schema
export const createCulturalExhibitSchema = z.object({
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
  importantNotice: z.record(z.string()),
  city: z.string().min(1, "City is required"),
  comingSoon: z.boolean(),
  closingTime: z.string().datetime("Invalid closing time format"),
  disableGroup: z.boolean(),
  geoCoordinates: z.record(z.union([z.string(), z.number()])),
  gpsAvailable: z.boolean(),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  openingTime: z.string().datetime("Invalid opening time format"),
  priority: z.number().int("Priority must be an integer"),
  textOnly: z.boolean(),
});

export const updateCulturalExhibitSchema = z
  .object({
    name: z.record(z.string().min(1, "Name cannot be empty")).optional(),
    description: z
      .record(z.string().min(1, "Description cannot be empty"))
      .optional(),
    ai: z.record(z.string().min(1, "AI prompt cannot be empty")).optional(),
    importantNotice: z.record(z.string()).optional(),
    city: z.string().min(1, "City cannot be empty").optional(),
    comingSoon: z.boolean().optional(),
    closingTime: z.string().datetime("Invalid closing time format").optional(),
    disableGroup: z.boolean().optional(),
    geoCoordinates: z.record(z.union([z.string(), z.number()])).optional(),
    gpsAvailable: z.boolean().optional(),
    images: z.array(z.string().url("Invalid image URL")).optional(),
    openingTime: z.string().datetime("Invalid opening time format").optional(),
    priority: z.number().int("Priority must be an integer").optional(),
    textOnly: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

export const exhibitIdSchema = z.object({
  id: z.string().uuid("Invalid exhibit ID format"),
});

export const exhibitQuerySchema = z.object({
  city: z.string().optional(),
  comingSoon: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  gpsAvailable: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  textOnly: z
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
export type CreateCulturalExhibitInput = z.infer<
  typeof createCulturalExhibitSchema
>;
export type UpdateCulturalExhibitInput = z.infer<
  typeof updateCulturalExhibitSchema
>;
export type ExhibitIdParams = z.infer<typeof exhibitIdSchema>;
export type ExhibitQueryParams = z.infer<typeof exhibitQuerySchema>;
