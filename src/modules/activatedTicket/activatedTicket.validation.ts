import { z } from "zod";

// Validation schemas for ActivatedTicket model
export const createActivatedTicketSchema = z.object({
  isActivated: z.boolean().optional(),
  isExpired: z.boolean().optional(),
  isFree: z.boolean(),
  isPhysical: z.boolean(),
  images: z.array(z.string()).default([]),
  maxTime: z.number().int("maxTime must be an integer"),
  name: z.string().min(1, "Name is required"),
  price: z.number(),
  culturalExhibitId: z.string().min(1, "culturalExhibitId is required"),
  ticketId: z.string().min(1, "ticketId is required"),
  userId: z.string().optional().nullable(),
  expirationTime: z
    .string()
    .datetime({ message: "expirationTime must be a valid ISO date string" })
    .optional()
    .nullable(),
});

export const updateActivatedTicketSchema = z
  .object({
    isActivated: z.boolean().optional(),
    isExpired: z.boolean().optional(),
    isFree: z.boolean().optional(),
    isPhysical: z.boolean().optional(),
    images: z.array(z.string()).optional(),
    maxTime: z.number().int("maxTime must be an integer").optional(),
    name: z.string().min(1, "Name is required").optional(),
    price: z.number().optional(),
    culturalExhibitId: z.string().optional(),
    ticketId: z.string().optional(),
    userId: z.string().optional().nullable(),
    expirationTime: z
      .string()
      .datetime({ message: "expirationTime must be a valid ISO date string" })
      .optional()
      .nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const activatedTicketIdSchema = z.object({
  id: z.string().min(1, "Invalid activated ticket ID format"),
});

export const activatedTicketQuerySchema = z.object({
  userId: z.string().optional(),
  ticketId: z.string().optional(),
  culturalExhibitId: z.string().optional(),
  isActivated: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  isExpired: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  isFree: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  isPhysical: z
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
export type CreateActivatedTicketInput = z.infer<
  typeof createActivatedTicketSchema
>;
export type UpdateActivatedTicketInput = z.infer<
  typeof updateActivatedTicketSchema
>;
export type ActivatedTicketIdParams = z.infer<typeof activatedTicketIdSchema>;
export type ActivatedTicketQueryParams = z.infer<
  typeof activatedTicketQuerySchema
>;
