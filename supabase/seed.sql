-- =============================================================================
-- SnackCart Demonstration Seed Data: seed.sql
-- Note: Clearly designated sample demonstration data for local development
-- =============================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, display_order)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Traditional Namkeen', 'traditional-namkeen', 'Savory, crispy snacks freshly prepared in small batches using traditional recipes.', 1),
    ('c2222222-2222-2222-2222-222222222222', 'Khakhra & Crisps', 'khakhra-and-crisps', 'Wholesome roasted flatbreads and crisp crisps made with whole grain flours.', 2),
    ('c3333333-3333-3333-3333-333333333333', 'Artisanal Sweets', 'artisanal-sweets', 'Handcrafted regional sweets prepared with pure ghee, nuts, and natural sweeteners.', 3),
    ('c4444444-4444-4444-4444-444444444444', 'Roasted Nuts & Seeds', 'roasted-nuts-and-seeds', 'Slow-roasted healthy dry snacks seasoned with mild rock salt and wholesome spices.', 4)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Products (Prices in integer paise)
INSERT INTO public.products (
    id, category_id, name, slug, description, price_in_paise, weight_or_size,
    ingredients, allergen_info, shelf_life_days, image_url, stock_quantity, is_featured, is_active
) VALUES
    (
        'p1111111-1111-1111-1111-111111111111',
        'c2222222-2222-2222-2222-222222222222',
        'Crispy Methi Khakhra',
        'crispy-methi-khakhra',
        'Thin, vacuum-packed whole wheat crispbread seasoned with fresh fenugreek leaves, turmeric, and cold-pressed peanut oil. Ideal with morning tea.',
        14000, -- ₹140.00
        '250g (Pack of 8 discs)',
        'Whole wheat flour, dry fenugreek leaves (methi), peanut oil, iodized salt, turmeric, chili powder.',
        'Contains wheat gluten, peanuts.',
        60,
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80',
        45,
        true,
        true
    ),
    (
        'p2222222-2222-2222-2222-222222222222',
        'c1111111-1111-1111-1111-111111111111',
        'Spiced Besan Sev',
        'spiced-besan-sev',
        'Traditional crisp spiced chickpea flour noodles infused with freshly ground black pepper and carom seeds (ajwain).',
        12500, -- ₹125.00
        '200g pouch',
        'Gram flour (besan), sunflower oil, ajwain, black pepper, rock salt, asafoetida (hing).',
        'Processed in a facility that also handles nuts.',
        45,
        'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&q=80',
        60,
        true,
        true
    ),
    (
        'p3333333-3333-3333-3333-333333333333',
        'c3333333-3333-3333-3333-333333333333',
        'Handmade Besan Ladoo',
        'handmade-besan-ladoo',
        'Slow-roasted gram flour spheres sweetened with unrefined boora sugar, enriched with pure cow ghee and fragrant cardamom.',
        26000, -- ₹260.00
        '400g (8 pieces)',
        'Gram flour (besan), pure cow ghee, raw sugar (boora), green cardamom, almonds, pistachios.',
        'Contains milk dairy and tree nuts.',
        30,
        'https://images.unsplash.com/photo-1605197148560-58c067e2a9b2?w=600&q=80',
        25,
        true,
        true
    ),
    (
        'p4444444-4444-4444-4444-444444444444',
        'c4444444-4444-4444-4444-444444444444',
        'Roasted Peri-Peri Makhana',
        'roasted-peri-peri-makhana',
        'Crisp, slow-roasted foxnuts lightly tossed in olive oil with mild paprika, garlic, and Himalayan pink salt.',
        18000, -- ₹180.00
        '120g pouch',
        'Foxnuts (makhana), cold-pressed olive oil, paprika, garlic powder, onion powder, Himalayan pink salt.',
        'Gluten free. Vegan.',
        75,
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
        30,
        true,
        true
    ),
    (
        'p5555555-5555-5555-5555-555555555555',
        'c1111111-1111-1111-1111-111111111111',
        'Crunchy Rice Flour Chakli',
        'crunchy-rice-flour-chakli',
        'Crispy spiral savory discs flavored with roasted gram, white sesame seeds, and mild cumin seeds.',
        15000, -- ₹150.00
        '250g box',
        'Rice flour, roasted split chickpeas (dalia), sesame seeds, cumin, turmeric, vegetable oil, salt.',
        'Contains sesame seeds.',
        45,
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
        40,
        false,
        true
    ),
    (
        'p6666666-6666-6666-6666-666666666666',
        'c3333333-3333-3333-3333-333333333333',
        'Dry Fruit Gond Ladoo',
        'dry-fruit-gond-ladoo',
        'Traditional winter nourishing ladoo prepared with edible acacia gum (gond), dry ginger, dates, almonds, cashews, and organic jaggery.',
        38000, -- ₹380.00
        '400g (8 pieces)',
        'Edible gum (gond), whole wheat flour, cow ghee, organic jaggery, almonds, cashews, dry ginger powder, melon seeds.',
        'Contains wheat gluten, milk dairy, and tree nuts.',
        45,
        'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&q=80',
        18,
        true,
        true
    )
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Demonstration Promotional Coupons
INSERT INTO public.coupons (
    code, discount_type, discount_value, min_order_amount_paise, max_discount_paise, usage_limit, is_active
) VALUES
    ('WELCOME50', 'fixed', 5000, 30000, NULL, 500, true), -- ₹50 off on orders >= ₹300
    ('SNACK10', 'percentage', 10, 40000, 10000, 1000, true) -- 10% off on orders >= ₹400, max discount ₹100
ON CONFLICT (code) DO NOTHING;

-- 4. Store Settings
INSERT INTO public.store_settings (key, value, description)
VALUES
    ('delivery_rules', '{"free_shipping_threshold_paise": 50000, "standard_shipping_fee_paise": 4000}', 'Order subtotal threshold in paise for free delivery and standard shipping fee'),
    ('store_contact', '{"phone": "+91 98765 43210", "email": "contact@snackcart.local", "city": "Bengaluru, Karnataka"}', 'Public contact details for store orders and inquiries'),
    ('announcement_banner', '{"enabled": true, "message": "Freshly prepared batches shipped within 24 hours. Free delivery on orders above ₹500!"}', 'Top announcement bar text')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

