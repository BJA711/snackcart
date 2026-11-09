"use client";

import React, { useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { formatPaiseToRupees, formatDate, getOrderStatusBadge, getPaymentStatusBadge } from "@/lib/formatters";
import { OrderStatusModal } from "./OrderStatusModal";
import { ClipboardList, Search, Filter, Phone, MapPin } from "lucide-react";

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.delivery_name.toLowerCase().includes(q) ||
        o.delivery_phone.includes(q) ||
        o.delivery_city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statusOptions: { value: string; label: string }[] = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Orders & Fulfillment</h2>
          <p className="text-xs text-stone-500">
            Track kitchen preparation, courier dispatch, and Cash on Delivery settlements
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatusFilter(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              statusFilter === opt.value
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-500 space-y-2">
            <ClipboardList className="w-8 h-8 text-stone-400 mx-auto" aria-hidden="true" />
            <p className="font-semibold text-stone-700">No orders matching this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order Details</th>
                  <th className="py-3 px-4">Customer & Address</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Payment & Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredOrders.map((o) => {
                  const statusBadge = getOrderStatusBadge(o.status);
                  const paymentBadge = getPaymentStatusBadge(o.payment_status);

                  return (
                    <tr key={o.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 align-top">
                        <div className="font-mono font-bold text-stone-900">
                          {o.order_number}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {formatDate(o.created_at)}
                        </div>
                        {o.coupon_code && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-mono font-bold mt-1 inline-block">
                            Coupon: {o.coupon_code}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top">
                        <strong className="text-stone-900 block">{o.delivery_name}</strong>
                        <div className="flex items-center gap-1 text-[11px] text-stone-600 mt-0.5">
                          <Phone className="w-3 h-3 text-stone-400" aria-hidden="true" />
                          <a href={`tel:${o.delivery_phone}`} className="hover:underline">
                            {o.delivery_phone}
                          </a>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-1 max-w-xs">
                          {o.delivery_street}, {o.delivery_city}, {o.delivery_state} - {o.delivery_postal_code}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <div className="space-y-1">
                          {o.items?.map((it) => (
                            <div key={it.id} className="text-[11px]">
                              <span className="font-medium text-stone-900">{it.product_name_snapshot}</span>
                              <span className="text-stone-500 ml-1">× {it.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <div className="text-sm font-bold text-stone-900">
                          {formatPaiseToRupees(o.total_paise)}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold mt-1 inline-block ${paymentBadge.bgClass} ${paymentBadge.textClass}`}
                        >
                          {paymentBadge.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <span
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold ${statusBadge.bgClass} ${statusBadge.textClass}`}
                        >
                          {statusBadge.label}
                        </span>
                        {o.admin_notes && (
                          <p className="text-[10px] text-stone-500 mt-1 italic max-w-xs">
                            &quot;{o.admin_notes}&quot;
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right align-top">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-200"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSaved={() => fetchOrders()}
        />
      )}
    </div>
  );
}
