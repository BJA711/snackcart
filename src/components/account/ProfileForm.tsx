"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function ProfileForm() {
  const { user, profile, refreshProfile, isConfigured } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!isConfigured) {
        setError("Supabase is not configured yet in .env.local.");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess("Profile details updated successfully.");
        await refreshProfile();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving profile";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-stone-200 p-6 space-y-4">
      <h3 className="font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
        Personal Information
      </h3>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
          <input
            type="email"
            value={user?.email || "guest@snackcart.local"}
            disabled
            className="w-full text-sm px-3 py-2 border border-stone-200 rounded-md bg-stone-100 text-stone-500"
          />
          <span className="text-[10px] text-stone-400 mt-0.5 block">Email cannot be changed</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Account Role</label>
          <input
            type="text"
            value={profile?.role || "customer"}
            disabled
            className="w-full text-sm px-3 py-2 border border-stone-200 rounded-md bg-stone-100 text-stone-500 capitalize"
          />
        </div>

        <Input
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Ramesh Kumar"
        />

        <Input
          label="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 9876543210"
        />
      </div>

      <div className="pt-2">
        <Button type="submit" size="sm" isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
