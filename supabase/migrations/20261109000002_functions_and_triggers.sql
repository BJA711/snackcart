-- =============================================================================
-- SnackCart Database Migration: 02_functions_and_triggers.sql
-- Description: RLS policies, security triggers, and atomic COD checkout procedure
-- =============================================================================

-- 1. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- 2. AUTOMATIC PROFILE CREATION TRIGGER
-- Creates a customer profile entry whenever a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'phone', ''),
        'customer' -- New signups are strictly customers; admin cannot be granted here
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. PREVENT ROLE SELF-PROMOTION TRIGGER
-- Enforces that non-admin callers cannot alter the 'role' column in profiles
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF NOT public.is_admin() THEN
            RAISE EXCEPTION 'Unauthorized: Only an administrator can update user roles.';
        END IF;
    END IF;
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- 4. ROW LEVEL SECURITY (RLS) ENABLEMENT
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

-- Addresses policies
CREATE POLICY "Users can view own addresses"
    ON public.addresses FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own addresses"
    ON public.addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
    ON public.addresses FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete own addresses"
    ON public.addresses FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- Categories policies
CREATE POLICY "Public read categories"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Admin write categories"
    ON public.categories FOR ALL
    USING (public.is_admin());

-- Products policies
CREATE POLICY "Public read active products"
    ON public.products FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin write products"
    ON public.products FOR ALL
    USING (public.is_admin());

-- Coupons policies
CREATE POLICY "Public read active coupons"
    ON public.coupons FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin write coupons"
    ON public.coupons FOR ALL
    USING (public.is_admin());

-- Orders policies
CREATE POLICY "Users can read own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admin update orders"
    ON public.orders FOR UPDATE
    USING (public.is_admin());

-- Order Items policies
CREATE POLICY "Users can read own order items"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Insert order items"
    ON public.order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR public.is_admin())
        )
    );

-- Coupon redemptions policies
CREATE POLICY "Users view own coupon redemptions"
    ON public.coupon_redemptions FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admin manage coupon redemptions"
    ON public.coupon_redemptions FOR ALL
    USING (public.is_admin());

-- Store settings policies
CREATE POLICY "Public read store settings"
    ON public.store_settings FOR SELECT
    USING (true);

CREATE POLICY "Admin write store settings"
    ON public.store_settings FOR ALL
    USING (public.is_admin());

-- 6. ATOMIC COD CHECKOUT PROCEDURE
-- Executes atomic order creation, stock verification with row locks, price calculation, and inventory decrement.
CREATE OR REPLACE FUNCTION public.process_cod_checkout(
    p_user_id UUID,
    p_idempotency_key TEXT,
    p_delivery_name TEXT,
    p_delivery_phone TEXT,
    p_delivery_street TEXT,
    p_delivery_landmark TEXT,
    p_delivery_city TEXT,
    p_delivery_state TEXT,
    p_delivery_postal_code TEXT,
    p_customer_notes TEXT,
    p_coupon_code TEXT,
    p_items JSONB -- Array of objects: [{"product_id": "...", "quantity": 1}]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_subtotal_paise INT := 0;
    v_discount_paise INT := 0;
    v_delivery_fee_paise INT := 0;
    v_total_paise INT := 0;
    v_item JSONB;
    v_product_id UUID;
    v_req_qty INT;
    v_prod_record RECORD;
    v_item_total_paise INT;
    v_coupon_record RECORD;
    v_existing_order_id UUID;
    v_free_delivery_threshold INT := 50000; -- ₹500 in paise
    v_standard_delivery_fee INT := 4000;    -- ₹40 in paise
BEGIN
    -- 1. Idempotency check: if order with this key already exists for the user, return it safely
    IF p_idempotency_key IS NOT NULL THEN
        SELECT id INTO v_existing_order_id
        FROM public.orders
        WHERE idempotency_key = p_idempotency_key AND user_id = p_user_id;

        IF v_existing_order_id IS NOT NULL THEN
            RETURN jsonb_build_object(
                'success', true,
                'order_id', v_existing_order_id,
                'is_duplicate', true
            );
        END IF;
    END IF;

    -- 2. Validate input items
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Checkout cart cannot be empty.';
    END IF;

    -- Generate human-readable order number: SC-YYYYMMDD-XXXX
    v_order_number := 'SC-' || to_char(timezone('utc', now()), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

    -- 3. Lock products and compute trusted server-side prices
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_req_qty := (v_item->>'quantity')::INT;

        IF v_req_qty <= 0 THEN
            RAISE EXCEPTION 'Invalid item quantity: %', v_req_qty;
        END IF;

        -- Row lock product for atomic inventory check
        SELECT id, name, price_in_paise, weight_or_size, stock_quantity, is_active
        INTO v_prod_record
        FROM public.products
        WHERE id = v_product_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product not found: %', v_product_id;
        END IF;

        IF NOT v_prod_record.is_active THEN
            RAISE EXCEPTION 'Product % is currently unavailable.', v_prod_record.name;
        END IF;

        IF v_prod_record.stock_quantity < v_req_qty THEN
            RAISE EXCEPTION 'Insufficient stock for %. Available: %, requested: %',
                v_prod_record.name, v_prod_record.stock_quantity, v_req_qty;
        END IF;

        v_item_total_paise := v_prod_record.price_in_paise * v_req_qty;
        v_subtotal_paise := v_subtotal_paise + v_item_total_paise;
    END LOOP;

    -- 4. Validate Coupon if supplied
    IF p_coupon_code IS NOT NULL AND trim(p_coupon_code) <> '' THEN
        SELECT * INTO v_coupon_record
        FROM public.coupons
        WHERE upper(code) = upper(trim(p_coupon_code))
        FOR UPDATE;

        IF FOUND THEN
            IF NOT v_coupon_record.is_active THEN
                RAISE EXCEPTION 'Coupon code % is inactive.', p_coupon_code;
            END IF;

            IF v_coupon_record.valid_from > timezone('utc', now()) OR
               (v_coupon_record.valid_until IS NOT NULL AND v_coupon_record.valid_until < timezone('utc', now())) THEN
                RAISE EXCEPTION 'Coupon code % has expired or is not yet valid.', p_coupon_code;
            END IF;

            IF v_coupon_record.usage_limit IS NOT NULL AND v_coupon_record.used_count >= v_coupon_record.usage_limit THEN
                RAISE EXCEPTION 'Coupon code % has reached its redemption limit.', p_coupon_code;
            END IF;

            IF v_subtotal_paise < v_coupon_record.min_order_amount_paise THEN
                RAISE EXCEPTION 'Order subtotal must be at least ₹% to use coupon %.',
                    (v_coupon_record.min_order_amount_paise / 100)::text, p_coupon_code;
            END IF;

            -- Calculate discount
            IF v_coupon_record.discount_type = 'percentage' THEN
                v_discount_paise := (v_subtotal_paise * v_coupon_record.discount_value) / 100;
                IF v_coupon_record.max_discount_paise IS NOT NULL AND v_discount_paise > v_coupon_record.max_discount_paise THEN
                    v_discount_paise := v_coupon_record.max_discount_paise;
                END IF;
            ELSE -- fixed amount
                v_discount_paise := v_coupon_record.discount_value;
            END IF;

            -- Cap discount at subtotal
            IF v_discount_paise > v_subtotal_paise THEN
                v_discount_paise := v_subtotal_paise;
            END IF;
        ELSE
            RAISE EXCEPTION 'Invalid coupon code: %', p_coupon_code;
        END IF;
    END IF;

    -- 5. Calculate delivery fee
    IF (v_subtotal_paise - v_discount_paise) >= v_free_delivery_threshold THEN
        v_delivery_fee_paise := 0;
    ELSE
        v_delivery_fee_paise := v_standard_delivery_fee;
    END IF;

    v_total_paise := (v_subtotal_paise - v_discount_paise) + v_delivery_fee_paise;

    -- 6. Insert Order
    INSERT INTO public.orders (
        order_number,
        user_id,
        idempotency_key,
        status,
        payment_method,
        payment_status,
        delivery_name,
        delivery_phone,
        delivery_street,
        delivery_landmark,
        delivery_city,
        delivery_state,
        delivery_postal_code,
        subtotal_paise,
        discount_paise,
        delivery_fee_paise,
        total_paise,
        coupon_id,
        coupon_code,
        customer_notes
    ) VALUES (
        v_order_number,
        p_user_id,
        p_idempotency_key,
        'pending',
        'cod',
        'pending',
        p_delivery_name,
        p_delivery_phone,
        p_delivery_street,
        p_delivery_landmark,
        p_delivery_city,
        p_delivery_state,
        p_delivery_postal_code,
        v_subtotal_paise,
        v_discount_paise,
        v_delivery_fee_paise,
        v_total_paise,
        CASE WHEN v_coupon_record.id IS NOT NULL THEN v_coupon_record.id ELSE NULL END,
        CASE WHEN v_coupon_record.code IS NOT NULL THEN v_coupon_record.code ELSE NULL END,
        p_customer_notes
    )
    RETURNING id INTO v_order_id;

    -- 7. Insert Order Items and Decrement Inventory
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_req_qty := (v_item->>'quantity')::INT;

        SELECT name, price_in_paise, weight_or_size
        INTO v_prod_record
        FROM public.products
        WHERE id = v_product_id;

        v_item_total_paise := v_prod_record.price_in_paise * v_req_qty;

        -- Record line item with purchase snapshot
        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name_snapshot,
            product_weight_snapshot,
            unit_price_paise_snapshot,
            quantity,
            total_price_paise
        ) VALUES (
            v_order_id,
            v_product_id,
            v_prod_record.name,
            v_prod_record.weight_or_size,
            v_prod_record.price_in_paise,
            v_req_qty,
            v_item_total_paise
        );

        -- Decrement stock atomically
        UPDATE public.products
        SET stock_quantity = stock_quantity - v_req_qty,
            updated_at = timezone('utc', now())
        WHERE id = v_product_id;
    END LOOP;

    -- 8. Increment Coupon usage and log redemption if applied
    IF v_coupon_record.id IS NOT NULL THEN
        UPDATE public.coupons
        SET used_count = used_count + 1,
            updated_at = timezone('utc', now())
        WHERE id = v_coupon_record.id;

        INSERT INTO public.coupon_redemptions (
            coupon_id,
            user_id,
            order_id,
            discount_amount_paise
        ) VALUES (
            v_coupon_record.id,
            p_user_id,
            v_order_id,
            v_discount_paise
        );
    END IF;

    -- Return JSON summary
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'subtotal_paise', v_subtotal_paise,
        'discount_paise', v_discount_paise,
        'delivery_fee_paise', v_delivery_fee_paise,
        'total_paise', v_total_paise
    );
END;
$$;

