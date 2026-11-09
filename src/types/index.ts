export type UserRole = "customer" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  street_address: string;
  landmark?: string | null;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  description: string;
  price_in_paise: number;
  weight_or_size: string;
  ingredients?: string | null;
  allergen_info?: string | null;
  shelf_life_days?: number | null;
  image_url?: string | null;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount_paise: number;
  max_discount_paise?: number | null;
  usage_limit?: number | null;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until?: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed_delivery"
  | "returned";

export type PaymentStatus = "pending" | "collected" | "refunded" | "failed";

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  idempotency_key?: string | null;
  status: OrderStatus;
  payment_method: "cod";
  payment_status: PaymentStatus;
  delivery_name: string;
  delivery_phone: string;
  delivery_street: string;
  delivery_landmark?: string | null;
  delivery_city: string;
  delivery_state: string;
  delivery_postal_code: string;
  subtotal_paise: number;
  discount_paise: number;
  delivery_fee_paise: number;
  total_paise: number;
  coupon_id?: string | null;
  coupon_code?: string | null;
  customer_notes?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_name_snapshot: string;
  product_weight_snapshot: string;
  unit_price_paise_snapshot: number;
  quantity: number;
  total_price_paise: number;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
}

export interface DeliveryCalculation {
  subtotalPaise: number;
  discountPaise: number;
  deliveryFeePaise: number;
  totalPaise: number;
  qualifiesForFreeDelivery: boolean;
  freeDeliveryThresholdPaise: number;
  amountNeededForFreeDeliveryPaise: number;
}

