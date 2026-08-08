create table public.study_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null constraint study_notes_target_type_check
    check (target_type = any (array[
      'task'::text,
      'fundament'::text,
      'session'::text
    ])),
  target_key text not null,
  body text not null constraint study_notes_body_not_blank
    check (length(btrim(body)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint study_notes_target_format_check check (
    (target_type = 'task' and target_key ~ '^TASK-[0-9]{6}$') or
    (target_type = 'fundament' and target_key ~ '^FUN-[0-9]{6}$') or
    (target_type = 'session' and target_key ~ '^(task/TASK-[0-9]{6}|fundament/FUN-[0-9]{6})/session/.+$')
  ),
  constraint study_notes_user_target_unique unique (user_id, target_type, target_key)
);

create index study_notes_user_updated_idx
  on public.study_notes (user_id, updated_at desc);

alter table public.study_notes enable row level security;

revoke all on table public.study_notes from anon;
revoke all on table public.study_notes from authenticated;
grant select, insert, update, delete on table public.study_notes to authenticated;

create policy study_notes_select_own
  on public.study_notes
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy study_notes_insert_own
  on public.study_notes
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy study_notes_update_own
  on public.study_notes
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy study_notes_delete_own
  on public.study_notes
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create trigger study_notes_set_updated_at
  before update on public.study_notes
  for each row
  execute function private.set_updated_at();
