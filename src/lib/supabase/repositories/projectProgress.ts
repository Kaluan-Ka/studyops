import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  PortfolioProjectProgressRow,
  PortfolioProjectProgressUpsert,
} from "@/lib/projectProgress";

export async function listProjectProgress(
  supabase: SupabaseClient,
  userId: string,
): Promise<PortfolioProjectProgressRow[]> {
  const { data, error } = await supabase
    .from("portfolio_project_progress")
    .select("id,user_id,project_id,status,objective,notes,next_step,created_at,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PortfolioProjectProgressRow[];
}

export async function saveProjectProgress(
  supabase: SupabaseClient,
  payload: PortfolioProjectProgressUpsert,
): Promise<void> {
  const { error } = await supabase
    .from("portfolio_project_progress")
    .upsert(payload, { onConflict: "user_id,project_id" });
  if (error) throw error;
}
