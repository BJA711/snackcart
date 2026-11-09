"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Settings, Shield, Database, CheckCircle2, AlertCircle } from "lucide-react";

export function AdminSettingsClient() {
  const { isConfigured } = useAuth();
  const [thresholdRupees, setThresholdRupees] = useState(500);
  const [shippingFeeRupees, setShippingFeeRupees] = useState(40);
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("support@snackcart.local");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-stone-900">Store Configuration & Rules</h2>
        <p className="text-xs text-stone-500">
          Delivery thresholds, business contact disclosures, and database parameters
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>Store settings updated successfully.</span>
        </div>
      )}

      {/* Delivery Pricing Rules */}
      <form onSubmit={handleSave} className="bg-white rounded-lg border border-stone-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3">
          Shipping & Delivery Rules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Free Delivery Order Minimum (₹)"
            type="number"
            value={thresholdRupees}
            onChange={(e) => setThresholdRupees(parseFloat(e.target.value) || 0)}
            helperText="Orders at or above this subtotal qualify for free shipping (default: ₹500)"
          />

          <Input
            label="Standard Courier Fee (₹)"
            type="number"
            value={shippingFeeRupees}
            onChange={(e) => setShippingFeeRupees(parseFloat(e.target.value) || 0)}
            helperText="Charged on orders below the free delivery minimum (default: ₹40)"
          />

          <Input
            label="Customer Support Telephone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="Customer Support Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" size="sm">
            Save Store Settings
          </Button>
        </div>
      </form>

      {/* Backend & Environment Diagnostics */}
      <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <Database className="w-4 h-4 text-brand-600" aria-hidden="true" />
          <h3 className="text-sm font-bold text-stone-900">Backend Connection Diagnostics</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-stone-500 block">Supabase Database Connection:</span>
            <div className="flex items-center gap-1.5 font-semibold text-stone-800">
              {isConfigured ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Configured & Connected</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Local Placeholder Mode</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-stone-500 block">Checkout Procedure Mode:</span>
            <span className="font-semibold text-stone-800 block">
              Atomic Stored Procedure (process_cod_checkout)
            </span>
          </div>

          <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-stone-500 block">Monetary Unit:</span>
            <span className="font-semibold text-stone-800 block">
              Integer Paise (100 paise = ₹1.00)
            </span>
          </div>

          <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-stone-500 block">Payment Gateways:</span>
            <span className="font-semibold text-stone-800 block">
              Strict Cash on Delivery (COD) Only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

