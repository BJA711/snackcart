import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | SnackCart",
  description: "Information about dispatch schedules, delivery timelines, and courier logistics across India.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
      <div>
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          Fulfillment
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          Shipping & Delivery Policy
        </h1>
        <p className="text-stone-500 mt-1">Last updated: November 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">1. Fresh Batch Preparation Timeline</h2>
        <p>
          Unlike industrial products stored for months in warehouses, SnackCart products are prepared in small batches. Orders placed before 2:00 PM IST on working days (Monday through Saturday) are packed and dispatched the next morning.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">2. Delivery Timeframes</h2>
        <ul className="list-disc list-inside space-y-1.5 text-stone-600">
          <li><strong>Bengaluru Metro:</strong> 1 to 2 business days from dispatch</li>
          <li><strong>South India Tier-1 & Tier-2 Cities:</strong> 2 to 3 business days</li>
          <li><strong>Rest of India:</strong> 3 to 5 business days depending on PIN code connectivity</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">3. Shipping Charges & Free Delivery Threshold</h2>
        <p>
          Orders with an item subtotal of <strong>₹500 (50,000 paise)</strong> or higher receive <strong>Free Standard Delivery</strong>. For orders below ₹500, a standard courier handling charge of <strong>₹40 (4,000 paise)</strong> is applied at checkout.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">4. Tracking and SMS Updates</h2>
        <p>
          Once your package is handed over to our speed courier partner, an SMS and email notification containing your AWB tracking link is dispatched to your registered contact details.
        </p>
      </section>
    </div>
  );
}

