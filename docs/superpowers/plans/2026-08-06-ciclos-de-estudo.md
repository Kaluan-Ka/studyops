# Ciclos de estudo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar ciclos semanais autenticados com tarefas da trilha, objetivo, revisão e próximo passo persistidos no Supabase e operáveis pela tela `/ciclos`.

**Architecture:** `study_cycles` modela planejamento/reflexão e `study_cycle_tasks` associa tarefas Markdown por `content_id`. O status de execução continua em `mission_progress`; a tela consulta esse estado e reutiliza `buildProgressUpsert` para atualizá-lo. A UI client-side consome o `AuthProvider` e o browser client já existente, sempre sob RLS.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS Modules, Supabase JS 2.111, Supabase/Postgres migrations, Node test runner via `tsx`.

## Global Constraints

- Somente usuários autenticados podem ler ou escrever ciclos e tarefas.
- A autorização deve usar RLS com `(select auth.uid()) = user_id`; nunca `user_metadata` ou service role no browser.
- `mission_progress` continua sendo a fonte do status real da missão.
- A interface deve seguir `DESIGN.md` e `docs/design/home-canonica.md`.
- O MVP não adiciona exclusão física, histórico de revisões, RPCs, views ou entidades de projeto/tópico.
- Toda implementação de comportamento começa com teste falhando e passa por `npm test`, `npm run lint`, `npm run content:validate` e `npm run build`.

---

### Task 1: Domínio de ciclos e payloads

**Files:**
- Create: `src/lib/studyCycles.ts`
- Test: `tests/studyCycles.test.ts`

**Interfaces:**
- Produces `StudyCycleStatus`, `StudyCycleTaskStatus`, `buildStudyCycleInsert`, `buildStudyCycleUpdate`, `buildStudyCycleTaskInsert`, `isStudyCycleStatus`, `getStudyCycleStatusLabel`.

- [ ] **Step 1: Write the failing tests**

Cover the following behaviors: valid statuses; cycle insert trims objective and dates; invalid date range is rejected; empty objective is rejected; update trims optional review/next step; task insert accepts only `TASK-xxxxxx`, positive position and non-empty cycle/user IDs; invalid task input is rejected.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test tests/studyCycles.test.ts`
Expected: FAIL because `src/lib/studyCycles.ts` and its exported builders do not exist yet.

- [ ] **Step 3: Implement the minimal domain module**

Use explicit string unions and return database-shaped snake_case payloads. Normalize optional text to `null`; preserve `reviewed_at` and `completed_at` as caller-provided nullable values in update payloads. Reject invalid dates with `ends_on` before `starts_on` and reject malformed content IDs.

- [ ] **Step 4: Run focused and full unit tests**

Run: `npm test tests/studyCycles.test.ts`
Expected: focused tests pass.

Run: `npm test`
Expected: all existing and new tests pass.

- [ ] **Step 5: Commit is unavailable in this sandbox**

Keep the working-tree diff isolated to the owned files; the repository `.git` index is read-only in this session, so do not retry commits.

### Task 2: Supabase schema, ownership and policies

**Files:**
- Create: `supabase/migrations/20260806090000_add_study_cycles.sql`

**Interfaces:**
- Produces tables `public.study_cycles` and `public.study_cycle_tasks` consumed by the browser client.

- [ ] **Step 1: Create the migration through the available Supabase CLI entrypoint**

Run `npm exec supabase migration new add_study_cycles` if the pinned local binary exists. If the CLI cannot write its telemetry in this sandbox, create `supabase/migrations/20260806090000_add_study_cycles.sql` and record that limitation in the handoff; do not alter existing migrations.

- [ ] **Step 2: Add the schema**

Create `study_cycles` with UUID ownership, dates, objective, status (`planned|active|completed|cancelled`), review fields, timestamps, `unique (id, user_id)`, `ends_on >= starts_on`, and one active cycle per user via a partial unique index. Create `study_cycle_tasks` with UUID ownership, composite cycle/user FK, `TASK-xxxxxx` content ID, positive position, optional planned note, timestamps, unique `(cycle_id, content_id)` and unique `(cycle_id, position)`.

- [ ] **Step 3: Add grants, RLS, policies and indexes**

Enable RLS; revoke table privileges from `anon` and `authenticated`; grant only `select, insert, update` to `authenticated`; add own-row policies with both `using` and `with check`; create indexes on user/date, user/status/date, user/cycle/position and user/content ID; attach `private.set_updated_at()` triggers.

- [ ] **Step 4: Verify the SQL statically and with the local database when available**

Run `git diff --check` and inspect the migration. If the local Supabase runtime is available, run the repository's local reset/migration commands and query table definitions/policies. If CLI/runtime remains unavailable, report the exact command failure and continue with static verification only.

### Task 3: Workspace data flow and authenticated UI

**Files:**
- Create: `src/components/StudyCyclesWorkspace.tsx`
- Create: `src/app/ciclos/page.module.css`
- Create: `src/app/ciclos/page.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes `getFundamentos()` task catalog, `useAuth()`, `buildStudyCycle*` and `buildProgressUpsert`.
- Produces `/ciclos` with create/edit cycle form, task association, mission status controls, loading/error/empty/auth states and navigation link.

- [ ] **Step 1: Implement the server route shell**

Load the Markdown task catalog with `getFundamentos()`, flatten `{ id, title, fundamentTitle }` options, and render `StudyCyclesWorkspace` with those options. Keep the route public so signed-out users can see the login prompt.

- [ ] **Step 2: Implement authenticated loading**

In the client workspace, wait for `authStatus === "authenticated"`, then select only the current user's visible cycles and child tasks through RLS. Load mission progress for the task content IDs in one query, map absent rows to `not_started`, and ignore stale responses after unmount.

- [ ] **Step 3: Implement cycle creation and editing**

Use the domain builders, insert or update `study_cycles`, select the saved row, refresh the list and show a concise Portuguese feedback message. Require start date, end date and objective; review and next step are optional unless completing a cycle.

- [ ] **Step 4: Implement task association and mission status changes**

Allow selecting one catalog task and adding an optional planned note; prevent duplicates in the selected cycle and show database errors safely. For status changes, use `buildProgressUpsert` against `mission_progress`, then refresh displayed status. Do not store status in `study_cycle_tasks`.

- [ ] **Step 5: Implement the visual surface**

Use dark operational panels, low-radius controls, parchment mission cards, green primary actions, cyan focus and gold evidence/review accents. Provide visible focus, labels, responsive stacking, and no invented percentages.

- [ ] **Step 6: Add the home navigation link**

Add a `Ciclos` link to the existing navigation without changing the canonical map/briefing structure.

### Task 4: Verification and handoff

**Files:**
- Modify only files required by fixes discovered during verification.

- [ ] **Step 1: Run the full verification suite**

Run `npm test`, `npm run lint`, `npm run content:validate`, `npm run build` and `git diff --check`; record exit codes and failure counts.

- [ ] **Step 2: Review the diff against the design**

Confirm that the diff contains only the approved cycle domain, migration, route, UI, tests and navigation; confirm no service role, public data access, delete policy, duplicated mission status or unrelated redesign was introduced.

- [ ] **Step 3: Report the final state**

Include changed files, verification evidence, and any Supabase CLI/runtime limitation that prevented a live migration test.
