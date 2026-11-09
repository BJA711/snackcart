"use client";

import React, { useState } from "react";
import { Coupon, DiscountType } from "@/types";
import { saveCoupon } from "@/app/actions/admin";
import { paiseToRupees } from "@/lib/formatters";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { X, AlertCircle } from "lucide-react";

interface CouponFormModalProps {
  coupon?: Coupon | null;
  onClose: () => void;
  onSaved: () => void;
}

export function CouponFormModal({
  coupon,
  onClose,
  onSaved,
}: CouponFormModalProps) {
  const [code, setCode] = useState(coupon?.code || "");
  const [discountType, setDiscountType] = useState<DiscountType>(
    coupon?.discount_type || "fixed"
  );
  const [discountValue, setDiscountValue] = useState<number>(
    coupon
      ? coupon.discount_type === "fixed"
        ? paiseToRupees(coupon.discount_value)
        : coupon.discount_value
      : 50
  );
  const [minOrderRupees, setMinOrderRupees] = useState<number>(
    coupon ? paiseToRupees(coupon.min_order_amount_paise) : 300
  );
  const [maxDiscountRupees, setMaxDiscountRupees] = useState<number | string>(
    coupon?.max_discount_paise ? paiseToRupees(coupon.max_discount_paise) : ""
  );
  const [usageLimit, setUsageLimit] = useState<number | string>(
    coupon?.usage_limit ?? 100
  );
  const [isActive, setIsActive] = useState<boolean>(coupon?.is_active ?? true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await saveCoupon({
        id: coupon?.id,
        code: code.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order_rupees: Number(minOrderRupees),
        max_discount_rupees:
          maxDiscountRupees !== "" ? Number(maxDiscountRupees) : null,
        usage_limit: usageLimit !== "" ? Number(usageLimit) : null,
        is_active: isActive,
      });

      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save coupon";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-stone-200 shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
          <h3 className="font-bold text-sm text-stone-900">
            {coupon ? "Edit Discount Coupon" : "Create Promotional Coupon"}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-stone-400 hover:text-stone-700 rounded"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Coupon Code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. WELCOME50 or FESTIVE15"
          />

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Discount Type
            </label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as DiscountType)}
              className="w-full text-xs p-2.5 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
            >
              <option value="fixed">Fixed Rupee Discount (₹)</option>
              <option value="percentage">Percentage Discount (%)</option>
            </select>
          </div>

          <Input
            label={
              discountType === "fixed"
                ? "Discount Amount in ₹"
                : "Discount Percentage (%)"
            }
            type="number"
            required
            value={discountValue}
            onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
          />

          <Input
            label="Minimum Order Subtotal (₹)"
            type="number"
            value={minOrderRupees}
            onChange={(e) => setMinOrderRupees(parseFloat(e.target.value) || 0)}
          />

          {discountType === "percentage" && (
            <Input
              label="Maximum Discount Cap (₹, Optional)"
              type="number"
              value={maxDiscountRupees}
              onChange={(e) => setMaxDiscountRupees(e.target.value)}
              placeholder="e.g. 100"
            />
          )}

          <Input
            label="Total Usage Limit (Optional)"
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            placeholder="e.g. 500"
          />

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              Active for Redemption
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading}>
              Save Coupon
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
