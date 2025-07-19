import { z } from "zod";

// Validation schemas for Message model
export const createMessageSchema = z.object({
  fromBot: z.boolean(),
  isInitial: z.boolean(),
  text: z.string().min(1, "Message text is required"),
  culturalPieceId: z.string().min(1, "culturalPieceId is required"),
  userId: z.string().optional().nullable(),
  tourId: z.string().min(1, "tourId is required"),
});

export const updateMessageSchema = z
  .object({
    fromBot: z.boolean().optional(),
    isInitial: z.boolean().optional(),
    text: z.string().min(1, "Message text is required").optional(),
    culturalPieceId: z.string().optional(),
    userId: z.string().optional().nullable(),
    tourId: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const messageIdSchema = z.object({
  id: z.string().min(1, "Invalid message ID format"),
});

export const messageQuerySchema = z.object({
  userId: z.string().optional(),
  tourId: z.string().optional(),
  culturalPieceId: z.string().optional(),
  fromBot: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  isInitial: z
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
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
export type MessageIdParams = z.infer<typeof messageIdSchema>;
export type MessageQueryParams = z.infer<typeof messageQuerySchema>;
