"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { Order } from "@/types";

export interface TrackOrderResult {
  found: boolean;
  order?: {
    order_number: string;
    created_at: string;
    status: string;
    payment_status: string;
    delivery_city: string;
    delivery_state: string;
    total_paise: number;
    items: Array<{
      product_name_snapshot: string;
      product_weight_snapshot: string;
      quantity: number;
      total_price_paise: number;
    }>;
  };
  error?: string;
}

export async function lookupOrder(
  orderNumber: string,
  phone: string
): Promise<TrackOrderResult> {
  const cleanOrderNumber = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.trim();

  if (!cleanOrderNumber || !cleanPhone) {
    return { found: false, error: "Please provide both Order Number and Phone Number." };
  }

  if (!isSupabaseConfigured()) {
    // Demo demonstration order fallback if testing before Supabase keys added
    if (cleanOrderNumber.includes("SC-") || cleanOrderNumber.includes("DEMO")) {
      return {
        found: true,
        order: {
          order_number: cleanOrderNumber,
          created_at: new Date().toISOString(),
          status: "preparing",
          payment_status: "pending",
          delivery_city: "Bengaluru",
          delivery_state: "Karnataka",
          total_paise: 28000,
          items: [
            {
              product_name_snapshot: "Crispy Methi Khakhra",
              product_weight_snapshot: "250g (Pack of 8 discs)",
              quantity: 2,
              total_price_paise: 28000,
            },
          ],
        },
      };
    }
    return {
      found: false,
      error:
        "Database is currently in demonstration mode. Please connect your Supabase database in .env.local.",
    };
  }

  try {
    const supabase = await createClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select("order_number, created_at, status, payment_status, delivery_city, delivery_state, total_paise, items:order_items(product_name_snapshot, product_weight_snapshot, quantity, total_price_paise)")
      .eq("order_number", cleanOrderNumber)
      .eq("delivery_phone", cleanPhone)
      .single();

    if (error || !order) {
      return {
        found: false,
        error: "No matching order found. Please check your order reference number and mobile number.",
      };
    }

    return {
      found: true,
      order: order as any,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error querying order";
    return { found: false, error: msg };
  }
}

