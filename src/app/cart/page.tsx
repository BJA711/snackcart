import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CartItemList } from "@/components/cart/CartItemList";
import { CartSummary } from "@/components/cart/CartSummary";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Shopping Cart | SnackCart",
  description: "Review items in your homemade snack cart and proceed to Cash on Delivery checkout.",
};

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Shopping Cart
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8">
          <CartItemList />
        </div>

        {/* Cart summary & checkout trigger */}
        <div className="lg:col-span-4 sticky top-24">
          <CartSummary />
        </div>
      </div>

      {/* Assurance banner */}
      <div className="bg-stone-100 rounded-lg p-6 border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-brand-600 shrink-0" aria-hidden="true" />
          <div>
            <strong className="text-stone-900 font-semibold block">Cash on Delivery Available</strong>
            <span>Inspect the sealed package and hand exact cash to the courier.</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
          <div>
            <strong className="text-stone-900 font-semibold block">Freshness Guarantee</strong>
            <span>If items arrive damaged or broken in transit, we replace or refund promptly.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
