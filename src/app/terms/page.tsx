import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SnackCart",
  description: "Terms and conditions governing the use of the SnackCart e-commerce platform.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
      <div>
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          Legal Agreement
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          Terms of Service
        </h1>
        <p className="text-stone-500 mt-1">Effective Date: November 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">1. Acceptance of Terms</h2>
        <p>
          By accessing the SnackCart application or placing an order via Cash on Delivery, you agree to be bound by these Terms of Service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">2. Single-Vendor Storefront</h2>
        <p>
          SnackCart operates as a single-vendor specialized homemade snacks store. Products listed are prepared by artisanal culinary kitchens in India under our direct quality standards.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">3. Cash on Delivery Commitment</h2>
        <p>
          Placing a Cash on Delivery order constitutes a binding commitment to receive and pay for the delivered items upon arrival. Customers who repeatedly refuse verified orders without valid reason may have COD privileges suspended.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">4. Pricing and Product Information</h2>
        <p>
          All product prices are quoted in Indian Rupees (₹) and stored as integer paise. SnackCart reserves the right to correct typographical errors in pricing prior to order dispatch with notice to the customer.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">5. Governing Law and Jurisdiction</h2>
        <p>
          These terms are governed by the laws of India. Any disputes arising in connection with orders shall be subject to the courts of Bengaluru, Karnataka.
        </p>
      </section>
    </div>
  );
}
