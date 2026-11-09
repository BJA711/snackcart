import { DeliveryCalculation, DiscountType } from "@/types";

export const FREE_DELIVERY_THRESHOLD_PAISE = 50000; // ₹500
export const STANDARD_DELIVERY_FEE_PAISE = 4000;    // ₹40

export interface CouponRule {
  discount_type: DiscountType;
  discount_value: number; // percentage (1-100) or fixed amount in paise
  min_order_amount_paise?: number | null;
  max_discount_paise?: number | null;
  is_active?: boolean;
}

/**
 * Validates and calculates discount in paise based on order subtotal
 */
export function calculateDiscount(
  subtotalPaise: number,
  coupon?: CouponRule | null
): { discountPaise: number; isValid: boolean; reason?: string } {
  if (!coupon) {
    return { discountPaise: 0, isValid: true };
  }

  if (coupon.is_active === false) {
    return { discountPaise: 0, isValid: false, reason: "Coupon is not active" };
  }

  const minOrder = coupon.min_order_amount_paise || 0;
  if (subtotalPaise < minOrder) {
    const minRupees = Math.round(minOrder / 100);
    return {
      discountPaise: 0,
      isValid: false,
      reason: `Minimum order of ₹${minRupees} required for this coupon`,
    };
  }

  let discountPaise = 0;
  if (coupon.discount_type === "percentage") {
    discountPaise = Math.round((subtotalPaise * coupon.discount_value) / 100);
    if (coupon.max_discount_paise && discountPaise > coupon.max_discount_paise) {
      discountPaise = coupon.max_discount_paise;
    }
  } else {
    // Fixed amount in paise
    discountPaise = coupon.discount_value;
  }

  // Cap discount at subtotal so total does not become negative
  if (discountPaise > subtotalPaise) {
    discountPaise = subtotalPaise;
  }

  return { discountPaise, isValid: true };
}

/**
 * Calculates item totals, subtotal, discount, delivery fee, and final payable amount in paise
 */
export function calculateCartTotals(
  items: Array<{ price_in_paise: number; quantity: number }>,
  coupon?: CouponRule | null
): DeliveryCalculation {
  const subtotalPaise = items.reduce((acc, item) => {
    const qty = Math.max(0, item.quantity);
    const price = Math.max(0, item.price_in_paise);
    return acc + price * qty;
  }, 0);

  const { discountPaise } = calculateDiscount(subtotalPaise, coupon);
  const netSubtotalPaise = Math.max(0, subtotalPaise - discountPaise);

  const qualifiesForFreeDelivery =
    subtotalPaise > 0 && netSubtotalPaise >= FREE_DELIVERY_THRESHOLD_PAISE;

  const deliveryFeePaise =
    subtotalPaise === 0
      ? 0
      : qualifiesForFreeDelivery
      ? 0
      : STANDARD_DELIVERY_FEE_PAISE;

  const totalPaise = netSubtotalPaise + deliveryFeePaise;

  const amountNeededForFreeDeliveryPaise = qualifiesForFreeDelivery
    ? 0
    : Math.max(0, FREE_DELIVERY_THRESHOLD_PAISE - netSubtotalPaise);

  return {
    subtotalPaise,
    discountPaise,
    deliveryFeePaise,
    totalPaise,
    qualifiesForFreeDelivery,
    freeDeliveryThresholdPaise: FREE_DELIVERY_THRESHOLD_PAISE,
    amountNeededForFreeDeliveryPaise,
  };
}

