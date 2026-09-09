"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { OrderModel } from "@/lib/models/Order";
import { ProductModel } from "@/lib/models/Product";
import { ContactMessageModel } from "@/lib/models/ContactMessage";
import { ensureDatabaseSeeded } from "@/lib/db/seed";
import { requireAdmin } from "@/lib/auth";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  outOfStockProducts: number;
  unreadMessages: number;
  recentOrders: any[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();
  await ensureDatabaseSeeded();
  await connectToDatabase();

  const [
    ordersCount,
    pendingOrdersCount,
    deliveredOrdersCount,
    revenueAgg,
    totalProducts,
    outOfStockProducts,
    unreadMessages,
    recentOrdersDocs,
  ] = await Promise.all([
    OrderModel.countDocuments(),
    OrderModel.countDocuments({ status: "Pending" }),
    OrderModel.countDocuments({ status: "Delivered" }),
    OrderModel.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    ProductModel.countDocuments(),
    ProductModel.countDocuments({ inStock: false }),
    ContactMessageModel.countDocuments({ status: "Unread" }),
    OrderModel.find().sort({ createdAt: -1 }).limit(5).lean().exec(),
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;

  const recentOrders = recentOrdersDocs.map((o: any) => ({
    id: o._id.toString(),
    orderId: o.orderId,
    customerName: o.customerName,
    phone: o.phone,
    total: o.total,
    status: o.status,
    createdAt: new Date(o.createdAt).toISOString(),
    itemCount: (o.items || []).length,
  }));

  return {
    totalRevenue,
    totalOrders: ordersCount,
    pendingOrders: pendingOrdersCount,
    deliveredOrders: deliveredOrdersCount,
    totalProducts,
    outOfStockProducts,
    unreadMessages,
    recentOrders,
  };
}
