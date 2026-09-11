import { z } from "zod";

export const storeSettingsSchema = z.object({
  storeName: z.string().trim().min(2, "Store name is required"),
  tagline: z.string().trim().min(2, "Tagline is required"),
  hotline: z.string().trim().min(5, "Hotline number is required"),
  whatsapp: z.string().trim().min(5, "WhatsApp number is required"),
  email: z.string().trim().email("Invalid email address"),
  address: z.string().trim().min(5, "Showroom address is required"),
  operatingHours: z.string().trim().min(3, "Operating hours are required"),
  shippingDhaka: z.number().min(0, "Inside Dhaka shipping cost must be >= 0"),
  shippingOutside: z.number().min(0, "Outside Dhaka shipping cost must be >= 0"),
  bkashNumber: z.string().trim().min(5, "bKash merchant/personal number is required"),
  facebookUrl: z.string().trim().url("Invalid Facebook URL").optional().or(z.literal("")),
  instagramUrl: z.string().trim().url("Invalid Instagram URL").optional().or(z.literal("")),
  metaPixelId: z.string().trim().optional().or(z.literal("")),
  metaCapiToken: z.string().trim().optional().or(z.literal("")),
  metaTestEventCode: z.string().trim().optional().or(z.literal("")),
  metaDomainVerification: z.string().trim().optional().or(z.literal("")),
  isMetaTrackingEnabled: z.boolean().optional(),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
