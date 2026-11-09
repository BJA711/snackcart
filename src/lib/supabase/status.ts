/**
 * Validates whether Supabase environment variables are properly configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return false;
  }

  // Detect placeholder strings
  if (
    url.includes("your-project") ||
    url.includes("placeholder") ||
    anonKey.includes("your-anon-key") ||
    anonKey.includes("fake_key")
  ) {
    return false;
  }

  return true;
}

export function isSupabaseAdminConfigured(): boolean {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey || serviceKey.includes("your-service-role") || serviceKey.includes("fake_service")) {
    return false;
  }
  return isSupabaseConfigured();
}

