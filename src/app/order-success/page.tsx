import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Truck, Package, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Placed Successfully | SnackCart",
  description: "Your Cash on Delivery homemade snack order has been confirmed.",
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string; order_number?: string }>;
}) {
  const params = await searchParams;
  const orderNumber = params.order_number || "SC-CONFIRMED";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      {/* Success Icon */}
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
          Cash on Delivery Order Placed
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          We have received your request. Our kitchen will prepare and pack your snacks fresh for dispatch.
        </p>
      </div>

      {/* Order Reference Box */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm max-w-lg mx-auto text-left space-y-4">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <span className="text-xs text-stone-500">Order Reference Number:</span>
          <span className="text-sm font-bold font-mono text-stone-900 bg-stone-100 px-2 py-1 rounded">
            {orderNumber}
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-stone-100 pb-3 text-xs">
          <span className="text-stone-500">Payment Mode:</span>
          <span className="font-semibold text-stone-800">Cash on Delivery (Pending)</span>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-md p-3 text-xs text-amber-900 space-y-1">
          <span className="font-semibold block">Doorstep Payment Reminder:</span>
          <p className="text-stone-600 leading-relaxed">
            Please keep the exact cash amount ready at the time of delivery. You do not need to make any advance digital payments.
          </p>
        </div>
      </div>

      {/* Dispatch Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-left text-xs">
        <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
          <Clock className="w-4 h-4 text-brand-600" aria-hidden="true" />
          <strong className="block text-stone-900">1. Fresh Preparation</strong>
          <span className="text-stone-500">Cooked and packed in small batches.</span>
        </div>
        <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
          <Truck className="w-4 h-4 text-brand-600" aria-hidden="true" />
          <strong className="block text-stone-900">2. Courier Dispatch</strong>
          <span className="text-stone-500">Shipped with sealed tamper-evident tape.</span>
        </div>
        <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
          <Package className="w-4 h-4 text-brand-600" aria-hidden="true" />
          <strong className="block text-stone-900">3. Doorstep Delivery</strong>
          <span className="text-stone-500">Delivered within 2 to 4 business days.</span>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/account"
          className="w-full sm:w-auto px-6 py-3 rounded-md bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
        >
          Track in My Account
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto px-6 py-3 rounded-md bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition-colors text-center"
        >
          Explore More Snacks
        </Link>
      </div>
    </div>
  );
}

