import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SnackCart",
  description: "Transparent privacy policy detailing how customer information is handled for order fulfillment.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
      <div>
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          Data Protection
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          Privacy Policy
        </h1>
        <p className="text-stone-500 mt-1">Effective Date: November 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">1. Information We Collect</h2>
        <p>
          We collect only information essential to process and fulfill your snack orders:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-stone-600">
          <li><strong>Contact Details:</strong> Your name, phone number, and email address.</li>
          <li><strong>Delivery Address:</strong> Street address, landmark, city, state, and 6-digit Indian PIN code.</li>
          <li><strong>Account Credentials:</strong> Securely salted and hashed password managed via Supabase Auth. We never see or store plaintext passwords.</li>
          <li><strong>Order Snapshots:</strong> Details of snacks ordered and historical invoice totals.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">2. How We Use Your Data</h2>
        <p>
          Your information is used strictly to fulfill your orders, provide dispatch tracking notifications, verify Cash on Delivery delivery, and communicate regarding customer service inquiries.
        </p>
        <p>
          We do not sell, rent, or trade your personal details with third-party advertising brokers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">3. Third-Party Service Providers</h2>
        <p>
          To complete deliveries, recipient name, delivery address, and telephone number are shared with logistics courier partners (e.g., Delhivery, BlueDart, India Post). Courier partners are contractually required to use this data solely for package transit.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">4. Data Rights and Deletion Requests</h2>
        <p>
          You have the right to request access to or deletion of your customer account and personal data at any time. Simply email your request to{" "}
          <a href="mailto:support@snackcart.local" className="text-brand-700 underline">
            support@snackcart.local
          </a>.
        </p>
      </section>
    </div>
  );
}

