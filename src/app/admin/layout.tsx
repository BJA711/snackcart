"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, KeyRound, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isAdmin, isLoading, isConfigured } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-semibold">Verifying Administrator Privileges...</p>
        </div>
      </div>
    );
  }

  // If Supabase is not configured yet, show local dev instructions
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-stone-100 flex">
        <AdminSidebar />
        <div className="flex-grow p-8">
          <div className="max-w-2xl bg-white border border-stone-200 rounded-xl p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <KeyRound className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">
              Admin Portal: Configuration Required
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              The administrator system requires an active Supabase project with database migrations and administrator role assignment.
            </p>
            <div className="bg-stone-50 p-4 rounded-md border border-stone-200 text-xs space-y-2">
              <p className="font-semibold text-stone-800">To enable admin access:</p>
              <ol className="list-decimal list-inside space-y-1 text-stone-600">
                <li>Configure <code className="bg-stone-200 px-1 rounded">.env.local</code> with your Supabase keys.</li>
                <li>Apply migrations in <code className="bg-stone-200 px-1 rounded">supabase/migrations/</code>.</li>
                <li>Sign up an account, then run <code className="bg-stone-200 px-1 rounded">supabase/bootstrap_admin.sql</code> to grant the admin role.</li>
              </ol>
            </div>
            <div>
              <Link
                href="/setup-guide"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded text-xs font-semibold hover:bg-brand-700"
              >
                View Complete Setup Guide <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If configured but user is not logged in or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-xl p-8 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">
            Administrator Access Required
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            This dashboard is protected by server-side role authorization. Your account (
            <strong>{user?.email || "Guest"}</strong>) does not have administrator privileges.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            {!user ? (
              <Link
                href="/auth/login?redirect=/admin"
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-md shadow-sm"
              >
                Sign In as Administrator
              </Link>
            ) : (
              <Link
                href="/"
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-md shadow-sm"
              >
                Return to Storefront
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0">{children}</div>
    </div>
  );
}
