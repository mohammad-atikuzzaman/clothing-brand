import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password cannot exceed 100 characters")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*(),.?":{}|<>]).*$/,
      "Password must contain letters and at least one number or special character"
    ),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(100, "Password is too long"),
});

export const blockIpSchema = z.object({
  ip: z
    .string()
    .trim()
    .min(3, "Invalid IP address"),
  reason: z
    .string()
    .trim()
    .min(3, "Reason must be at least 3 characters")
    .max(200, "Reason cannot exceed 200 characters"),
  durationMinutes: z
    .number()
    .int()
    .min(1)
    .max(525600) // max 1 year
    .optional(),
  isPermanent: z.boolean().default(false),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BlockIpInput = z.infer<typeof blockIpSchema>;
