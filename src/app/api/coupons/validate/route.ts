import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { calculateDiscount } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotalPaise } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Coupon code is required." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            "Supabase is not configured. Coupon validation requires a connected database.",
        },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .single();

    if (error || !coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code." },
        { status: 404 }
      );
    }

    const { discountPaise, isValid, reason } = calculateDiscount(
      subtotalPaise || 0,
      coupon
    );

    if (!isValid) {
      return NextResponse.json(
        { error: reason || "Coupon cannot be applied to this order." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon,
      discountPaise,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

