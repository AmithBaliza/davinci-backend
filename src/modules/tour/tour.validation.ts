import { z } from "zod";

// Validation schemas for Tour model
export const createTourSchema = z.object({
  isStarted: z.boolean().optional(),
  userInteracted: z.boolean().optional(),
  adminUserId: z.string().min(1, "adminUserId is required"),
  activatedTicketId: z.string().min(1, "activatedTicketId is required"),
  exhibitItineraryId: z.string().min(1, "exhibitItineraryId is required"),
  culturalExhibitId: z.string().min(1, "culturalExhibitId is required"),
  memberIds: z.array(z.string()).min(1, "At least one member is required"),
  endedAt: z
    .string()
    .datetime({ message: "endedAt must be a valid ISO date string" })
    .optional()
    .nullable(),
});

export const updateTourSchema = z
  .object({
    isStarted: z.boolean().optional(),
    userInteracted: z.boolean().optional(),
    adminUserId: z.string().optional(),
    activatedTicketId: z.string().optional(),
    exhibitItineraryId: z.string().optional(),
    culturalExhibitId: z.string().optional(),
    memberIds: z.array(z.string()).optional(),
    endedAt: z
      .string()
      .datetime({ message: "endedAt must be a valid ISO date string" })
      .optional()
      .nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const tourIdSchema = z.object({
  id: z.string().min(1, "Invalid tour ID format"),
});

export const tourQuerySchema = z.object({
  adminUserId: z.string().optional(),
  activatedTicketId: z.string().optional(),
  exhibitItineraryId: z.string().optional(),
  culturalExhibitId: z.string().optional(),
  isStarted: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  userInteracted: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  memberId: z.string().optional(),
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
export type CreateTourInput = z.infer<typeof createTourSchema>;
export type UpdateTourInput = z.infer<typeof updateTourSchema>;
export type TourIdParams = z.infer<typeof tourIdSchema>;
export type TourQueryParams = z.infer<typeof tourQuerySchema>;
