import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  image: z.string().trim().optional().default(""),
  tagline: z.string().trim().max(150, "Tagline must not exceed 150 characters").optional().default(""),
  description: z.string().trim().max(500, "Description must not exceed 500 characters").optional().default(""),
  order: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateCategorySchema = categorySchema.partial();

export type CategoryInput = z.infer<typeof categorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
