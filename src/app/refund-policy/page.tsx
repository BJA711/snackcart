import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Replacement Policy | SnackCart",
  description: "Guidelines on food safety, damaged parcels, and replacements for homemade snack orders.",
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
      <div>
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          Customer Assurance
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          Refund & Replacement Policy
        </h1>
        <p className="text-stone-500 mt-1">Last updated: November 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">1. Perishable Food Safety Rules</h2>
        <p>
          Because our snacks are fresh consumable food products without chemical preservatives, we cannot accept general returns once a sealed package has been opened by the customer.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">2. Damaged or Broken Parcels</h2>
        <p>
          If your carton arrives damaged in transit or the inner pouches are ruptured, please photograph the parcel and message our care desk within <strong>24 hours</strong> of delivery at{" "}
          <a href="mailto:support@snackcart.local" className="text-brand-700 underline">
            support@snackcart.local
          </a>{" "}
          or WhatsApp/call{" "}
          <a href="tel:+919876543210" className="text-brand-700 underline">
            +91 98765 43210
          </a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">3. Resolution: Replacement or Refund</h2>
        <p>
          Upon verification of transit damage, we offer your choice of an immediate replacement parcel dispatched at our cost, or a full refund credited via bank transfer or UPI within 3 to 5 business days.
        </p>
      </section>
    </div>
  );
}

