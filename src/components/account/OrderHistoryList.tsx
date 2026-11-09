"use client";

import React, { useEffect, useState } from "react";
import { Order } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatPaiseToRupees, formatDate, getOrderStatusBadge, getPaymentStatusBadge } from "@/lib/formatters";
import { Package, Truck, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

export function OrderHistoryList() {
  const { user, isConfigured } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isConfigured) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("orders")
          .select("*, items:order_items(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setOrders(data as Order[]);
        }
      } catch {
        // Ignore fetch errors
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isConfigured]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 bg-stone-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-stone-200 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <Package className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-stone-800">No Orders Placed Yet</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          When you place a Cash on Delivery snack order, you will be able to track kitchen preparation, dispatch, and courier delivery status right here.
        </p>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-md bg-brand-600 text-white hover:bg-brand-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusBadge = getOrderStatusBadge(order.status);
        const paymentBadge = getPaymentStatusBadge(order.payment_status);

        return (
          <article
            key={order.id}
            className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm"
          >
            {/* Order Header */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-stone-900 font-mono">
                  {order.order_number}
                </span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${statusBadge.bgClass} ${statusBadge.textClass}`}
                >
                  {statusBadge.label}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${paymentBadge.bgClass} ${paymentBadge.textClass}`}
                >
                  {paymentBadge.label}
                </span>
              </div>
            </div>

            {/* Order Content */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Items List */}
              <div className="space-y-2">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-xs text-stone-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-stone-900">
                          {item.product_name_snapshot}
                        </span>
                        <span className="text-stone-400">({item.product_weight_snapshot})</span>
                        <span className="text-stone-500">× {item.quantity}</span>
                      </div>
                      <span className="font-semibold text-stone-900">
                        {formatPaiseToRupees(item.total_price_paise)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-500">Order items snapshot available</p>
                )}
              </div>

              {/* Delivery destination */}
              <div className="border-t border-stone-100 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-stone-500">
                <div>
                  <span className="font-medium text-stone-700">Delivering to: </span>
                  {order.delivery_name}, {order.delivery_street}, {order.delivery_city},{" "}
                  {order.delivery_state} - {order.delivery_postal_code}
                </div>
                <div className="text-right">
                  <span className="text-stone-600 font-medium mr-2">Total Amount (COD):</span>
                  <span className="text-base font-bold text-stone-900">
                    {formatPaiseToRupees(order.total_paise)}
                  </span>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
