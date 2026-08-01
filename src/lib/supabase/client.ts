import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export type SupabaseConfigurationState = "configured" | "unconfigured";

export function getSupabaseConfigurationState(): SupabaseConfigurationState {
  return getSupabaseUrl() && getSupabasePublishableKey()
    ? "configured"
    : "unconfigured";
}

export function createSupabaseBrowserClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();

  if (!url || !publishableKey) {
    return null;
  }

  return createBrowserClient(url, publishableKey);
}

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

function getSupabasePublishableKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";
}
