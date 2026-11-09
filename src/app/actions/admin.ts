"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { OrderStatus, PaymentStatus } from "@/types";
import { productSchema, ProductInput, couponSchema, CouponInput } from "@/lib/validations";
import { rupeesToPaise } from "@/lib/formatters";

/**
 * Server-side security guard ensuring only authenticated users with 'admin' role proceed.
 */
export async function requireAdmin() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Admin functions require valid credentials.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Authentication required.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    throw new Error("Forbidden: Administrator privileges required.");
  }

  return { user, supabase };
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  adminNotes?: string
) {
  const { supabase } = await requireAdmin();

  const updatePayload: { status: OrderStatus; admin_notes?: string; updated_at: string } = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (adminNotes !== undefined) {
    updatePayload.admin_notes = adminNotes;
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  return data;
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update payment status: ${error.message}`);
  }

  return data;
}

export async function updateStock(productId: string, newStock: number) {
  const { supabase } = await requireAdmin();

  if (newStock < 0) {
    throw new Error("Stock quantity cannot be negative.");
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      stock_quantity: newStock,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update stock: ${error.message}`);
  }

  return data;
}

export async function saveProduct(
  input: ProductInput & { id?: string; slug?: string }
) {
  const { supabase } = await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const p = parsed.data;
  const priceInPaise = rupeesToPaise(p.price_rupees);

  // Generate slug if not editing
  const slug =
    input.slug ||
    p.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
      `-${Date.now().toString(36)}`;

  const payload = {
    name: p.name,
    category_id: p.category_id || null,
    description: p.description,
    price_in_paise: priceInPaise,
    weight_or_size: p.weight_or_size,
    ingredients: p.ingredients || null,
    allergen_info: p.allergen_info || null,
    shelf_life_days: p.shelf_life_days || null,
    stock_quantity: p.stock_quantity,
    is_featured: p.is_featured,
    is_active: p.is_active,
    image_url: p.image_url || null,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", input.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert({
        ...payload,
        slug,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}

export async function archiveProduct(productId: string, isActive: boolean) {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("products")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function saveCategory(input: {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  display_order?: number;
}) {
  const { supabase } = await requireAdmin();

  if (!input.name || input.name.trim().length < 2) {
    throw new Error("Category name must be at least 2 characters.");
  }

  const slug =
    input.slug ||
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const payload = {
    name: input.name.trim(),
    slug,
    description: input.description || null,
    image_url: input.image_url || null,
    display_order: input.display_order ?? 0,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { data, error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", input.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from("categories")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}

export async function saveCoupon(
  input: CouponInput & { id?: string }
) {
  const { supabase } = await requireAdmin();

  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const c = parsed.data;
  const discountValue =
    c.discount_type === "fixed"
      ? rupeesToPaise(c.discount_value)
      : c.discount_value;

  const minOrderPaise = rupeesToPaise(c.min_order_rupees);
  const maxDiscountPaise = c.max_discount_rupees
    ? rupeesToPaise(c.max_discount_rupees)
    : null;

  const payload = {
    code: c.code.toUpperCase().trim(),
    discount_type: c.discount_type,
    discount_value: discountValue,
    min_order_amount_paise: minOrderPaise,
    max_discount_paise: maxDiscountPaise,
    usage_limit: c.usage_limit || null,
    is_active: c.is_active,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { data, error } = await supabase
      .from("coupons")
      .update(payload)
      .eq("id", input.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from("coupons")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}

export async function toggleCouponActive(couponId: string, isActive: boolean) {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("coupons")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", couponId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
