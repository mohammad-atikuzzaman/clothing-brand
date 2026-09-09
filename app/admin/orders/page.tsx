"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  ShoppingBag,
  Eye,
  Trash2,
  Phone,
  MessageCircle,
  Printer,
  X,
  Clock,
  CheckCircle2,
  Truck,
  AlertTriangle,
  Layers,
  MapPin,
} from "lucide-react";
import { getOrders, updateOrderStatus as updateOrderStatusAction, deleteOrder as deleteOrderAction, SerializedOrder } from "@/actions/order";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<SerializedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<SerializedOrder | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" ? true : order.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        order.orderId.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.phone.includes(query) ||
        order.district.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      case "Confirmed":
        return "bg-sky-500/10 text-sky-400 border border-sky-500/30";
      case "Processing":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30";
      case "Shipped":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/30";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/30";
      default:
        return "bg-neutral-800 text-neutral-400";
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (!res.success) {
        toast.error(res.error || "Failed to update order status");
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId || o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order ${orderId} updated to ${newStatus}`);
      if (selectedOrder && (selectedOrder.orderId === orderId || selectedOrder.id === orderId)) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (confirm(`Are you sure you want to delete order ${orderId}? This cannot be undone.`)) {
      try {
        const res = await deleteOrderAction(orderId);
        if (!res.success) {
          toast.error(res.error || "Failed to delete order");
          return;
        }
        setOrders((prev) => prev.filter((o) => o.orderId !== orderId && o.id !== orderId));
        toast.success(`Order ${orderId} deleted.`);
        if (selectedOrder && (selectedOrder.orderId === orderId || selectedOrder.id === orderId)) {
          setSelectedOrder(null);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to delete order");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider font-serif">
            Orders Management
          </h2>
          <p className="text-xs text-neutral-400">
            Manage parcel dispatches, update order statuses, and view customer details.
          </p>
        </div>

        <div className="text-xs text-neutral-400">
          Showing <span className="font-bold text-white">{filteredOrders.length}</span> of{" "}
          <span className="font-bold text-white">{orders.length}</span> total orders
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131722] p-4 rounded-xl border border-neutral-800/80 space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            "All",
            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
          ].map((tab) => {
            const count =
              tab === "All"
                ? orders.length
                : orders.filter((o) => o.status === tab).length;

            const isSelected = statusFilter === tab;

            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#c19b65] text-black font-semibold shadow-xs"
                    : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-black/20 text-black font-bold"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID (e.g. IZH-123456), Customer Name, or Phone..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-900/80 border border-neutral-800 text-xs text-white rounded-lg focus:outline-none focus:border-[#c19b65] transition-colors placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-[#131722] rounded-xl border border-neutral-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#0f121a] text-neutral-400 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items & Sizes</th>
                <th className="py-3.5 px-4">Payment & Total</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    No orders found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.orderId || order.id}
                    className="hover:bg-neutral-800/30 transition-colors"
                  >
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-bold text-white block">{order.orderId || order.id}</span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-200 block">
                        {order.customerName}
                      </span>
                      <a
                        href={`tel:${order.phone}`}
                        className="text-neutral-400 hover:text-[#c19b65] block text-[11px] transition-colors"
                      >
                        {order.phone}
                      </a>
                      <span className="text-[10px] text-neutral-500 truncate block max-w-[180px]">
                        {order.district}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 max-w-[200px]">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <span className="font-semibold text-white">{it.quantity}x</span>
                            <span className="text-neutral-300 truncate">{it.name}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded-xs bg-neutral-800 text-[#c19b65] font-bold">
                              {it.selectedSize}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block text-sm">
                        {formatPrice(order.total)}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                        {order.paymentMethod === "bkash" ? "bKash" : "Cash on Delivery"}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.orderId || order.id, e.target.value)
                        }
                        className={`text-[11px] font-bold rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-[#c19b65] cursor-pointer ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="Pending" className="bg-neutral-900 text-white">
                          Pending
                        </option>
                        <option value="Confirmed" className="bg-neutral-900 text-white">
                          Confirmed
                        </option>
                        <option value="Processing" className="bg-neutral-900 text-white">
                          Processing
                        </option>
                        <option value="Shipped" className="bg-neutral-900 text-white">
                          Shipped
                        </option>
                        <option value="Delivered" className="bg-neutral-900 text-white">
                          Delivered
                        </option>
                        <option value="Cancelled" className="bg-neutral-900 text-white">
                          Cancelled
                        </option>
                      </select>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#c19b65] text-neutral-300 hover:text-black transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(order.orderId || order.id)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#161a26] border border-neutral-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in-50 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c19b65]">
                  Order Details
                </span>
                <h3 className="text-lg font-bold text-white">
                  Order #{selectedOrder.orderId || selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-6 text-xs text-neutral-300">
              {/* Customer and Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#11141e] rounded-lg border border-neutral-800">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block mb-1">
                    Customer Information
                  </span>
                  <div className="text-white font-semibold text-sm">
                    {selectedOrder.customerName}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href={`tel:${selectedOrder.phone}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md text-[11px] transition-colors"
                    >
                      <Phone className="w-3 h-3 text-[#c19b65]" />
                      <span>{selectedOrder.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/88${selectedOrder.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25D366]/20 text-[#25D366] rounded-md text-[11px] hover:bg-[#25D366]/30 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block mb-1">
                    Delivery Address
                  </span>
                  <div className="text-white flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c19b65] flex-shrink-0 mt-0.5" />
                    <span>{selectedOrder.address}, {selectedOrder.district}</span>
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-2 text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                      Note: {selectedOrder.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block mb-2">
                  Ordered Panjabis ({selectedOrder.items.length})
                </span>
                <div className="border border-neutral-800 rounded-lg divide-y divide-neutral-800/80 overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#11141e] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded bg-neutral-800 overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-neutral-400 text-[11px]">
                            Size: <span className="text-[#c19b65] font-bold">{item.selectedSize}</span> • Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 bg-[#11141e] rounded-lg border border-neutral-800 space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping Fee ({selectedOrder.district === "Dhaka" ? "Inside Dhaka" : "Outside Dhaka"})</span>
                  <span>{formatPrice(selectedOrder.shippingCost)}</span>
                </div>
                <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold text-white text-sm">
                  <span>Grand Total ({selectedOrder.paymentMethod.toUpperCase()})</span>
                  <span className="text-[#c19b65]">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Status Updater */}
              <div className="p-4 bg-[#11141e] rounded-lg border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                    Update Order Status
                  </span>
                  <span className="text-xs text-neutral-300">
                    Currently: <strong className="text-white">{selectedOrder.status}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.orderId || selectedOrder.id, e.target.value)
                    }
                    className="bg-neutral-900 border border-neutral-700 text-xs text-white rounded-lg py-2 px-3 focus:outline-none focus:border-[#c19b65]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
                    title="Print Receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-[#11141e] flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
