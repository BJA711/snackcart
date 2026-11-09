"use client";

import React, { useState } from "react";
import { lookupOrder, TrackOrderResult } from "@/app/actions/tracking";
import { formatPaiseToRupees, formatDate, getOrderStatusBadge, getPaymentStatusBadge } from "@/lib/formatters";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { OrderStatus, PaymentStatus } from "@/types";

export function OrderTrackerClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrackOrderResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const res = await lookupOrder(orderNumber, phone);
      setResult(res);
    } catch {
      setResult({ found: false, error: "Failed to look up order. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-brand-600" aria-hidden="true" />
          Look Up Your Order Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Order Reference Number"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. SC-20261109-A1B2C3"
          />

          <Input
            label="10-Digit Mobile Number"
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
          />
        </div>

        <Button type="submit" size="md" className="w-full text-xs font-bold" isLoading={isLoading}>
          Track Order
        </Button>
      </form>

      {result && !result.found && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
          <span>{result.error || "No matching order found."}</span>
        </div>
      )}

      {result && result.found && result.order && (
        <article className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm space-y-6 p-6">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs text-stone-500">Order Reference:</span>
              <div className="text-base font-bold font-mono text-stone-900">
                {result.order.order_number}
              </div>
              <span className="text-[11px] text-stone-400">
                Placed on: {formatDate(result.order.created_at)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {(() => {
                const sBadge = getOrderStatusBadge(result.order.status as OrderStatus);
                const pBadge = getPaymentStatusBadge(result.order.payment_status as PaymentStatus);
                return (
                  <>
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${sBadge.bgClass} ${sBadge.textClass}`}>
                      {sBadge.label}
                    </span>
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${pBadge.bgClass} ${pBadge.textClass}`}>
                      {pBadge.label}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Stepper Visualization */}
          <div className="py-2">
            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              <div className="space-y-1">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="font-semibold text-stone-800 block">Received</span>
              </div>
              <div className="space-y-1">
                <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center mx-auto ${
                  ["preparing", "shipped", "delivered"].includes(result.order.status)
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}>
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="font-semibold text-stone-800 block">Kitchen Prep</span>
              </div>
              <div className="space-y-1">
                <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center mx-auto ${
                  ["shipped", "delivered"].includes(result.order.status)
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}>
                  <Truck className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="font-semibold text-stone-800 block">Dispatched</span>
              </div>
              <div className="space-y-1">
                <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center mx-auto ${
                  result.order.status === "delivered"
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}>
                  <Package className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="font-semibold text-stone-800 block">Delivered</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-stone-100 pt-4 space-y-2">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Package Contents
            </h4>
            <div className="divide-y divide-stone-100 text-xs">
              {result.order.items.map((it, idx) => (
                <div key={idx} className="py-2 flex justify-between items-center text-stone-700">
                  <div>
                    <span className="font-semibold text-stone-900">{it.product_name_snapshot}</span>
                    <span className="text-stone-400 ml-1">({it.product_weight_snapshot})</span>
                    <span className="text-stone-500 ml-1">× {it.quantity}</span>
                  </div>
                  <span className="font-semibold text-stone-900">
                    {formatPaiseToRupees(it.total_price_paise)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-xs">
              <span className="text-stone-500">
                Delivering to: {result.order.delivery_city}, {result.order.delivery_state}
              </span>
              <div className="text-right">
                <span className="text-stone-500 mr-2">Total Amount (COD):</span>
                <span className="text-sm font-bold text-brand-700">
                  {formatPaiseToRupees(result.order.total_paise)}
                </span>
              </div>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}

