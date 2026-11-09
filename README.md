# SnackCart: Authentic Homemade Snacks E-Commerce Platform

A production-ready e-commerce application for single-vendor homemade Indian snacks with pure Cash on Delivery (COD) checkout, persistent Supabase PostgreSQL database integration, Supabase Auth & Storage, protected administrator dashboard, and atomic inventory management.

---

## 1. Key Business & Architectural Decisions

| Specification | Implementation |
|---|---|
| **Brand** | SnackCart (Homemade Delights) |
| **Market** | India |
| **Currency** | Indian Rupee (₹) stored as **integer paise** (₹150.00 = `15000` paise) |
| **Payment Mode** | Strict **Cash on Delivery (COD)** (initial status: `pending`) |
| **Frontend Framework** | Next.js 15 App Router with TypeScript & Tailwind CSS |
| **Database** | Supabase PostgreSQL with Row Level Security (RLS) & stored procedures |
| **Authentication** | Supabase Auth with server-side session cookies |
| **Storage** | Supabase Storage (`product-images` bucket) |
| **Validation** | Zod schemas (Indian phone numbers, 6-digit PIN codes, checkout payloads) |
| **Containerization** | Multi-stage Dockerfile & Red Hat OpenShift manifests |

---

## 2. Project Structure

```text
snackcart/
├── public/                       # Static public assets
├── src/
│   ├── app/                      # Next.js App Router routes
│   │   ├── (storefront)/         # Homepage, Shop, Categories, Products, Cart, Checkout
│   │   ├── account/              # Customer order history, addresses & profile
│   │   ├── admin/                # Protected admin dashboard, products, inventory, orders, coupons
│   │   ├── api/                  # API routes (health check, coupon validation)
│   │   ├── auth/                 # Sign-in and Customer Sign-up pages
│   │   ├── not-found.tsx         # Custom 404 page
│   │   └── layout.tsx            # Root layout with providers & announcement bar
│   ├── components/               # Accessible UI, layout, products, cart & admin components
│   ├── context/                  # AuthContext and CartContext (localStorage persisted)
│   ├── lib/                      # Pricing calculations, Supabase clients, Zod validations, formatters
│   └── types/                    # Shared TypeScript interfaces & order status enums
├── supabase/
│   ├── migrations/               # Versioned PostgreSQL migrations (tables, RLS, functions, storage)
│   │   ├── 20261109000001_initial_schema.sql
│   │   ├── 20261109000002_functions_and_triggers.sql
│   │   └── 20261109000003_storage_policies.sql
│   ├── seed.sql                  # Demonstration categories, products, coupons & store settings
│   └── bootstrap_admin.sql       # Safe SQL procedure to grant admin privileges to any user
├── tests/                        # Vitest unit test suite (pricing, discounts, delivery rules, Zod schemas)
├── openshift/                    # Deployment, Service, Route, and ConfigMap manifests
├── Dockerfile                    # Multi-stage container build with non-root security context
├── .dockerignore                 # Docker build exclusions
├── .gitignore                    # Environment & credential protection
├── .env.example                  # Safe template for environment variables
└── README.md                     # Documentation
```

---

## 3. Local Development Quickstart

### Prerequisites
- Node.js v20+ or v26+
- npm v10+

### Setup Commands

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local
# (Edit .env.local with your Supabase credentials when connecting a live database)

# 3. Run unit tests
npm test

# 4. Check TypeScript types
npx tsc --noEmit

# 5. Check ESLint
npm run lint

# 6. Build production bundle
npm run build

# 7. Start local development server
npm run dev
```

The application will be accessible at:
```
http://localhost:3000
```

---

## 4. Supabase Database & Backend Setup

### Step 1: Create Supabase Project
Create a new project on [supabase.com](https://supabase.com).

### Step 2: Configure `.env.local`
Update `.env.local` with your project keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Run Database Migrations in SQL Editor
Execute the SQL files in order in your Supabase SQL Editor:
1. `supabase/migrations/20261109000001_initial_schema.sql`
2. `supabase/migrations/20261109000002_functions_and_triggers.sql`
3. `supabase/migrations/20261109000003_storage_policies.sql`
4. `supabase/seed.sql` (Loads demo categories, products, and promo coupons)

### Step 4: Bootstrap Administrator Role
1. Sign up a new customer account at `http://localhost:3000/auth/signup` (e.g. `admin@snackcart.local`).
2. Run `supabase/bootstrap_admin.sql` in the Supabase SQL editor:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@snackcart.local');
   ```
3. Refresh the application and access the `/admin` portal.

---

## 5. Security & Checkout Integrity Architecture

1. **Monetary Storage in Integer Paise:** All product prices, cart subtotals, delivery fees, and order item line items are stored in integer paise (e.g. ₹140.00 = `14000` paise).
2. **Server-Side Price Verification:** The browser never determines or submits final prices. The server-side checkout procedure locks the database rows (`SELECT ... FOR UPDATE`), reads the verified price, ensures adequate stock, and decrements inventory atomically.
3. **Idempotency Protection:** Checkout requests support an `idempotency_key` constraint to prevent duplicate order submissions from double-clicks or unstable connections.
4. **Server-Side Authorization:** Admin routes and actions verify `public.profiles.role = 'admin'` via database lookup. Row Level Security (RLS) protects all tables. Non-admin users cannot alter user roles.
5. **No Secret Leaks:** Service-role keys are kept server-side only and never prefixed with `NEXT_PUBLIC_*`.

---

## 6. Testing Suite

Run the automated test suite anytime using:
```bash
npm test
```

Tests cover:
- Monetary formatting (whole rupees vs fractional paise).
- Coupon discount calculations (percentage vs fixed amount, minimum subtotal conditions, maximum discount caps).
- Standard ₹40 delivery fee vs Free Delivery above ₹500 threshold (`50,000` paise).
- Cart totals with discounts and shipping.
- Indian mobile number regex validation (`^[6-9]\d{9}$`).
- Indian PIN code regex validation (`^[1-9][0-9]{5}$`).
- Zod checkout submission schema verification.

---

## 7. OpenShift Deployment (Future Phase)

Deployment manifests are organized in `openshift/`:
- `deployment.yaml`: Deployment with non-root UID 1001 security context, readiness probe (`/api/health`), and liveness probe.
- `service.yaml`: ClusterIP service on port 3000.
- `route.yaml`: Edge TLS terminated OpenShift Route.
- `configmap.yaml`: Production environment parameters.

