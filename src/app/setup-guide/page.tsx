import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Terminal, Database, KeyRound, Shield, CheckCircle2, Copy } from "lucide-react";

export const metadata: Metadata = {
  title: "Local Setup & Supabase Guide | SnackCart",
  description: "Step-by-step developer instructions for configuring Supabase, running migrations, and bootstrapping admin access for SnackCart.",
};

export default function SetupGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-xs sm:text-sm text-stone-700 leading-relaxed">
      <div>
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          Developer Documentation
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          SnackCart Local Setup & Supabase Configuration
        </h1>
        <p className="text-stone-500 mt-1">
          Follow these steps to connect your local Next.js application to a live Supabase PostgreSQL backend.
        </p>
      </div>

      {/* Step 1 */}
      <section className="bg-white rounded-lg border border-stone-200 p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
            1
          </span>
          <h2 className="text-base font-bold text-stone-900">Create a Free Supabase Project</h2>
        </div>
        <p>
          Visit <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline font-semibold">supabase.com</a>, log in to your dashboard, and click <strong>&quot;New Project&quot;</strong>. Select your preferred database region (e.g. India / Mumbai for best local latency).
        </p>
      </section>

      {/* Step 2 */}
      <section className="bg-white rounded-lg border border-stone-200 p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
            2
          </span>
          <h2 className="text-base font-bold text-stone-900">Configure Local Environment Variables</h2>
        </div>
        <p>
          Copy <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">.env.example</code> to <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">.env.local</code> in the project root:
        </p>
        <div className="bg-stone-900 text-stone-200 p-4 rounded-md font-mono text-xs overflow-x-auto space-y-1">
          <div className="text-stone-400"># In your terminal:</div>
          <div>cp .env.example .env.local</div>
        </div>
        <p className="text-xs text-stone-500">
          Then fill in your Project URL, public anonymous key, and private service-role key from your Supabase <strong>Project Settings → API</strong>.
        </p>
      </section>

      {/* Step 3 */}
      <section className="bg-white rounded-lg border border-stone-200 p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
            3
          </span>
          <h2 className="text-base font-bold text-stone-900">Apply Database Schema Migrations</h2>
        </div>
        <p>
          Open your Supabase dashboard&apos;s <strong>SQL Editor</strong> and execute the versioned SQL scripts in order:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-stone-600 font-mono text-xs">
          <li>
            <code className="text-brand-700 font-bold">supabase/migrations/20261109000001_initial_schema.sql</code>
            <span className="text-stone-500 block font-sans text-[11px] ml-5">
              Creates tables, constraints, integer paise monetary storage, foreign keys, and indexes.
            </span>
          </li>
          <li>
            <code className="text-brand-700 font-bold">supabase/migrations/20261109000002_functions_and_triggers.sql</code>
            <span className="text-stone-500 block font-sans text-[11px] ml-5">
              Installs RLS security policies, role-protection triggers, and the atomic <code className="font-mono">process_cod_checkout</code> transaction procedure.
            </span>
          </li>
          <li>
            <code className="text-brand-700 font-bold">supabase/migrations/20261109000003_storage_policies.sql</code>
            <span className="text-stone-500 block font-sans text-[11px] ml-5">
              Configures the <code className="font-mono">product-images</code> storage bucket with public read and admin-restricted upload policies.
            </span>
          </li>
          <li>
            <code className="text-brand-700 font-bold">supabase/seed.sql</code>
            <span className="text-stone-500 block font-sans text-[11px] ml-5">
              Populates initial demonstration snack categories, products, store settings, and promo coupons.
            </span>
          </li>
        </ol>
      </section>

      {/* Step 4 */}
      <section className="bg-white rounded-lg border border-stone-200 p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
            4
          </span>
          <h2 className="text-base font-bold text-stone-900">Bootstrap Administrator Account</h2>
        </div>
        <p>
          To access the protected administrator portal (<code className="bg-stone-100 px-1 py-0.5 rounded font-mono">/admin</code>):
        </p>
        <ol className="list-decimal list-inside space-y-2 text-stone-600 text-xs">
          <li>Register an account via <Link href="/auth/signup" className="text-brand-700 underline font-semibold">/auth/signup</Link> using your email (e.g. <code className="font-mono">admin@snackcart.local</code>).</li>
          <li>In your Supabase SQL Editor, execute <code className="bg-stone-100 px-1 py-0.5 rounded font-mono font-bold">supabase/bootstrap_admin.sql</code> after updating the email parameter.</li>
          <li>Refresh the application and navigate to <Link href="/admin" className="text-brand-700 underline font-semibold">/admin</Link> to access the store management dashboard.</li>
        </ol>
      </section>

      {/* Step 5 */}
      <section className="bg-white rounded-lg border border-stone-200 p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
            5
          </span>
          <h2 className="text-base font-bold text-stone-900">Run Local Development Server</h2>
        </div>
        <div className="bg-stone-900 text-stone-200 p-4 rounded-md font-mono text-xs overflow-x-auto space-y-1">
          <div>npm run dev</div>
        </div>
        <p className="text-xs text-stone-500">
          Open <a href="http://localhost:3000" className="text-brand-700 underline font-semibold">http://localhost:3000</a> in your browser.
        </p>
      </section>
    </div>
  );
}

