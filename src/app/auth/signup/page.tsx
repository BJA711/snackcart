"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        "Supabase credentials are not configured yet in .env.local. Please configure your project to register accounts."
      );
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.user) {
        // If email confirmation is enabled on Supabase, notify user
        if (data.session) {
          router.push(redirectUrl);
          router.refresh();
        } else {
          setSuccessMessage(
            "Account registered successfully! Please check your email inbox to verify your address if confirmation is required."
          );
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
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
            Create Customer Account
          </h1>
          <p className="text-xs text-stone-500">
            Enjoy seamless Cash on Delivery ordering and order status tracking.
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

        {successMessage && (
          <div
            role="status"
            className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Ramesh Kumar"
          />

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
            label="Phone Number"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
            helperText="10-digit Indian mobile number for delivery courier updates"
          />

          <Input
            label="Password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />

          <Button type="submit" size="md" className="w-full text-xs font-bold" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>Already registered? </span>
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-semibold text-brand-700 hover:text-brand-900 underline"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-16 animate-pulse">Loading signup...</div>}>
      <SignupForm />
    </Suspense>
  );
}

