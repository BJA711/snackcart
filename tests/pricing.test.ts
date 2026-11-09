import { describe, it, expect } from "vitest";
import {
  formatPaiseToRupees,
  paiseToRupees,
  rupeesToPaise,
} from "../src/lib/formatters";
import {
  calculateDiscount,
  calculateCartTotals,
  FREE_DELIVERY_THRESHOLD_PAISE,
  STANDARD_DELIVERY_FEE_PAISE,
} from "../src/lib/pricing";

describe("Monetary Formatters & Conversions", () => {
  it("formats integer paise to clean Rupee strings without decimals for whole rupees", () => {
    expect(formatPaiseToRupees(15000)).toBe("₹150");
    expect(formatPaiseToRupees(50000)).toBe("₹500");
    expect(formatPaiseToRupees(0)).toBe("₹0");
  });

  it("formats fractional paise with 2 decimal places", () => {
    expect(formatPaiseToRupees(15050)).toBe("₹150.50");
    expect(formatPaiseToRupees(12575)).toBe("₹125.75");
  });

  it("converts between rupees and paise correctly", () => {
    expect(paiseToRupees(15000)).toBe(150);
    expect(rupeesToPaise(150)).toBe(15000);
    expect(rupeesToPaise(150.5)).toBe(15050);
  });
});

describe("Coupon Discount Calculations", () => {
  it("returns zero discount when no coupon is provided", () => {
    const res = calculateDiscount(40000, null);
    expect(res.discountPaise).toBe(0);
    expect(res.isValid).toBe(true);
  });

  it("rejects coupon if order subtotal is below minimum order amount", () => {
    const res = calculateDiscount(25000, {
      discount_type: "fixed",
      discount_value: 5000,
      min_order_amount_paise: 30000,
      is_active: true,
    });
    expect(res.isValid).toBe(false);
    expect(res.discountPaise).toBe(0);
    expect(res.reason).toContain("Minimum order");
  });

  it("calculates percentage discount correctly", () => {
    const res = calculateDiscount(40000, {
      discount_type: "percentage",
      discount_value: 10, // 10%
      min_order_amount_paise: 30000,
      is_active: true,
    });
    expect(res.isValid).toBe(true);
    expect(res.discountPaise).toBe(4000); // 10% of 40000
  });

  it("respects max discount cap on percentage coupons", () => {
    const res = calculateDiscount(100000, {
      discount_type: "percentage",
      discount_value: 20, // 20% would be 20000
      max_discount_paise: 10000, // Capped at 10000
      min_order_amount_paise: 30000,
      is_active: true,
    });
    expect(res.isValid).toBe(true);
    expect(res.discountPaise).toBe(10000);
  });

  it("calculates fixed discount correctly", () => {
    const res = calculateDiscount(45000, {
      discount_type: "fixed",
      discount_value: 5000, // ₹50
      min_order_amount_paise: 30000,
      is_active: true,
    });
    expect(res.isValid).toBe(true);
    expect(res.discountPaise).toBe(5000);
  });
});

describe("Cart Totals and Delivery Rules", () => {
  it("applies standard ₹40 delivery fee for subtotal below ₹500", () => {
    const items = [
      { price_in_paise: 15000, quantity: 2 }, // ₹300 total (30000 paise)
    ];
    const totals = calculateCartTotals(items, null);
    expect(totals.subtotalPaise).toBe(30000);
    expect(totals.qualifiesForFreeDelivery).toBe(false);
    expect(totals.deliveryFeePaise).toBe(STANDARD_DELIVERY_FEE_PAISE); // 4000 paise
    expect(totals.totalPaise).toBe(34000); // 30000 + 4000
    expect(totals.amountNeededForFreeDeliveryPaise).toBe(20000); // ₹200 needed to reach ₹500
  });

  it("qualifies for free delivery when subtotal meets or exceeds ₹500", () => {
    const items = [
      { price_in_paise: 26000, quantity: 2 }, // ₹520 (52000 paise)
    ];
    const totals = calculateCartTotals(items, null);
    expect(totals.subtotalPaise).toBe(52000);
    expect(totals.qualifiesForFreeDelivery).toBe(true);
    expect(totals.deliveryFeePaise).toBe(0);
    expect(totals.totalPaise).toBe(52000);
    expect(totals.amountNeededForFreeDeliveryPaise).toBe(0);
  });

  it("correctly factors coupon discounts into delivery threshold calculation", () => {
    const items = [
      { price_in_paise: 52000, quantity: 1 }, // ₹520
    ];
    // 5000 paise discount brings net subtotal to 47000 (below ₹500)
    const totals = calculateCartTotals(items, {
      discount_type: "fixed",
      discount_value: 5000,
      min_order_amount_paise: 30000,
      is_active: true,
    });

    expect(totals.subtotalPaise).toBe(52000);
    expect(totals.discountPaise).toBe(5000);
    expect(totals.qualifiesForFreeDelivery).toBe(false);
    expect(totals.deliveryFeePaise).toBe(STANDARD_DELIVERY_FEE_PAISE);
    expect(totals.totalPaise).toBe(47000 + 4000);
  });

  it("handles empty cart safely", () => {
    const totals = calculateCartTotals([], null);
    expect(totals.subtotalPaise).toBe(0);
    expect(totals.deliveryFeePaise).toBe(0);
    expect(totals.totalPaise).toBe(0);
  });
});

