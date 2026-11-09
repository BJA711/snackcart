"use client";

import React, { useState, useEffect } from "react";
import { Order, Product } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { DEMO_PRODUCTS } from "@/lib/demoData";
import { formatPaiseToRupees, formatDate, getOrderStatusBadge } from "@/lib/formatters";
import { OrderStatusModal } from "./OrderStatusModal";
import {
  TrendingUp,
  Package,
  ClipboardList,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export function AdminOverviewClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const supabase = createClient();
      const [ordersRes, productsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("*, items:order_items(*)")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("products").select("*"),
      ]);

      if (ordersRes.data) {
        setOrders(ordersRes.data as Order[]);
      }
      if (productsRes.data && productsRes.data.length > 0) {
        setProducts(productsRes.data as Product[]);
      } else {
        setProducts(DEMO_PRODUCTS);
      }
    } catch {
      setProducts(DEMO_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenuePaise = orders.reduce((acc, o) => acc + o.total_paise, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "pending" || o.status === "preparing").length;
  const lowStockProducts = products.filter((p) => p.stock_quantity <= 10);

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span>Total Order Volume</span>
            <TrendingUp className="w-4 h-4 text-brand-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-stone-900">
            {formatPaiseToRupees(totalRevenuePaise)}
          </div>
          <span className="text-[11px] text-stone-500">Across {orders.length} orders</span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span>Pending Kitchen Orders</span>
            <ClipboardList className="w-4 h-4 text-amber-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-amber-700">
            {pendingOrdersCount}
          </div>
          <span className="text-[11px] text-stone-500">Awaiting kitchen dispatch</span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span>Active Snack Items</span>
            <Package className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-stone-900">
            {products.filter((p) => p.is_active).length}
          </div>
          <span className="text-[11px] text-stone-500">In public catalogue</span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span>Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-rose-700">
            {lowStockProducts.length}
          </div>
          <span className="text-[11px] text-stone-500">Below 10 units threshold</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">Recent Customer Orders</h2>
            <p className="text-xs text-stone-500">Latest orders placed via Cash on Delivery</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
          >
            View All Orders <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">
            No orders recorded in database yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total (COD)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {orders.map((o) => {
                  const badge = getOrderStatusBadge(o.status);
                  return (
                    <tr key={o.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {o.order_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{o.delivery_name}</div>
                        <div className="text-[11px] text-stone-500">{o.delivery_phone}</div>
                      </td>
                      <td className="py-3 px-4 text-stone-500">{formatDate(o.created_at)}</td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {formatPaiseToRupees(o.total_paise)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${badge.bgClass} ${badge.textClass}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-stone-100 text-stone-700 hover:bg-stone-200"
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

      {/* Low Stock Watchlist */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <h2 className="text-base font-bold text-stone-900">Kitchen Low Stock Watchlist</h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
            >
              Restock Inventory <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 flex justify-between items-center text-xs"
              >
                <div>
                  <strong className="font-bold text-stone-900 block truncate max-w-[180px]">
                    {p.name}
                  </strong>
                  <span className="text-stone-500">{p.weight_or_size}</span>
                </div>
                <span className="px-2 py-1 bg-amber-200 text-amber-900 font-bold rounded">
                  {p.stock_quantity} Left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSaved={() => fetchData()}
        />
      )}
    </div>
  );
}
