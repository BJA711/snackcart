"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, X, ExternalLink } from "lucide-react";
import Link from "next/link";

export function ConfigBanner() {
  const { isConfigured } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (isConfigured || dismissed) {
    return null;
  }

  return (
    <div
      role="status"
      className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <p>
            <strong className="font-semibold">Local Setup Notice:</strong> Supabase credentials are not connected yet. Copy{" "}
            <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.example</code> to{" "}
            <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code> and run the migrations in{" "}
            <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">supabase/migrations/</code> to activate real authentication, database storage, and COD checkout.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/setup-guide"
            className="inline-flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-950 underline"
          >
            Setup Guide <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss notice"
            className="p-1 hover:bg-amber-200/50 rounded text-amber-700"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
