"use client";

import React, { useState } from "react";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import { updateOrderStatus, updatePaymentStatus } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

interface OrderStatusModalProps {
  order: Order | null;
  onClose: () => void;
  onSaved: () => void;
}

export function OrderStatusModal({
  order,
  onClose,
  onSaved,
}: OrderStatusModalProps) {
  const [status, setStatus] = useState<OrderStatus>(order?.status || "pending");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    order?.payment_status || "pending"
  );
  const [adminNotes, setAdminNotes] = useState(order?.admin_notes || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await updateOrderStatus(order.id, status, adminNotes);
      if (paymentStatus !== order.payment_status) {
        await updatePaymentStatus(order.id, paymentStatus);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update order";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Pending (New Order)" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing in Kitchen" },
    { value: "shipped", label: "Shipped via Courier" },
    { value: "delivered", label: "Delivered to Customer" },
    { value: "cancelled", label: "Cancelled" },
    { value: "failed_delivery", label: "Failed Delivery" },
    { value: "returned", label: "Returned" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-stone-200 shadow-xl max-w-lg w-full overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-stone-900">
              Update Order #{order.order_number}
            </h3>
            <p className="text-xs text-stone-500">Customer: {order.delivery_name}</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-stone-400 hover:text-stone-700 rounded"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Fulfillment Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full text-xs p-2.5 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Cash on Delivery Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full text-xs p-2.5 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
            >
              <option value="pending">Pending (Cash not yet received)</option>
              <option value="collected">Collected (Cash received by courier)</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed Payment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Administrative Tracking Notes
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Dispatched via BlueDart AWB #98712345"
              className="w-full text-xs p-2.5 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading}>
              Save Updates
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
