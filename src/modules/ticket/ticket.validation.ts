import { z } from "zod";

// Enum validation
export const TicketTypeEnum = z.enum(["POPULAR", "MUSEUM", "MONUMENT", "CITY"]);

// Validation schemas for Ticket model
export const createTicketSchema = z
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
    city: z.string().min(1, "City is required"),
    comingSoon: z.boolean().default(false),
    isRecommended: z.boolean().default(false),
    images: z.array(z.string().url("Invalid image URL")).default([]),
    maxTime: z
      .number()
      .int("Max time must be an integer")
      .min(1, "Max time must be at least 1 minute"),
    price: z.number().min(0, "Price cannot be negative"),
    priority: z
      .number()
      .int("Priority must be an integer")
      .min(0, "Priority cannot be negative"),
    onOffer: z.boolean().default(false),
    offerPrice: z
      .number()
      .min(0, "Offer price cannot be negative")
      .nullable()
      .optional(),
    recommendedVisitTime: z
      .string()
      .min(1, "Recommended visit time is required"),
    type: TicketTypeEnum,
    culturalExhibitId: z.string().uuid("Invalid cultural exhibit ID format"),
  })
  .refine(
    (data) => {
      if (
        data.onOffer &&
        (data.offerPrice === null || data.offerPrice === undefined)
      ) {
        return false;
      }
      if (
        data.onOffer &&
        data.offerPrice !== null &&
        data.offerPrice !== undefined &&
        data.offerPrice >= data.price
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "When on offer, offer price must be provided and less than regular price",
      path: ["offerPrice"],
    },
  );

export const updateTicketSchema = z
  .object({
    name: z.record(z.string().min(1, "Name cannot be empty")).optional(),
    description: z
      .record(z.string().min(1, "Description cannot be empty"))
      .optional(),
    city: z.string().min(1, "City cannot be empty").optional(),
    comingSoon: z.boolean().optional(),
    isRecommended: z.boolean().optional(),
    images: z.array(z.string().url("Invalid image URL")).optional(),
    maxTime: z
      .number()
      .int("Max time must be an integer")
      .min(1, "Max time must be at least 1 minute")
      .optional(),
    price: z.number().min(0, "Price cannot be negative").optional(),
    priority: z
      .number()
      .int("Priority must be an integer")
      .min(0, "Priority cannot be negative")
      .optional(),
    onOffer: z.boolean().optional(),
    offerPrice: z
      .number()
      .min(0, "Offer price cannot be negative")
      .nullable()
      .optional(),
    recommendedVisitTime: z
      .string()
      .min(1, "Recommended visit time cannot be empty")
      .optional(),
    type: TicketTypeEnum.optional(),
    culturalExhibitId: z
      .string()
      .uuid("Invalid cultural exhibit ID format")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.onOffer && data.offerPrice === null) {
        return false;
      }
      if (
        data.price !== undefined &&
        data.offerPrice !== undefined &&
        data.offerPrice !== null &&
        data.offerPrice >= data.price
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "When on offer, offer price must be provided and less than regular price",
      path: ["offerPrice"],
    },
  )
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

export const ticketIdSchema = z.object({
  id: z.string().uuid("Invalid ticket ID format"),
});

export const ticketQuerySchema = z.object({
  culturalExhibitId: z
    .string()
    .uuid("Invalid cultural exhibit ID format")
    .optional(),
  city: z.string().optional(),
  type: TicketTypeEnum.optional(),
  comingSoon: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  isRecommended: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  onOffer: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  minPrice: z
    .string()
    .transform((val) => {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0) {
        throw new Error("Min price must be non-negative");
      }
      return num;
    })
    .optional(),
  maxPrice: z
    .string()
    .transform((val) => {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0) {
        throw new Error("Max price must be non-negative");
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
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type TicketIdParams = z.infer<typeof ticketIdSchema>;
export type TicketQueryParams = z.infer<typeof ticketQuerySchema>;
export type TicketType = z.infer<typeof TicketTypeEnum>;
