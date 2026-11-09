import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CartSummary } from "@/components/cart/CartSummary";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Checkout (Cash on Delivery) | SnackCart",
  description: "Secure Cash on Delivery checkout for authentic homemade Indian snacks.",
};

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back to Shopping Cart
        </Link>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Checkout
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review your snack selection and enter recipient address for Cash on Delivery dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Checkout input form */}
        <div className="lg:col-span-7">
          <CheckoutForm />
        </div>

        {/* Order review summary */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <CartSummary showCheckoutButton={false} />

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="font-semibold block">COD Security & Zero Risk:</strong>
              <span>
                You do not need to share any bank credentials, OTP, or credit card numbers. Simply have the cash amount ready when your package arrives.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

