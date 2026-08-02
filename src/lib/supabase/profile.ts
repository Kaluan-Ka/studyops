import type { SupabaseClient, User } from "@supabase/supabase-js";

export type ProfileUpsert = {
  id: string;
  display_name: string | null;
};

type ProfileUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

export function buildProfileUpsert(user: ProfileUser): ProfileUpsert {
  const metadata = user.user_metadata ?? {};
  const displayName = firstNonBlank(metadata.full_name, metadata.name, user.email);

  return { id: user.id, display_name: displayName };
}

export async function syncUserProfile(supabase: SupabaseClient, user: User): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert(buildProfileUpsert(user), { onConflict: "id" });

  if (error) {
    throw error;
  }
}

function firstNonBlank(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }
  return null;
}
