import { z } from "zod";

// Indian 10-digit mobile number starting with 6, 7, 8, or 9
export const phoneRegex = /^[6-9]\d{9}$/;

// Indian 6-digit postal code (PIN code)
export const postalCodeRegex = /^[1-9][0-9]{5}$/;

export const checkoutSchema = z.object({
  delivery_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  delivery_phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)"),
  delivery_street: z
    .string()
    .trim()
    .min(5, "Street address must be at least 5 characters")
    .max(250, "Address cannot exceed 250 characters"),
  delivery_landmark: z
    .string()
    .trim()
    .max(100, "Landmark cannot exceed 100 characters")
    .optional()
    .nullable(),
  delivery_city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(60, "City cannot exceed 60 characters"),
  delivery_state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(60, "State cannot exceed 60 characters"),
  delivery_postal_code: z
    .string()
    .trim()
    .regex(postalCodeRegex, "Please enter a valid 6-digit Indian PIN code (e.g. 560001)"),
  customer_notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .nullable(),
  coupon_code: z
    .string()
    .trim()
    .max(30, "Coupon code cannot exceed 30 characters")
    .optional()
    .nullable(),
  idempotency_key: z.string().optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid("Invalid product ID"),
        quantity: z.number().int().min(1, "Quantity must be at least 1").max(50, "Quantity cannot exceed 50"),
      })
    )
    .min(1, "Cart cannot be empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const addressSchema = z.object({
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters"),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid 10-digit Indian mobile number"),
  street_address: z.string().trim().min(5, "Street address must be at least 5 characters"),
  landmark: z.string().trim().optional().nullable(),
  city: z.string().trim().min(2, "City must be at least 2 characters"),
  state: z.string().trim().min(2, "State must be at least 2 characters"),
  postal_code: z.string().trim().regex(postalCodeRegex, "Enter a valid 6-digit Indian PIN code"),
  is_default: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters"),
  category_id: z.string().uuid("Select a valid category").optional().nullable(),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  price_rupees: z.number().positive("Price must be greater than zero"),
  weight_or_size: z.string().trim().min(1, "Weight or package size is required (e.g. 250g)"),
  ingredients: z.string().trim().optional().nullable(),
  allergen_info: z.string().trim().optional().nullable(),
  shelf_life_days: z.number().int().nonnegative("Shelf life must be positive").optional().nullable(),
  stock_quantity: z.number().int().min(0, "Stock quantity cannot be negative"),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  image_url: z.string().url("Must be a valid image URL").optional().nullable(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code cannot exceed 20 characters")
    .toUpperCase(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().positive("Discount value must be greater than zero"),
  min_order_rupees: z.number().nonnegative("Minimum order must be non-negative").default(0),
  max_discount_rupees: z.number().positive("Max discount must be positive").optional().nullable(),
  usage_limit: z.number().int().positive("Usage limit must be positive").optional().nullable(),
  is_active: z.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters"),
  phone: z.string().trim().regex(phoneRegex, "Please enter a valid 10-digit Indian mobile number").optional().or(z.literal("")),
});

