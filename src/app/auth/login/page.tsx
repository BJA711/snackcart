"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Sparkles, AlertCircle, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        "Supabase credentials are not configured yet in .env.local. Please configure your project to authenticate users."
      );
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center text-white mx-auto mb-2">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Welcome to SnackCart
          </h1>
          <p className="text-xs text-stone-500">
            Sign in to track orders, manage addresses, and checkout quickly.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" size="md" className="w-full text-xs font-bold" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>Don&apos;t have an account yet? </span>
          <Link
            href={`/auth/signup?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-semibold text-brand-700 hover:text-brand-900 underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-16 animate-pulse">Loading sign-in...</div>}>
      <LoginForm />
    </Suspense>
  );
}

