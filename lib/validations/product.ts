import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters").max(200),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  category: z.string().trim().min(1, "Category is required"),
  categorySlug: z.string().trim().optional(),
  regularPrice: z.number().min(0, "Regular price must be 0 or higher"),
  salePrice: z.number().min(0, "Sale price must be 0 or higher"),
  discountPercentage: z.number().min(0).max(100).optional().default(0),
  image: z.string().trim().min(1, "Primary product image URL is required"),
  galleryImages: z.array(z.string()).default([]),
  stockQuantity: z.number().int().min(0, "Stock quantity must be 0 or more").default(100),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  sizes: z.array(z.string()).min(1, "At least one size must be selected"),
  description: z.string().trim().default(""),
  fabric: z.string().trim().default("100% Premium Cotton"),
  fit: z.string().trim().default("Semi-Slim Fit"),
  sku: z.string().trim().min(1, "SKU is required"),
  rating: z.number().min(1).max(5).default(5),
  reviewsCount: z.number().min(0).default(0),
});

export const updateProductSchema = productSchema.partial();

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
