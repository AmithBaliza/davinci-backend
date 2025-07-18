import { z } from "zod";

// Enum validations
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHERS"]);
export const LanguageEnum = z.enum(["en", "es", "ca", "pt", "fr", "de", "it"]);
export const RoleEnum = z.enum(["USER", "SUPERADMIN"]);

// Validation schemas for User model
export const createUserSchema = z.object({
  firebaseUid: z.string().min(1, "Firebase UID is required"),
  ambientMusic: z.boolean().default(true),
  communicationEnabled: z.boolean().default(true),
  deviceModel: z.string().optional(),
  deviceType: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  gender: GenderEnum.optional(),
  ipAddress: z.string().ip("Invalid IP address").optional(),
  isPrivacyPolicyEnabled: z.boolean().default(false),
  language: LanguageEnum.default("en"),
  role: RoleEnum.default("USER"),
  yearOfBirth: z.string().optional(),
  notificationCount: z
    .number()
    .int("Notification count must be an integer")
    .min(0, "Notification count cannot be negative")
    .default(0),
});

export const updateUserSchema = z
  .object({
    ambientMusic: z.boolean().optional(),
    communicationEnabled: z.boolean().optional(),
    deviceModel: z.string().optional(),
    deviceType: z.string().optional(),
    name: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    gender: GenderEnum.optional(),
    ipAddress: z.string().ip("Invalid IP address").optional(),
    isPrivacyPolicyEnabled: z.boolean().optional(),
    language: LanguageEnum.optional(),
    role: RoleEnum.optional(),
    yearOfBirth: z.string().optional(),
    notificationCount: z
      .number()
      .int("Notification count must be an integer")
      .min(0, "Notification count cannot be negative")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

export const userIdSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

export const userQuerySchema = z.object({
  role: RoleEnum.optional(),
  language: LanguageEnum.optional(),
  gender: GenderEnum.optional(),
  isPrivacyPolicyEnabled: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  ambientMusic: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  communicationEnabled: z
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

// Firebase UID validation for sync operations
export const firebaseUidSchema = z.object({
  firebaseUid: z.string().min(1, "Firebase UID is required"),
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdSchema>;
export type UserQueryParams = z.infer<typeof userQuerySchema>;
export type FirebaseUidParams = z.infer<typeof firebaseUidSchema>;
export type Gender = z.infer<typeof GenderEnum>;
export type Language = z.infer<typeof LanguageEnum>;
export type Role = z.infer<typeof RoleEnum>;
