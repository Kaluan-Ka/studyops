create table public.study_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  starts_on date not null,
  ends_on date not null,
  objective text not null constraint study_cycles_objective_not_blank
    check (length(btrim(objective)) > 0),
  status text not null default 'planned' constraint study_cycles_status_check
    check (status = any (array[
      'planned'::text,
      'active'::text,
      'completed'::text,
      'cancelled'::text
    ])),
  review text,
  next_step text,
  reviewed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint study_cycles_date_range_check check (ends_on >= starts_on),
  constraint study_cycles_id_user_unique unique (id, user_id)
);

create index study_cycles_user_starts_idx
  on public.study_cycles (user_id, starts_on desc);

create index study_cycles_user_status_starts_idx
  on public.study_cycles (user_id, status, starts_on desc);

create unique index study_cycles_one_active_per_user_idx
  on public.study_cycles (user_id)
  where status = 'active';

alter table public.study_cycles enable row level security;

revoke all on table public.study_cycles from anon;
revoke all on table public.study_cycles from authenticated;
grant select, insert, update on table public.study_cycles to authenticated;

create policy study_cycles_select_own
  on public.study_cycles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy study_cycles_insert_own
  on public.study_cycles
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy study_cycles_update_own
  on public.study_cycles
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create trigger study_cycles_set_updated_at
  before update on public.study_cycles
  for each row
  execute function private.set_updated_at();

create table public.study_cycle_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cycle_id uuid not null,
  content_id text not null constraint study_cycle_tasks_content_id_format
    check (content_id ~ '^TASK-[0-9]{6}$'),
  position smallint not null constraint study_cycle_tasks_position_positive
    check (position > 0),
  planned_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint study_cycle_tasks_cycle_user_fk
    foreign key (cycle_id, user_id)
    references public.study_cycles(id, user_id)
    on delete cascade,
  constraint study_cycle_tasks_cycle_content_unique unique (cycle_id, content_id),
  constraint study_cycle_tasks_cycle_position_unique unique (cycle_id, position)
);

create index study_cycle_tasks_user_cycle_position_idx
  on public.study_cycle_tasks (user_id, cycle_id, position);

create index study_cycle_tasks_user_content_idx
  on public.study_cycle_tasks (user_id, content_id);

alter table public.study_cycle_tasks enable row level security;

revoke all on table public.study_cycle_tasks from anon;
revoke all on table public.study_cycle_tasks from authenticated;
grant select, insert, update on table public.study_cycle_tasks to authenticated;

create policy study_cycle_tasks_select_own
  on public.study_cycle_tasks
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy study_cycle_tasks_insert_own
  on public.study_cycle_tasks
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy study_cycle_tasks_update_own
  on public.study_cycle_tasks
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create trigger study_cycle_tasks_set_updated_at
  before update on public.study_cycle_tasks
  for each row
  execute function private.set_updated_at();
