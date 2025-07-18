import { z } from "zod";

// Validation schemas for Auth operations
export const setCustomClaimsSchema = z.object({
  uid: z.string().min(1, "User UID is required"),
  customClaims: z.record(z.any()).optional(),
});

export const revokeTokensSchema = z.object({
  uid: z.string().min(1, "User UID is required"),
});

export const deleteUserSchema = z.object({
  uid: z.string().min(1, "User UID is required"),
});

export const emailParamSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const createCustomTokenSchema = z.object({
  uid: z.string().min(1, "User UID is required"),
  additionalClaims: z.record(z.any()).optional(),
});

// Type exports
export type SetCustomClaimsInput = z.infer<typeof setCustomClaimsSchema>;
export type RevokeTokensInput = z.infer<typeof revokeTokensSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type EmailParams = z.infer<typeof emailParamSchema>;
export type CreateCustomTokenInput = z.infer<typeof createCustomTokenSchema>;
