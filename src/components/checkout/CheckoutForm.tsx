"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { processCheckout } from "@/app/actions/checkout";
import { formatPaiseToRupees } from "@/lib/formatters";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Truck, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function CheckoutForm() {
  const router = useRouter();
  const { items, coupon, totals, clearCart, isHydrated } = useCart();
  const { user, profile, isConfigured } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isHydrated) {
    return (
      <div className="bg-stone-50 rounded-lg p-8 animate-pulse space-y-4">
        <div className="h-6 bg-stone-200 rounded w-1/4"></div>
        <div className="h-10 bg-stone-200 rounded"></div>
        <div className="h-10 bg-stone-200 rounded"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-stone-200 p-8">
        <h3 className="text-base font-bold text-stone-900 mb-2">Your Cart is Empty</h3>
        <p className="text-xs text-stone-500 mb-4">
          Please add snacks to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-md bg-brand-600 text-white"
        >
          Explore Snacks
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic client checks
    if (!fullName.trim() || !phone.trim() || !street.trim() || !postalCode.trim()) {
      setErrorMessage("Please complete all required delivery fields.");
      return;
    }

    setIsLoading(true);

    try {
      if (!isConfigured) {
        // If Supabase credentials are not connected yet, demonstrate graceful message
        setErrorMessage(
          "Supabase credentials are not configured yet in .env.local. Please add NEXT_PUBLIC_SUPABASE_URL and run migrations to test live order insertion."
        );
        setIsLoading(false);
        return;
      }

      if (!user) {
        setErrorMessage("Please sign in or create an account to place a Cash on Delivery order.");
        setIsLoading(false);
        return;
      }

      const checkoutPayload = {
        delivery_name: fullName.trim(),
        delivery_phone: phone.trim(),
        delivery_street: street.trim(),
        delivery_landmark: landmark.trim() || undefined,
        delivery_city: city.trim(),
        delivery_state: state.trim(),
        delivery_postal_code: postalCode.trim(),
        customer_notes: notes.trim() || undefined,
        coupon_code: coupon ? coupon.code : undefined,
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
      };

      const result = await processCheckout(checkoutPayload);

      if (result.success && result.orderId) {
        clearCart();
        router.push(
          `/order-success?order_id=${result.orderId}&order_number=${result.orderNumber || ""}`
        );
      } else {
        setErrorMessage(result.error || "Unable to complete checkout. Please try again.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Auth Guard Banner if guest */}
      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div>
            <strong className="font-semibold">Sign in for Order Tracking:</strong>
            <p className="mt-0.5 text-amber-800">
              Please sign in to save your delivery addresses and view real-time dispatch updates.
            </p>
          </div>
          <Link
            href={`/auth/login?redirect=/checkout`}
            className="px-3 py-1.5 bg-amber-700 text-white font-semibold rounded-md hover:bg-amber-800 shrink-0"
          >
            Sign In / Register
          </Link>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg text-xs flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="font-semibold">Checkout Issue:</strong>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Delivery Address Section */}
      <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <Truck className="w-5 h-5 text-brand-600" aria-hidden="true" />
          <h3 className="font-bold text-base text-stone-900">1. Delivery Address</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Recipient Full Name"
            name="full_name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Ramesh Kumar"
          />

          <Input
            label="10-digit Indian Mobile Number"
            name="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
            helperText="Used by delivery courier for arrival confirmation"
          />

          <div className="sm:col-span-2">
            <Input
              label="Flat / House / Apartment / Street Address"
              name="street"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. Flat 302, Green Valley Apartments, 12th Main Road"
            />
          </div>

          <Input
            label="Landmark (Optional)"
            name="landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="e.g. Opposite BDA Complex"
          />

          <Input
            label="City"
            name="city"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <Input
            label="State"
            name="state"
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
          />

          <Input
            label="6-Digit PIN Code"
            name="postal_code"
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="e.g. 560038"
          />

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Delivery Instructions (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Please ring bell twice or leave at security desk"
              className="w-full text-xs p-2.5 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Payment Method Section (Fixed: Cash on Delivery) */}
      <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
          <h3 className="font-bold text-base text-stone-900">2. Payment Method</h3>
        </div>

        <div className="border border-brand-300 bg-brand-50/50 rounded-lg p-4 flex items-start gap-3">
          <input
            type="radio"
            id="payment_cod"
            name="payment_method"
            checked
            readOnly
            className="mt-1 text-brand-600 focus:ring-brand-500"
          />
          <div>
            <label htmlFor="payment_cod" className="font-semibold text-sm text-stone-900 block">
              Cash on Delivery (COD)
            </label>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              Pay ₹<strong>{totals.totalPaise / 100}</strong> in cash to the delivery agent upon receiving your sealed snack package. No advance online payment is required.
            </p>
          </div>
        </div>
      </div>

      {/* Order Confirmation Action */}
      <div className="space-y-3">
        <Button
          type="submit"
          size="lg"
          className="w-full text-base font-bold"
          isLoading={isLoading}
        >
          Confirm Order via Cash on Delivery ({formatPaiseToRupees(totals.totalPaise)})
        </Button>
        <p className="text-[11px] text-stone-500 text-center">
          By clicking &quot;Confirm Order&quot;, you agree to inspect and pay for the delivered fresh snacks upon arrival.
        </p>
      </div>
    </form>
  );
}
