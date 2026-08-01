# Progresso Real Missao Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conectar a pagina de tarefa do StudyOps ao schema Supabase existente para registrar estado manual e evidencia real por `task.id`.

**Architecture:** O conteudo canonico continua em Markdown/frontmatter e a pagina server-side segue carregando a missao local. Uma ilha client-side consulta e grava `mission_progress` e `mission_evidence` quando Supabase estiver configurado e houver usuario autenticado. Helpers puros em `src/lib/missionProgress.ts` concentram validacao, labels e payloads testaveis sem rede.

**Tech Stack:** Next.js App Router, React client component, TypeScript, `@supabase/ssr`, `@supabase/supabase-js`, Supabase Data API com RLS existente, Node test runner.

## Global Constraints

- Nova migration Supabase esta fora de escopo.
- Supabase remoto, `supabase link`, `db push`, `db pull`, `migration repair`, `--linked` e `--project-ref` estao fora de escopo.
- Nao criar dashboard percentual nem barra de progresso.
- Nao usar service role no cliente.
- Usar somente publishable key em `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Nao imprimir tokens, cookies nem valores `.env`.
- A UI deve usar `task.id` como `mission_progress.content_id`.
- A UI deve permitir apenas `in_progress`, `blocked` e `completed`.
- Nao criar evidencia sem titulo e sem payload real.

---

## File Structure

- Create `src/lib/missionProgress.ts`: tipos, labels, validacao e montagem de payloads puros.
- Create `tests/missionProgress.test.ts`: testes TDD dos invariantes de progresso/evidencia.
- Create `src/lib/supabase/client.ts`: criacao segura do cliente browser quando env publica existir.
- Create `src/components/MissionProgressPanel.tsx`: ilha client-side de leitura/escrita de progresso e evidencia.
- Modify `src/app/fundamentos/[slug]/tarefas/[tarefa]/page.tsx`: inserir painel usando `task.id`.
- Modify `src/app/page.module.css`: estilos do painel operacional, controles e lista de evidencias.
- Modify `package.json` and `package-lock.json`: dependencias Supabase pinadas via npm install quando `@supabase/ssr` e `@supabase/supabase-js` ainda nao estiverem instaladas.

---

### Task 1: Helpers Puros De Progresso

**Files:**
- Create: `tests/missionProgress.test.ts`
- Create: `src/lib/missionProgress.ts`

**Interfaces:**
- Produces: `type MissionProgressStatus = "in_progress" | "blocked" | "completed"`
- Produces: `isMissionProgressStatus(value: string): value is MissionProgressStatus`
- Produces: `buildProgressUpsert(input: BuildProgressUpsertInput, now?: string): MissionProgressUpsert`
- Produces: `buildEvidenceInsert(input: BuildEvidenceInsertInput): MissionEvidenceInsert`
- Produces: `getMissionProgressStatusLabel(status?: MissionProgressStatus | null): string`

- [ ] **Step 1: Write the failing tests**

Create `tests/missionProgress.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";

import {
  buildEvidenceInsert,
  buildProgressUpsert,
  getMissionProgressStatusLabel,
  isMissionProgressStatus,
} from "../src/lib/missionProgress";

test("aceita apenas status editaveis pela UI", () => {
  assert.equal(isMissionProgressStatus("in_progress"), true);
  assert.equal(isMissionProgressStatus("blocked"), true);
  assert.equal(isMissionProgressStatus("completed"), true);
  assert.equal(isMissionProgressStatus("not_started"), false);
  assert.equal(isMissionProgressStatus("skipped"), false);
  assert.equal(isMissionProgressStatus("a_fazer"), false);
});

test("monta payload de progresso com content_id opaco de tarefa", () => {
  const payload = buildProgressUpsert({
    userId: "00000000-0000-0000-0000-000000000001",
    contentId: "TASK-000037",
    nextStatus: "in_progress",
    currentStartedAt: null,
  }, "2026-08-01T12:00:00.000Z");

  assert.deepEqual(payload, {
    user_id: "00000000-0000-0000-0000-000000000001",
    content_id: "TASK-000037",
    status: "in_progress",
    started_at: "2026-08-01T12:00:00.000Z",
    completed_at: null,
  });
});

test("rejeita content_id que nao seja tarefa opaca", () => {
  assert.throws(
    () => buildProgressUpsert({
      userId: "00000000-0000-0000-0000-000000000001",
      contentId: "desenhar-contrato-request-response",
      nextStatus: "in_progress",
      currentStartedAt: null,
    }),
    /content_id de tarefa invalido/i,
  );
});

test("preserva started_at existente e preenche completed_at ao concluir", () => {
  const payload = buildProgressUpsert({
    userId: "00000000-0000-0000-0000-000000000001",
    contentId: "TASK-000037",
    nextStatus: "completed",
    currentStartedAt: "2026-07-31T10:00:00.000Z",
  }, "2026-08-01T12:00:00.000Z");

  assert.equal(payload.started_at, "2026-07-31T10:00:00.000Z");
  assert.equal(payload.completed_at, "2026-08-01T12:00:00.000Z");
});

test("limpa completed_at quando a missao volta para bloqueada", () => {
  const payload = buildProgressUpsert({
    userId: "00000000-0000-0000-0000-000000000001",
    contentId: "TASK-000037",
    nextStatus: "blocked",
    currentStartedAt: "2026-07-31T10:00:00.000Z",
  }, "2026-08-01T12:00:00.000Z");

  assert.equal(payload.started_at, "2026-07-31T10:00:00.000Z");
  assert.equal(payload.completed_at, null);
});

test("monta evidencia com titulo e corpo reais", () => {
  const payload = buildEvidenceInsert({
    userId: "00000000-0000-0000-0000-000000000001",
    progressId: "10000000-0000-0000-0000-000000000001",
    evidenceType: "note",
    title: "Contrato desenhado",
    body: "Tabela request response criada no README.",
    artifactUrl: "",
    artifactPath: "",
  });

  assert.deepEqual(payload, {
    user_id: "00000000-0000-0000-0000-000000000001",
    progress_id: "10000000-0000-0000-0000-000000000001",
    evidence_type: "note",
    title: "Contrato desenhado",
    body: "Tabela request response criada no README.",
    artifact_url: null,
    artifact_path: null,
  });
});

test("rejeita evidencia sem titulo ou sem payload", () => {
  assert.throws(
    () => buildEvidenceInsert({
      userId: "00000000-0000-0000-0000-000000000001",
      progressId: "10000000-0000-0000-0000-000000000001",
      evidenceType: "note",
      title: "",
      body: "resultado",
      artifactUrl: "",
      artifactPath: "",
    }),
    /titulo da evidencia/i,
  );

  assert.throws(
    () => buildEvidenceInsert({
      userId: "00000000-0000-0000-0000-000000000001",
      progressId: "10000000-0000-0000-0000-000000000001",
      evidenceType: "note",
      title: "Contrato",
      body: "",
      artifactUrl: "",
      artifactPath: "",
    }),
    /payload real/i,
  );
});

test("traduz status persistido para texto operacional", () => {
  assert.equal(getMissionProgressStatusLabel(null), "Sem progresso persistido");
  assert.equal(getMissionProgressStatusLabel("in_progress"), "Em execucao");
  assert.equal(getMissionProgressStatusLabel("blocked"), "Bloqueada");
  assert.equal(getMissionProgressStatusLabel("completed"), "Concluida com evidencia");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/missionProgress.test.ts`

Expected: FAIL with module-not-found for `../src/lib/missionProgress`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/missionProgress.ts`:

```ts
export type MissionProgressStatus = "in_progress" | "blocked" | "completed";

export type MissionEvidenceType =
  | "note"
  | "commit"
  | "link"
  | "screenshot"
  | "readme"
  | "test"
  | "benchmark"
  | "comparison"
  | "decision"
  | "implementation"
  | "file"
  | "other";

export type BuildProgressUpsertInput = {
  userId: string;
  contentId: string;
  nextStatus: MissionProgressStatus;
  currentStartedAt?: string | null;
};

export type MissionProgressUpsert = {
  user_id: string;
  content_id: string;
  status: MissionProgressStatus;
  started_at: string | null;
  completed_at: string | null;
};

export type BuildEvidenceInsertInput = {
  userId: string;
  progressId: string;
  evidenceType: MissionEvidenceType;
  title: string;
  body: string;
  artifactUrl: string;
  artifactPath: string;
};

export type MissionEvidenceInsert = {
  user_id: string;
  progress_id: string;
  evidence_type: MissionEvidenceType;
  title: string;
  body: string | null;
  artifact_url: string | null;
  artifact_path: string | null;
};

const taskContentId = /^TASK-[0-9]{6}$/;
const missionProgressStatuses = new Set<string>([
  "in_progress",
  "blocked",
  "completed",
]);

export function isMissionProgressStatus(value: string): value is MissionProgressStatus {
  return missionProgressStatuses.has(value);
}

export function getMissionProgressStatusLabel(status?: MissionProgressStatus | null): string {
  if (status === "in_progress") {
    return "Em execucao";
  }

  if (status === "blocked") {
    return "Bloqueada";
  }

  if (status === "completed") {
    return "Concluida com evidencia";
  }

  return "Sem progresso persistido";
}

export function buildProgressUpsert(
  input: BuildProgressUpsertInput,
  now = new Date().toISOString(),
): MissionProgressUpsert {
  if (!taskContentId.test(input.contentId)) {
    throw new Error("content_id de tarefa invalido");
  }

  const startedAt = input.currentStartedAt ?? now;

  return {
    user_id: input.userId,
    content_id: input.contentId,
    status: input.nextStatus,
    started_at: startedAt,
    completed_at: input.nextStatus === "completed" ? now : null,
  };
}

export function buildEvidenceInsert(input: BuildEvidenceInsertInput): MissionEvidenceInsert {
  const title = input.title.trim();
  const body = normalizeOptionalText(input.body);
  const artifactUrl = normalizeOptionalText(input.artifactUrl);
  const artifactPath = normalizeOptionalText(input.artifactPath);

  if (!title) {
    throw new Error("titulo da evidencia obrigatorio");
  }

  if (!body && !artifactUrl && !artifactPath) {
    throw new Error("evidencia precisa de payload real");
  }

  return {
    user_id: input.userId,
    progress_id: input.progressId,
    evidence_type: input.evidenceType,
    title,
    body,
    artifact_url: artifactUrl,
    artifact_path: artifactPath,
  };
}

function normalizeOptionalText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- tests/missionProgress.test.ts`

Expected: PASS for all tests in `missionProgress.test.ts`.

- [ ] **Step 5: Run full test suite**

Run: `npm run test`

Expected: PASS for all existing tests.

---

### Task 2: Supabase Browser Client

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/lib/supabase/client.ts`

**Interfaces:**
- Consumes: env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Produces: `createSupabaseBrowserClient(): SupabaseClient | null`
- Produces: `getSupabaseConfigurationState(): "configured" | "unconfigured"`

- [ ] **Step 1: Install Supabase dependencies**

Run: `npm install @supabase/supabase-js @supabase/ssr`

Expected: `package.json` contains both dependencies and `package-lock.json` is updated.

If the command fails because of network or sandbox restrictions, rerun with escalation and the justification: "Você quer permitir baixar as dependências oficiais do Supabase necessárias para a integração local do app?"

- [ ] **Step 2: Create the browser client utility**

Create `src/lib/supabase/client.ts`:

```ts
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
```

- [ ] **Step 3: Type-check by linting**

Run: `npm run lint`

Expected: no ESLint errors for `src/lib/supabase/client.ts`.

---

### Task 3: Mission Progress Panel Component

**Files:**
- Create: `src/components/MissionProgressPanel.tsx`
- Modify: `src/app/page.module.css`

**Interfaces:**
- Consumes: `createSupabaseBrowserClient()`
- Consumes: `buildProgressUpsert(input)`
- Consumes: `buildEvidenceInsert(input)`
- Produces: React component `MissionProgressPanel({ contentId, missionTitle }: MissionProgressPanelProps)`

- [ ] **Step 1: Create the client component**

Create `src/components/MissionProgressPanel.tsx`:

```tsx
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  buildEvidenceInsert,
  buildProgressUpsert,
  getMissionProgressStatusLabel,
  type MissionEvidenceType,
  type MissionProgressStatus,
} from "@/lib/missionProgress";
import {
  createSupabaseBrowserClient,
  getSupabaseConfigurationState,
} from "@/lib/supabase/client";

import styles from "@/app/page.module.css";

type MissionProgressRow = {
  id: string;
  user_id: string;
  content_id: string;
  status: MissionProgressStatus | "not_started" | "skipped";
  started_at: string | null;
  completed_at: string | null;
};

type MissionEvidenceRow = {
  id: string;
  evidence_type: MissionEvidenceType;
  title: string;
  body: string | null;
  artifact_url: string | null;
  artifact_path: string | null;
  produced_at: string;
};

type PanelState =
  | "unconfigured"
  | "signed_out"
  | "loading"
  | "ready_empty"
  | "ready_saved"
  | "error";

type MissionProgressPanelProps = {
  contentId: string;
  missionTitle: string;
};

const editableStatuses: MissionProgressStatus[] = [
  "in_progress",
  "blocked",
  "completed",
];

const evidenceTypes: Array<{ value: MissionEvidenceType; label: string }> = [
  { value: "note", label: "Nota" },
  { value: "test", label: "Teste" },
  { value: "implementation", label: "Implementacao" },
  { value: "decision", label: "Decisao" },
  { value: "link", label: "Link" },
  { value: "commit", label: "Commit" },
  { value: "other", label: "Outra" },
];

export function MissionProgressPanel({ contentId, missionTitle }: MissionProgressPanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [state, setState] = useState<PanelState>(
    getSupabaseConfigurationState() === "configured" ? "loading" : "unconfigured",
  );
  const [userId, setUserId] = useState("");
  const [progress, setProgress] = useState<MissionProgressRow | null>(null);
  const [evidences, setEvidences] = useState<MissionEvidenceRow[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<MissionProgressStatus>("in_progress");
  const [evidenceType, setEvidenceType] = useState<MissionEvidenceType>("note");
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceBody, setEvidenceBody] = useState("");
  const [artifactUrl, setArtifactUrl] = useState("");
  const [artifactPath, setArtifactPath] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      if (!supabase) {
        setState("unconfigured");
        return;
      }

      setState("loading");

      const { data: userResult, error: userError } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (userError || !userResult.user) {
        setState("signed_out");
        return;
      }

      setUserId(userResult.user.id);

      const { data: progressRow, error: progressError } = await supabase
        .from("mission_progress")
        .select("id,user_id,content_id,status,started_at,completed_at")
        .eq("content_id", contentId)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (progressError) {
        setState("error");
        setFeedback("Nao foi possivel carregar o progresso persistido.");
        return;
      }

      const typedProgress = progressRow as MissionProgressRow | null;
      setProgress(typedProgress);

      if (typedProgress?.status === "in_progress" || typedProgress?.status === "blocked" || typedProgress?.status === "completed") {
        setSelectedStatus(typedProgress.status);
      }

      if (!typedProgress) {
        setEvidences([]);
        setState("ready_empty");
        return;
      }

      const { data: evidenceRows, error: evidenceError } = await supabase
        .from("mission_evidence")
        .select("id,evidence_type,title,body,artifact_url,artifact_path,produced_at")
        .eq("progress_id", typedProgress.id)
        .order("produced_at", { ascending: false });

      if (!active) {
        return;
      }

      if (evidenceError) {
        setState("error");
        setFeedback("Nao foi possivel carregar as evidencias persistidas.");
        return;
      }

      setEvidences((evidenceRows ?? []) as MissionEvidenceRow[]);
      setState("ready_saved");
    }

    void loadProgress();

    return () => {
      active = false;
    };
  }, [contentId, supabase]);

  async function handleStatusSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !userId) {
      return;
    }

    setIsSaving(true);
    setFeedback("");

    try {
      const payload = buildProgressUpsert({
        userId,
        contentId,
        nextStatus: selectedStatus,
        currentStartedAt: progress?.started_at,
      });

      const { data, error } = await supabase
        .from("mission_progress")
        .upsert(payload, { onConflict: "user_id,content_id" })
        .select("id,user_id,content_id,status,started_at,completed_at")
        .single();

      if (error) {
        setState("error");
        setFeedback("Nao foi possivel salvar o estado da missao.");
        return;
      }

      setProgress(data as MissionProgressRow);
      setState("ready_saved");
      setFeedback("Estado persistido nesta missao.");
    } catch {
      setState("error");
      setFeedback("Revise o estado escolhido antes de salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleEvidenceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !userId) {
      return;
    }

    setIsSaving(true);
    setFeedback("");

    try {
      const currentProgress = progress ?? await ensureProgress();

      if (!currentProgress) {
        setState("error");
        setFeedback("Nao foi possivel preparar o progresso da missao.");
        return;
      }

      const payload = buildEvidenceInsert({
        userId,
        progressId: currentProgress.id,
        evidenceType,
        title: evidenceTitle,
        body: evidenceBody,
        artifactUrl,
        artifactPath,
      });

      const { data, error } = await supabase
        .from("mission_evidence")
        .insert(payload)
        .select("id,evidence_type,title,body,artifact_url,artifact_path,produced_at")
        .single();

      if (error) {
        setState("error");
        setFeedback("Nao foi possivel salvar a evidencia.");
        return;
      }

      setEvidences((current) => [data as MissionEvidenceRow, ...current]);
      setEvidenceTitle("");
      setEvidenceBody("");
      setArtifactUrl("");
      setArtifactPath("");
      setState("ready_saved");
      setFeedback("Evidencia persistida nesta missao.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Revise a evidencia antes de salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  async function ensureProgress(): Promise<MissionProgressRow | null> {
    if (!supabase || !userId) {
      return null;
    }

    const payload = buildProgressUpsert({
      userId,
      contentId,
      nextStatus: selectedStatus,
      currentStartedAt: progress?.started_at,
    });

    const { data, error } = await supabase
      .from("mission_progress")
      .upsert(payload, { onConflict: "user_id,content_id" })
      .select("id,user_id,content_id,status,started_at,completed_at")
      .single();

    if (error) {
      return null;
    }

    const nextProgress = data as MissionProgressRow;
    setProgress(nextProgress);
    return nextProgress;
  }

  const statusLabel = progress?.status === "in_progress" || progress?.status === "blocked" || progress?.status === "completed"
    ? getMissionProgressStatusLabel(progress.status)
    : getMissionProgressStatusLabel(null);

  return (
    <section className={styles.realProgressPanel} aria-labelledby="progresso-real-titulo">
      <div className={styles.realProgressHeader}>
        <div>
          <p className={styles.sectionKicker}>Progresso real persistido</p>
          <h2 id="progresso-real-titulo">{missionTitle}</h2>
        </div>
        <span>{statusLabel}</span>
      </div>

      {state === "unconfigured" ? (
        <p className={styles.realProgressNotice}>
          Supabase nao esta configurado neste ambiente local. A missao continua legivel, mas estado e evidencia persistidos ficam desligados.
        </p>
      ) : null}

      {state === "signed_out" ? (
        <p className={styles.realProgressNotice}>
          Entre com Supabase Auth para registrar progresso real desta missao.
        </p>
      ) : null}

      {state === "loading" ? (
        <p className={styles.realProgressNotice}>Carregando telemetria da missao...</p>
      ) : null}

      {state === "error" ? (
        <p className={styles.realProgressNotice}>{feedback || "Falha ao acessar o progresso persistido."}</p>
      ) : null}

      {state === "ready_empty" || state === "ready_saved" || state === "error" ? (
        <div className={styles.realProgressGrid}>
          <form className={styles.realProgressForm} onSubmit={handleStatusSubmit}>
            <fieldset>
              <legend>Estado manual</legend>
              <div className={styles.statusControlGroup}>
                {editableStatuses.map((status) => (
                  <label key={status}>
                    <input
                      type="radio"
                      name="mission-status"
                      value={status}
                      checked={selectedStatus === status}
                      onChange={() => setSelectedStatus(status)}
                    />
                    <span>{getMissionProgressStatusLabel(status)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="submit" disabled={isSaving || !userId}>
              Salvar estado
            </button>
          </form>

          <form className={styles.realProgressForm} onSubmit={handleEvidenceSubmit}>
            <fieldset>
              <legend>Evidencia real</legend>
              <label>
                Tipo
                <select value={evidenceType} onChange={(event) => setEvidenceType(event.target.value as MissionEvidenceType)}>
                  {evidenceTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Titulo
                <input
                  value={evidenceTitle}
                  onChange={(event) => setEvidenceTitle(event.target.value)}
                  placeholder="Ex.: Contrato request response desenhado"
                />
              </label>
              <label>
                Corpo
                <textarea
                  value={evidenceBody}
                  onChange={(event) => setEvidenceBody(event.target.value)}
                  placeholder="Resultado, decisao, teste, comparacao ou proximo passo..."
                  rows={5}
                />
              </label>
              <label>
                URL do artefato
                <input
                  value={artifactUrl}
                  onChange={(event) => setArtifactUrl(event.target.value)}
                  placeholder="https://..."
                />
              </label>
              <label>
                Caminho local
                <input
                  value={artifactPath}
                  onChange={(event) => setArtifactPath(event.target.value)}
                  placeholder="docs/notas/exemplo.md"
                />
              </label>
            </fieldset>
            <button type="submit" disabled={isSaving || !userId}>
              Salvar evidencia
            </button>
          </form>
        </div>
      ) : null}

      {feedback && state !== "unconfigured" && state !== "signed_out" ? (
        <p className={styles.realProgressFeedback} aria-live="polite">{feedback}</p>
      ) : null}

      {evidences.length > 0 ? (
        <div className={styles.evidenceDeck} aria-label="Evidencias persistidas">
          {evidences.map((evidence) => (
            <article key={evidence.id} className={styles.evidenceItem}>
              <span>{evidence.evidence_type}</span>
              <h3>{evidence.title}</h3>
              {evidence.body ? <p>{evidence.body}</p> : null}
              {evidence.artifact_url ? <a href={evidence.artifact_url}>Abrir artefato</a> : null}
              {evidence.artifact_path ? <small>{evidence.artifact_path}</small> : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 2: Add styles**

Append to `src/app/page.module.css` before the first `@media` block that references mission internals:

```css
.realProgressPanel {
  display: grid;
  gap: 18px;
  margin-top: 28px;
  padding: clamp(18px, 3vw, 26px);
  border: 1px solid rgba(139, 242, 142, 0.3);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(139, 242, 142, 0.12), transparent 40%),
    rgba(7, 16, 22, 0.78);
  color: #edf6f1;
  box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.22);
}

.realProgressHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.realProgressHeader h2 {
  max-width: 720px;
  margin-top: 8px;
  color: #f8f1d0;
  font-size: clamp(22px, 3vw, 32px);
  line-height: 1.12;
}

.realProgressHeader span,
.realProgressFeedback {
  color: #ffd45d;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.35;
}

.realProgressNotice {
  margin: 0;
  padding: 13px;
  border: 1px solid rgba(255, 212, 93, 0.24);
  background: rgba(255, 212, 93, 0.08);
  color: #f8f1d0;
  line-height: 1.5;
}

.realProgressGrid {
  display: grid;
  grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
  gap: 16px;
}

.realProgressForm {
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 16px;
  border: 1px solid rgba(183, 201, 199, 0.2);
  background: rgba(16, 23, 37, 0.72);
}

.realProgressForm fieldset {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  border: 0;
}

.realProgressForm legend {
  margin-bottom: 4px;
  color: #69d8ff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.realProgressForm label {
  display: grid;
  gap: 7px;
  color: #d0dfdc;
  font-size: 13px;
  font-weight: 800;
}

.realProgressForm input,
.realProgressForm select,
.realProgressForm textarea {
  width: 100%;
  padding: 10px 11px;
  border: 1px solid rgba(183, 201, 199, 0.32);
  border-radius: 4px;
  background: rgba(7, 16, 22, 0.86);
  color: #edf6f1;
  font: inherit;
}

.realProgressForm input:focus-visible,
.realProgressForm select:focus-visible,
.realProgressForm textarea:focus-visible,
.realProgressForm button:focus-visible {
  outline: 3px solid #69d8ff;
  outline-offset: 3px;
}

.realProgressForm textarea {
  resize: vertical;
}

.realProgressForm button {
  min-height: 42px;
  padding: 9px 13px;
  border: 1px solid #8bf28e;
  border-radius: 4px;
  background: #8bf28e;
  color: #071016;
  font: inherit;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
}

.realProgressForm button:disabled {
  cursor: not-allowed;
  opacity: 0.54;
}

.statusControlGroup {
  display: grid;
  gap: 8px;
}

.statusControlGroup label {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 9px;
  padding: 10px;
  border: 1px solid rgba(183, 201, 199, 0.2);
  background: rgba(7, 16, 22, 0.52);
}

.statusControlGroup input {
  width: auto;
}

.evidenceDeck {
  display: grid;
  gap: 10px;
}

.evidenceItem {
  display: grid;
  gap: 8px;
  padding: 14px;
  border: 1px solid rgba(255, 212, 93, 0.28);
  background: rgba(255, 212, 93, 0.08);
}

.evidenceItem span {
  color: #ffd45d;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.evidenceItem h3 {
  color: #edf6f1;
  font-size: 18px;
  line-height: 1.2;
}

.evidenceItem p,
.evidenceItem small {
  color: #d0dfdc;
  line-height: 1.5;
}

.evidenceItem a {
  color: #8bf28e;
  font-weight: 900;
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

Add this inside the existing `@media (max-width: 800px)` block:

```css
  .realProgressHeader {
    flex-direction: column;
  }

  .realProgressGrid {
    grid-template-columns: 1fr;
  }
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: no ESLint errors for the component or CSS modules.

---

### Task 4: Task Page Integration

**Files:**
- Modify: `src/app/fundamentos/[slug]/tarefas/[tarefa]/page.tsx`

**Interfaces:**
- Consumes: `MissionProgressPanel`
- Passes: `contentId={task.id}` and `missionTitle={task.title}`

- [ ] **Step 1: Insert the panel**

Modify imports in `src/app/fundamentos/[slug]/tarefas/[tarefa]/page.tsx`:

```ts
import { MissionBriefing } from "@/components/MissionBriefing";
import { MissionProgressPanel } from "@/components/MissionProgressPanel";
import { StudyNote } from "@/components/StudyNote";
```

Insert after `<MissionBriefing briefing={briefing} />`:

```tsx
        <MissionProgressPanel contentId={task.id} missionTitle={task.title} />
```

- [ ] **Step 2: Run content and unit tests**

Run: `npm run content:validate`

Expected: `Conteudo valido.`

Run: `npm run test`

Expected: all tests pass.

---

### Task 5: Verification And Local Runtime Notes

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: final app state from Tasks 1-4.
- Produces: README note explaining env vars without exposing values.

- [ ] **Step 1: Update README with Supabase local env note**

Add under the `Stack` section in `README.md`:

````md
## Supabase local

A primeira fatia de progresso persistido usa o schema versionado em
`supabase/migrations/` e depende de variaveis publicas no ambiente local:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Use apenas a publishable key no cliente. Nunca coloque service role ou secrets
em variaveis `NEXT_PUBLIC_`.
````

- [ ] **Step 2: Run verification commands**

Run: `npm run test`

Expected: all tests pass.

Run: `npm run content:validate`

Expected: `Conteudo valido.`

Run: `npm run lint`

Expected: no lint errors.

Run: `npm run build`

Expected: production build succeeds.

- [ ] **Step 3: Check git diff**

Run: `git status --short --branch`

Expected: modified files are exactly the files from this plan plus package lock changes if dependencies were installed.

Run: `git diff --stat`

Expected: changes match the vertical slice; no Supabase migration files changed.

---

## Self-Review

- Spec coverage: Task 1 covers status validation, payloads and evidence constraints; Task 2 covers configured/unconfigured Supabase client; Task 3 covers UI states and evidence/status writes; Task 4 uses `task.id` on the task page; Task 5 covers docs and verification.
- Red flag scan: nenhum marcador de pendencia, adiamento ou validacao omitida permanece.
- Type consistency: `MissionProgressStatus`, `MissionEvidenceType`, `buildProgressUpsert`, `buildEvidenceInsert`, `createSupabaseBrowserClient`, and `MissionProgressPanel` signatures are defined before use.
