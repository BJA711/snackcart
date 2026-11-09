import { NextResponse } from "next/server";
import { isSupabaseConfigured, isSupabaseAdminConfigured } from "@/lib/supabase/status";

export async function GET() {
  const supabaseConfigured = isSupabaseConfigured();
  const adminConfigured = isSupabaseAdminConfigured();

  return NextResponse.json({
    status: "ok",
    app: "SnackCart",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    services: {
      supabase: {
        configured: supabaseConfigured,
        adminConfigured: adminConfigured,
        urlProvided: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      },
    },
  });
}

