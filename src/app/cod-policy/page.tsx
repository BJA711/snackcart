import React from "react";
import { Metadata } from "next";
import { Truck, ShieldCheck, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cash on Delivery (COD) Policy | SnackCart",
  description: "Rules, payment terms, and delivery instructions for Cash on Delivery orders at SnackCart.",
};

export default function CodPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
      <div>
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          Payment Terms
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          Cash on Delivery (COD) Policy
        </h1>
        <p className="text-stone-500 mt-1">Last updated: November 2026</p>
      </div>

      <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-4 flex items-start gap-3">
        <Truck className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <strong className="text-stone-900 block font-semibold">100% Cash Payment at Doorstep:</strong>
          <span>
            SnackCart accepts Cash on Delivery exclusively. No advance credit card payments, digital wallet deposits, or UPI transactions are required prior to shipment.
          </span>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">1. Verification and Dispatch</h2>
        <p>
          Before parcel dispatch, our kitchen team may verify large orders via automated telephone SMS or customer confirmation. Please ensure your 10-digit mobile number is entered accurately at checkout.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">2. Payment Collection at Delivery</h2>
        <p>
          Please hand the exact order invoice amount in Indian Rupees (₹) to the designated courier agent upon delivery. The courier executive will hand over the sealed carton upon receipt of payment.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">3. Tamper-Evident Inspection</h2>
        <p>
          Do not accept packages if the exterior security tape appears broken or torn. In the rare event of damage, refuse delivery and immediately notify customer care at{" "}
          <a href="mailto:support@snackcart.local" className="text-brand-700 underline">
            support@snackcart.local
          </a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">4. Delivery Re-attempts</h2>
        <p>
          Our courier partners make up to two delivery attempts. If you are unavailable on the first attempt, the courier will coordinate with you via phone to reschedule for the next business day.
        </p>
      </section>
    </div>
  );
}

