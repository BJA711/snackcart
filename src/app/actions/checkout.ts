"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { checkoutSchema, CheckoutInput } from "@/lib/validations";
import { calculateCartTotals } from "@/lib/pricing";

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  totalPaise?: number;
  error?: string;
  isDuplicate?: boolean;
}

export async function processCheckout(
  formData: CheckoutInput
): Promise<CheckoutResult> {
  // 1. Check configuration
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error:
        "Supabase credentials are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local to enable checkout.",
    };
  }

  // 2. Validate input schema
  const parsed = checkoutSchema.safeParse(formData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return {
      success: false,
      error: errorMsg || "Invalid checkout submission data.",
    };
  }

  const data = parsed.data;

  // 3. Authenticate User
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "You must be logged in to place an order.",
    };
  }

  const idempotencyKey =
    data.idempotency_key ||
    `checkout_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  try {
    // 4. Try RPC function 'process_cod_checkout'
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      "process_cod_checkout",
      {
        p_user_id: user.id,
        p_idempotency_key: idempotencyKey,
        p_delivery_name: data.delivery_name,
        p_delivery_phone: data.delivery_phone,
        p_delivery_street: data.delivery_street,
        p_delivery_landmark: data.delivery_landmark || null,
        p_delivery_city: data.delivery_city,
        p_delivery_state: data.delivery_state,
        p_delivery_postal_code: data.delivery_postal_code,
        p_customer_notes: data.customer_notes || null,
        p_coupon_code: data.coupon_code || null,
        p_items: data.items,
      }
    );

    if (!rpcError && rpcResult && rpcResult.success) {
      return {
        success: true,
        orderId: rpcResult.order_id,
        orderNumber: rpcResult.order_number,
        totalPaise: rpcResult.total_paise,
        isDuplicate: rpcResult.is_duplicate || false,
      };
    }

    // If RPC returned an explicit error
    if (rpcError) {
      // Check if it's a known stock/business exception
      return {
        success: false,
        error: rpcError.message || "Failed to process order. Please try again.",
      };
    }

    return {
      success: false,
      error: "Unexpected response from checkout procedure.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return {
      success: false,
      error: message,
    };
  }
}
