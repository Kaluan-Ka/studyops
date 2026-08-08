create table public.portfolio_project_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null constraint portfolio_project_progress_project_id_format
    check (project_id ~ '^PROJ-[0-9]{6}$'),
  status text not null default 'planned' constraint portfolio_project_progress_status_check
    check (status = any (array[
      'planned'::text,
      'in_progress'::text,
      'paused'::text,
      'completed'::text
    ])),
  objective text,
  notes text,
  next_step text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_project_progress_user_project_unique unique (user_id, project_id)
);

create index portfolio_project_progress_user_status_idx
  on public.portfolio_project_progress (user_id, status, updated_at desc);

alter table public.portfolio_project_progress enable row level security;

revoke all on table public.portfolio_project_progress from anon;
revoke all on table public.portfolio_project_progress from authenticated;
grant select, insert, update on table public.portfolio_project_progress to authenticated;

create policy portfolio_project_progress_select_own
  on public.portfolio_project_progress
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy portfolio_project_progress_insert_own
  on public.portfolio_project_progress
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy portfolio_project_progress_update_own
  on public.portfolio_project_progress
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create trigger portfolio_project_progress_set_updated_at
  before update on public.portfolio_project_progress
  for each row
  execute function private.set_updated_at();

create table public.study_cycle_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cycle_id uuid not null,
  project_id text not null constraint study_cycle_projects_project_id_format
    check (project_id ~ '^PROJ-[0-9]{6}$'),
  position smallint not null constraint study_cycle_projects_position_positive
    check (position > 0),
  created_at timestamptz not null default now(),
  constraint study_cycle_projects_cycle_user_fk
    foreign key (cycle_id, user_id)
    references public.study_cycles(id, user_id)
    on delete cascade,
  constraint study_cycle_projects_cycle_project_unique unique (cycle_id, project_id),
  constraint study_cycle_projects_cycle_position_unique unique (cycle_id, position)
    deferrable initially deferred
);

create index study_cycle_projects_user_cycle_position_idx
  on public.study_cycle_projects (user_id, cycle_id, position);

alter table public.study_cycle_projects enable row level security;

revoke all on table public.study_cycle_projects from anon;
revoke all on table public.study_cycle_projects from authenticated;
grant select, insert, update, delete on table public.study_cycle_projects to authenticated;

create policy study_cycle_projects_select_own
  on public.study_cycle_projects
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy study_cycle_projects_insert_own
  on public.study_cycle_projects
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy study_cycle_projects_update_own
  on public.study_cycle_projects
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy study_cycle_projects_delete_own
  on public.study_cycle_projects
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant delete on table public.study_cycle_tasks to authenticated;

create policy study_cycle_tasks_delete_own
  on public.study_cycle_tasks
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
