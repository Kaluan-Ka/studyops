create index mission_evidence_progress_user_idx
  on public.mission_evidence (progress_id, user_id);

drop index if exists public.mission_evidence_progress_id_idx;
