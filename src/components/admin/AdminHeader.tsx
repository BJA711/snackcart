"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Shield, LogOut, User } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-stone-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-stone-900 tracking-tight">{title}</h1>
        {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-md text-xs">
          <Shield className="w-3.5 h-3.5 text-brand-600" aria-hidden="true" />
          <span className="font-semibold text-stone-800">
            {profile?.full_name || user?.email || "Admin Operator"}
          </span>
          <span className="bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
            Admin
          </span>
        </div>

        <button
          onClick={signOut}
          type="button"
          title="Sign Out"
          className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

