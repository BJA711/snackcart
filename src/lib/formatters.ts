import { OrderStatus, PaymentStatus } from "@/types";

/**
 * Formats integer paise into a standard Indian Rupee string representation.
 * Example: 15000 paise -> "₹150"
 * Example: 15050 paise -> "₹150.50"
 */
export function formatPaiseToRupees(paise: number): string {
  if (isNaN(paise) || paise < 0) {
    return "₹0";
  }

  const rupees = paise / 100;
  // If it's a whole number, omit decimal places
  if (paise % 100 === 0) {
    return `₹${rupees.toLocaleString("en-IN")}`;
  }

  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function paiseToRupees(paise: number): number {
  return (paise || 0) / 100;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round((rupees || 0) * 100);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function getOrderStatusBadge(status: OrderStatus): {
  label: string;
  bgClass: string;
  textClass: string;
} {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        bgClass: "bg-amber-100",
        textClass: "text-amber-800",
      };
    case "confirmed":
      return {
        label: "Confirmed",
        bgClass: "bg-blue-100",
        textClass: "text-blue-800",
      };
    case "preparing":
      return {
        label: "Preparing",
        bgClass: "bg-orange-100",
        textClass: "text-orange-800",
      };
    case "shipped":
      return {
        label: "Shipped",
        bgClass: "bg-purple-100",
        textClass: "text-purple-800",
      };
    case "delivered":
      return {
        label: "Delivered",
        bgClass: "bg-emerald-100",
        textClass: "text-emerald-800",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        bgClass: "bg-rose-100",
        textClass: "text-rose-800",
      };
    case "failed_delivery":
      return {
        label: "Delivery Failed",
        bgClass: "bg-rose-100",
        textClass: "text-rose-800",
      };
    case "returned":
      return {
        label: "Returned",
        bgClass: "bg-stone-100",
        textClass: "text-stone-800",
      };
    default:
      return {
        label: status,
        bgClass: "bg-stone-100",
        textClass: "text-stone-800",
      };
  }
}

export function getPaymentStatusBadge(status: PaymentStatus): {
  label: string;
  bgClass: string;
  textClass: string;
} {
  switch (status) {
    case "pending":
      return {
        label: "Pending (COD)",
        bgClass: "bg-amber-50",
        textClass: "text-amber-700",
      };
    case "collected":
      return {
        label: "Collected",
        bgClass: "bg-emerald-50",
        textClass: "text-emerald-700",
      };
    case "refunded":
      return {
        label: "Refunded",
        bgClass: "bg-blue-50",
        textClass: "text-blue-700",
      };
    case "failed":
      return {
        label: "Failed",
        bgClass: "bg-rose-50",
        textClass: "text-rose-700",
      };
    default:
      return {
        label: status,
        bgClass: "bg-stone-50",
        textClass: "text-stone-700",
      };
  }
}
