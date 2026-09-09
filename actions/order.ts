"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { OrderModel, IOrderDocument } from "@/lib/models/Order";
import { ProductModel } from "@/lib/models/Product";
import { SettingModel } from "@/lib/models/Setting";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  CreateOrderInput,
} from "@/lib/validations/order";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireAuth, getClientIp, getSession } from "@/lib/auth";
import { isIpBanned, checkRateLimit } from "@/lib/security";
import { escapeRegex } from "@/lib/utils";

export interface SerializedOrder {
  id: string;
  orderId: string;
  userId?: string;
  userEmail?: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  notes?: string;
  items: {
    productId: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    selectedSize: string;
    quantity: number;
  }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: "cod" | "bkash";
  status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

function serializeOrder(doc: any): SerializedOrder {
  return {
    id: doc._id?.toString() || doc.id || "",
    orderId: doc.orderId || doc._id?.toString() || doc.id || "",
    userId: doc.userId,
    userEmail: doc.userEmail,
    customerName: doc.customerName,
    phone: doc.phone,
    address: doc.address,
    district: doc.district,
    notes: doc.notes || "",
    items: (doc.items || []).map((it: any) => ({
      productId: it.productId,
      name: it.name,
      slug: it.slug,
      image: it.image,
      price: Number(it.price),
      selectedSize: it.selectedSize,
      quantity: Number(it.quantity),
    })),
    subtotal: Number(doc.subtotal),
    shippingCost: Number(doc.shippingCost),
    total: Number(doc.total),
    paymentMethod: doc.paymentMethod,
    status: doc.status,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const ip = await getClientIp();

    // 1. IP Ban check
    const banStatus = await isIpBanned(ip);
    if (banStatus.banned) {
      return {
        success: false,
        error: "Your network IP has been restricted from creating orders.",
      };
    }

    // 2. Anti-spam rate limiting: max 10 orders per 10 minutes per IP
    const rateLimit = checkRateLimit(`order:${ip}`, 10, 600);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: "Too many orders submitted in a short time. Please wait a few minutes.",
      };
    }

    const validated = createOrderSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((i) => i.message).join(". "),
      };
    }

    await connectToDatabase();
    const data = validated.data;
    const session = await getSession();

    // Fetch store settings for shipping rates
    const settings = await SettingModel.findOne().lean().exec();
    const shippingCost =
      data.shippingArea === "inside_dhaka"
        ? (settings?.shippingDhaka ?? 70)
        : (settings?.shippingOutside ?? 130);

    // Verify and sanitize product pricing from database (anti-tamper)
    const productIds = data.items.map((it) => it.productId);
    const validObjectIds = productIds.filter((id) => /^[0-9a-fA-F]{24}$/.test(id));
    const dbProducts = await ProductModel.find({
      $or: [
        ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
        { slug: { $in: data.items.map((it) => it.slug) } },
      ],
    })
      .lean()
      .exec();

    const productMap = new Map<string, any>();
    dbProducts.forEach((p) => {
      productMap.set(p._id.toString(), p);
      productMap.set(p.slug, p);
    });

    // Check stock availability before proceeding
    for (const item of data.items) {
      const dbProd = productMap.get(item.productId) || productMap.get(item.slug);
      if (dbProd) {
        const currentStock = dbProd.stockQuantity !== undefined ? dbProd.stockQuantity : 100;
        if (currentStock < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for "${dbProd.name}". Only ${currentStock} item(s) available.`,
          };
        }
      }
    }

    const verifiedItems = data.items.map((it) => {
      const dbProd = productMap.get(it.productId) || productMap.get(it.slug);
      const verifiedPrice = dbProd ? dbProd.salePrice : it.price;
      return {
        productId: it.productId,
        name: dbProd ? dbProd.name : it.name,
        slug: dbProd ? dbProd.slug : it.slug,
        image: dbProd ? dbProd.image : it.image,
        price: verifiedPrice,
        selectedSize: it.selectedSize,
        quantity: it.quantity,
      };
    });

    const subtotal = verifiedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal + shippingCost;

    // Use MongoDB's ObjectId as the order ID
    const newOrder = new OrderModel({
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      district: data.district,
      notes: data.notes || "",
      items: verifiedItems,
      subtotal,
      shippingCost,
      total,
      paymentMethod: data.paymentMethod,
      status: "Pending",
      userId: session?.userId || undefined,
      userEmail: session?.email || undefined,
    });
    // Set orderId directly to the MongoDB ObjectId
    newOrder.orderId = newOrder._id.toString();
    await newOrder.save();

    // Atomically decrement stock
    for (const item of verifiedItems) {
      const dbProd = productMap.get(item.productId) || productMap.get(item.slug);
      if (dbProd) {
        const updated = await ProductModel.findByIdAndUpdate(
          dbProd._id,
          { $inc: { stockQuantity: -item.quantity } },
          { new: true }
        );
        if (updated && updated.stockQuantity <= 0) {
          await ProductModel.findByIdAndUpdate(dbProd._id, { inStock: false });
        }
      }
    }

    // Revalidate admin pages
    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return {
      success: true,
      order: serializeOrder(newOrder),
    };
  } catch (error: any) {
    console.error("Order creation error:", error);
    return {
      success: false,
      error: "Failed to process order. Please try again.",
    };
  }
}

export async function getOrders(filter?: {
  status?: string;
  search?: string;
  limit?: number;
}): Promise<SerializedOrder[]> {
  try {
    await requireAdmin();
    await connectToDatabase();
    const query: Record<string, any> = {};

    if (filter?.status && filter.status !== "All") {
      query.status = filter.status;
    }

    if (filter?.search && filter.search.trim()) {
      const q = escapeRegex(filter.search.trim());
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(filter.search.trim());
      query.$or = [
        { orderId: { $regex: q, $options: "i" } },
        { customerName: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { district: { $regex: q, $options: "i" } },
        ...(isObjectId ? [{ _id: filter.search.trim() }] : []),
      ];
    }

    const limit = filter?.limit || 100;
    const docs = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return docs.map(serializeOrder);
  } catch (error) {
    console.error("Get orders error:", error);
    return [];
  }
}

export async function getMyOrdersAction(): Promise<SerializedOrder[]> {
  try {
    const session = await requireAuth();
    await connectToDatabase();

    const docs = await OrderModel.find({
      $or: [
        { userId: session.userId },
        { userEmail: session.email },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();

    return docs.map(serializeOrder);
  } catch (error) {
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<SerializedOrder | null> {
  try {
    const session = await getSession();
    if (!session) return null;

    await connectToDatabase();
    const cleanId = orderId.trim();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(cleanId);
    const query = isObjectId
      ? { $or: [{ orderId: cleanId }, { _id: cleanId }] }
      : { orderId: cleanId };

    const doc = await OrderModel.findOne(query).lean().exec();
    if (!doc) return null;

    // Strict access control: only admin or the order owner can access order details
    if (
      session.role !== "admin" &&
      doc.userId !== session.userId &&
      doc.userEmail !== session.email
    ) {
      return null;
    }

    return serializeOrder(doc);
  } catch (error) {
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await requireAdmin();

    const validated = updateOrderStatusSchema.safeParse({ orderId, status });
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    await connectToDatabase();
    const cleanId = validated.data.orderId.trim();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(cleanId);
    const query = isObjectId
      ? { $or: [{ orderId: cleanId }, { _id: cleanId }] }
      : { orderId: cleanId };

    const updated = await OrderModel.findOneAndUpdate(
      query,
      { status: validated.data.status },
      { new: true }
    )
      .lean()
      .exec();

    if (!updated) {
      return { success: false, error: "Order not found" };
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return { success: true, order: serializeOrder(updated) };
  } catch (error: any) {
    return { success: false, error: "Failed to update order status" };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const cleanId = orderId.trim();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(cleanId);
    const query = isObjectId
      ? { $or: [{ orderId: cleanId }, { _id: cleanId }] }
      : { orderId: cleanId };

    const deleted = await OrderModel.findOneAndDelete(query)
      .lean()
      .exec();

    if (!deleted) {
      return { success: false, error: "Order not found" };
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return { success: true, message: "Order deleted successfully" };
  } catch (error: any) {
    return { success: false, error: "Failed to delete order" };
  }
}
