"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { OrderHistoryList } from "./OrderHistoryList";
import { ProfileForm } from "./ProfileForm";
import { Package, User, MapPin, LogOut, Shield } from "lucide-react";
import Link from "next/link";

export function AccountDashboardClient() {
  const { user, profile, isAdmin, signOut, isConfigured } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  if (!isConfigured) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-3">
        <h2 className="text-base font-bold text-amber-900">
          Supabase Credentials Required for Live Account History
        </h2>
        <p className="text-xs text-amber-800 leading-relaxed">
          Customer account sessions, profile updates, and order history rely on Supabase Auth and database tables. Follow the setup guide to configure your local environment with live credentials.
        </p>
        <div className="pt-2">
          <Link
            href="/setup-guide"
            className="inline-flex items-center px-4 py-2 bg-amber-700 text-white rounded text-xs font-semibold hover:bg-amber-800"
          >
            Open Setup Guide
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg border border-stone-200 p-8 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto">
          <User className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-stone-900">Sign in to Access Your Account</h2>
        <p className="text-xs text-stone-500">
          View your order history, delivery addresses, and personal details.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/auth/login"
            className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-md shadow-sm"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="w-full py-2.5 px-4 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs rounded-md"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Header */}
      <div className="bg-white rounded-lg border border-stone-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-base">
            {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email?.[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900">
              {profile?.full_name || "Valued Customer"}
            </h1>
            <p className="text-xs text-stone-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-md text-xs font-semibold"
            >
              <Shield className="w-3.5 h-3.5 text-brand-400" aria-hidden="true" />
              Admin Portal
            </Link>
          )}

          <button
            onClick={() => signOut()}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-md text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "orders"
              ? "border-brand-600 text-brand-800 font-bold"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Package className="w-4 h-4" aria-hidden="true" />
          My Orders & History
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "profile"
              ? "border-brand-600 text-brand-800 font-bold"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <User className="w-4 h-4" aria-hidden="true" />
          Profile Details
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "orders" && <OrderHistoryList />}
        {activeTab === "profile" && <ProfileForm />}
      </div>
    </div>
  );
}
