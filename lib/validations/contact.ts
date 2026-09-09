import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .refine((val) => /^(?:\+?88)?01[3-9]\d{8}$/.test(val), {
      message: "Please enter a valid 11-digit Bangladeshi phone number",
    }),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(2000),
});

export type ContactMessageInput = {
  name: string;
  email?: string;
  phone: string;
  company?: string;
  message: string;
};
