import { z } from "zod";

// Enum validation
export const CulturalPieceTypeEnum = z.enum([
  "MONUMENT",
  "PAINTING",
  "SCULPTURE",
]);

// Validation schemas for CulturalPiece model
export const createCulturalPieceSchema = z.object({
  name: z
    .record(z.string().min(1, "Name cannot be empty"))
    .refine(
      (obj) => Object.keys(obj).length > 0,
      "Name is required in at least one language",
    ),
  shortDescription: z
    .record(z.string().min(1, "Short description cannot be empty"))
    .refine(
      (obj) => Object.keys(obj).length > 0,
      "Short description is required in at least one language",
    ),
  aiDescription: z
    .record(z.string().min(1, "AI description cannot be empty"))
    .refine(
      (obj) => Object.keys(obj).length > 0,
      "AI description is required in at least one language",
    ),
  initialGreetingText: z
    .record(z.string().min(1, "Initial greeting text cannot be empty"))
    .refine(
      (obj) => Object.keys(obj).length > 0,
      "Initial greeting text is required in at least one language",
    ),
  greetingAudioAvailable: z.boolean(),
  isActive: z.boolean().default(true),
  type: CulturalPieceTypeEnum,
  coordinates: z
    .record(z.union([z.string(), z.number()]))
    .nullable()
    .optional(),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  marker: z
    .record(z.union([z.string(), z.number()]))
    .nullable()
    .optional(),
  video: z.string().url("Invalid video URL").nullable().optional(),
  culturalExhibitId: z.string().uuid("Invalid cultural exhibit ID format"),
  levelId: z.string().uuid("Invalid level ID format"),
  exhibitSpaceId: z.string().uuid("Invalid exhibit space ID format"),
  initialGreetingAudios: z.record(z.string().url("Invalid audio URL")),
});

export const updateCulturalPieceSchema = z
  .object({
    name: z.record(z.string().min(1, "Name cannot be empty")).optional(),
    shortDescription: z
      .record(z.string().min(1, "Short description cannot be empty"))
      .optional(),
    aiDescription: z
      .record(z.string().min(1, "AI description cannot be empty"))
      .optional(),
    initialGreetingText: z
      .record(z.string().min(1, "Initial greeting text cannot be empty"))
      .optional(),
    greetingAudioAvailable: z.boolean().optional(),
    isActive: z.boolean().optional(),
    type: CulturalPieceTypeEnum.optional(),
    coordinates: z
      .record(z.union([z.string(), z.number()]))
      .nullable()
      .optional(),
    images: z.array(z.string().url("Invalid image URL")).optional(),
    marker: z
      .record(z.union([z.string(), z.number()]))
      .nullable()
      .optional(),
    video: z.string().url("Invalid video URL").nullable().optional(),
    culturalExhibitId: z
      .string()
      .uuid("Invalid cultural exhibit ID format")
      .optional(),
    levelId: z.string().uuid("Invalid level ID format").optional(),
    exhibitSpaceId: z
      .string()
      .uuid("Invalid exhibit space ID format")
      .optional(),
    initialGreetingAudios: z
      .record(z.string().url("Invalid audio URL"))
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

export const culturalPieceIdSchema = z.object({
  id: z.string().uuid("Invalid cultural piece ID format"),
});

export const culturalPieceQuerySchema = z.object({
  culturalExhibitId: z
    .string()
    .uuid("Invalid cultural exhibit ID format")
    .optional(),
  levelId: z.string().uuid("Invalid level ID format").optional(),
  exhibitSpaceId: z.string().uuid("Invalid exhibit space ID format").optional(),
  type: CulturalPieceTypeEnum.optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  greetingAudioAvailable: z
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
export type CreateCulturalPieceInput = z.infer<
  typeof createCulturalPieceSchema
>;
export type UpdateCulturalPieceInput = z.infer<
  typeof updateCulturalPieceSchema
>;
export type CulturalPieceIdParams = z.infer<typeof culturalPieceIdSchema>;
export type CulturalPieceQueryParams = z.infer<typeof culturalPieceQuerySchema>;
export type CulturalPieceType = z.infer<typeof CulturalPieceTypeEnum>;
