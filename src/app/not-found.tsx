import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" aria-hidden="true" />
        </div>
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          404 Error
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          The snack page or collection you are looking for may have moved or is temporarily unavailable.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-md text-xs font-semibold hover:bg-brand-700 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Return to SnackCart Home
          </Link>
        </div>
      </div>
    </div>
  );
}
