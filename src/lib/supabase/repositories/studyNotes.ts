import type { SupabaseClient } from "@supabase/supabase-js";

import {
  buildStudyNoteTarget,
  type StableStudyNoteTarget,
  type StudyNoteUpsert,
} from "@/lib/studyNotes";

export type StudyNoteRow = StudyNoteUpsert & {
  id: string;
  created_at: string;
  updated_at: string;
};

export async function getStudyNote(
  supabase: SupabaseClient,
  userId: string,
  target: StableStudyNoteTarget,
): Promise<StudyNoteRow | null> {
  const { target_type, target_key } = buildStudyNoteTarget(target);
  const { data, error } = await supabase
    .from("study_notes")
    .select("id,user_id,target_type,target_key,body,created_at,updated_at")
    .eq("user_id", userId)
    .eq("target_type", target_type)
    .eq("target_key", target_key)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as StudyNoteRow | null;
}

export async function saveStudyNote(
  supabase: SupabaseClient,
  input: StudyNoteUpsert,
): Promise<StudyNoteRow> {
  const { data, error } = await supabase
    .from("study_notes")
    .upsert(input, { onConflict: "user_id,target_type,target_key" })
    .select("id,user_id,target_type,target_key,body,created_at,updated_at")
    .single();

  if (error) {
    throw error;
  }

  return data as StudyNoteRow;
}

export async function deleteStudyNote(
  supabase: SupabaseClient,
  userId: string,
  target: StableStudyNoteTarget,
): Promise<void> {
  const { target_type, target_key } = buildStudyNoteTarget(target);
  const { error } = await supabase
    .from("study_notes")
    .delete()
    .eq("user_id", userId)
    .eq("target_type", target_type)
    .eq("target_key", target_key);

  if (error) {
    throw error;
  }
}
