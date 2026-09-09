import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Product slug is required"),
  image: z.string().min(1, "Product image is required"),
  price: z.number().nonnegative("Price must be a valid positive number"),
  selectedSize: z.string().min(1, "Size must be selected"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .refine((val) => /^(?:\+?88)?01[3-9]\d{8}$/.test(val), {
      message: "Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX)",
    }),
  address: z
    .string()
    .trim()
    .min(5, "Delivery address must be at least 5 characters")
    .max(300, "Delivery address must not exceed 300 characters"),
  district: z.string().trim().min(2, "District is required").default("Dhaka"),
  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters").optional().default(""),
  paymentMethod: z.enum(["cod", "bkash"]),
  shippingArea: z.enum(["inside_dhaka", "outside_dhaka"]).default("inside_dhaka"),
  items: z
    .array(orderItemSchema)
    .min(1, "Cart cannot be empty. Please add at least one product."),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  status: z.enum(["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
