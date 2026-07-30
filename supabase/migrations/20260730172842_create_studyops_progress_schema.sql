create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path to ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public;
revoke all on function private.set_updated_at() from anon;
revoke all on function private.set_updated_at() from authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text constraint profiles_display_name_not_blank
    check (display_name is null or length(btrim(display_name)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.profiles from authenticated;
grant select, insert, update on table public.profiles to authenticated;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function private.set_updated_at();

create table public.mission_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_id text not null constraint mission_progress_content_id_format
    check (content_id ~ '^TASK-[0-9]{6}$'),
  status text not null default 'not_started' constraint mission_progress_status_check
    check (status = any (array[
      'not_started'::text,
      'in_progress'::text,
      'blocked'::text,
      'completed'::text,
      'skipped'::text
    ])),
  note text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mission_progress_user_content_unique unique (user_id, content_id),
  constraint mission_progress_id_user_unique unique (id, user_id)
);

alter table public.mission_progress enable row level security;

revoke all on table public.mission_progress from anon;
revoke all on table public.mission_progress from authenticated;
grant select, insert, update on table public.mission_progress to authenticated;

create policy mission_progress_select_own
  on public.mission_progress
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy mission_progress_insert_own
  on public.mission_progress
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy mission_progress_update_own
  on public.mission_progress
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create trigger mission_progress_set_updated_at
  before update on public.mission_progress
  for each row
  execute function private.set_updated_at();

create table public.mission_evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  progress_id uuid not null,
  evidence_type text not null default 'note' constraint mission_evidence_type_check
    check (evidence_type = any (array[
      'note'::text,
      'commit'::text,
      'link'::text,
      'screenshot'::text,
      'readme'::text,
      'test'::text,
      'benchmark'::text,
      'comparison'::text,
      'decision'::text,
      'implementation'::text,
      'file'::text,
      'other'::text
    ])),
  title text not null constraint mission_evidence_title_not_blank
    check (length(btrim(title)) > 0),
  artifact_url text,
  artifact_path text,
  body text,
  metadata jsonb not null default '{}'::jsonb constraint mission_evidence_metadata_object
    check (jsonb_typeof(metadata) = 'object'::text),
  produced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mission_evidence_has_payload
    check (artifact_url is not null or artifact_path is not null or body is not null),
  constraint mission_evidence_progress_user_fk
    foreign key (progress_id, user_id)
    references public.mission_progress(id, user_id)
    on delete cascade
);

create index mission_evidence_user_id_idx
  on public.mission_evidence (user_id);

create index mission_evidence_progress_id_idx
  on public.mission_evidence (progress_id);

alter table public.mission_evidence enable row level security;

revoke all on table public.mission_evidence from anon;
revoke all on table public.mission_evidence from authenticated;
grant select, insert, update on table public.mission_evidence to authenticated;

create policy mission_evidence_select_own
  on public.mission_evidence
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy mission_evidence_insert_own
  on public.mission_evidence
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy mission_evidence_update_own
  on public.mission_evidence
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create trigger mission_evidence_set_updated_at
  before update on public.mission_evidence
  for each row
  execute function private.set_updated_at();
