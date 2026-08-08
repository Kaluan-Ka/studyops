"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { GoogleSignInButton } from "@/components/AuthControl";
import { useAuth } from "@/components/AuthProvider";
import { canMutateWithAuth } from "@/lib/authAccess";
import {
  buildPortfolioProjectProgressUpsert,
  getPortfolioProjectProgressStatusLabel,
  isPortfolioProjectProgressStatus,
  type PortfolioProjectProgressRow,
  type PortfolioProjectProgressStatus,
} from "@/lib/projectProgress";
import {
  listProjectProgress,
  saveProjectProgress,
} from "@/lib/supabase/repositories/projectProgress";

import styles from "@/app/projetos/page.module.css";

type ProjectOption = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  fundamentIds: string[];
  taskIds: string[];
};

type Draft = {
  status: PortfolioProjectProgressStatus;
  objective: string;
  notes: string;
  nextStep: string;
};

const statusOptions: Array<{ value: PortfolioProjectProgressStatus; label: string }> = [
  { value: "planned", label: "Planejado" },
  { value: "in_progress", label: "Em andamento" },
  { value: "paused", label: "Pausado" },
  { value: "completed", label: "Concluído" },
];

export function PortfolioProjectsWorkspace({ projects }: { projects: ProjectOption[] }) {
  const { status: authStatus, user, supabase } = useAuth();
  const canMutate = canMutateWithAuth(authStatus, user?.id);
  const [rows, setRows] = useState<PortfolioProjectProgressRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [feedback, setFeedback] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function synchronize() {
      if (authStatus === "unconfigured" || authStatus === "signed_out") {
        setRows([]);
        setState("ready");
        return;
      }
      if (authStatus !== "authenticated" || !supabase || !user?.id) return;
      try {
        const nextRows = await listProjectProgress(supabase, user.id);
        if (!active) return;
        setRows(nextRows);
        setDrafts(Object.fromEntries(projects.map((project) => [project.id, toDraft(nextRows.find((row) => row.project_id === project.id))])));
        setState("ready");
      } catch {
        if (!active) return;
        setState("error");
        setFeedback("Não foi possível carregar o progresso dos projetos.");
      }
    }
    void synchronize();
    return () => { active = false; };
  }, [authStatus, projects, supabase, user?.id]);

  function updateDraft(projectId: string, field: keyof Draft, value: string) {
    setDrafts((current) => ({
      ...current,
      [projectId]: { ...(current[projectId] ?? toDraft()), [field]: value },
    }));
  }

  async function handleSave(projectId: string) {
    if (!canMutate || !supabase || !user?.id) {
      setFeedback("Entre com Google para registrar o progresso dos projetos.");
      return;
    }

    const draft = drafts[projectId] ?? toDraft();
    setSavingId(projectId);
    setFeedback("");
    try {
      await saveProjectProgress(
        supabase,
        buildPortfolioProjectProgressUpsert({
          userId: user.id,
          projectId,
          status: draft.status,
          objective: draft.objective,
          notes: draft.notes,
          nextStep: draft.nextStep,
        }),
      );
      setFeedback("Progresso do projeto salvo.");
      const nextRows = await listProjectProgress(supabase, user.id);
      setRows(nextRows);
      setDrafts((current) => ({ ...current, [projectId]: toDraft(nextRows.find((row) => row.project_id === projectId)) }));
      setState("ready");
    } catch {
      setState("error");
      setFeedback("Não foi possível salvar o progresso do projeto.");
    } finally {
      setSavingId(null);
    }
  }

  if (authStatus === "unconfigured") {
    return <StatusPanel title="Supabase não configurado" message="Configure o ambiente para acompanhar projetos de forma persistida." />;
  }
  if (authStatus === "signed_out") {
    return <StatusPanel title="Projetos de portfolio" message="O catálogo é público; seu status, notas e próximos passos ficam privados na sua conta." action={<GoogleSignInButton compact />} />;
  }

  const completed = rows.filter((row) => row.status === "completed").length;

  return (
    <div className={styles.workspace}>
      <section className={styles.introPanel}>
        <div>
          <p className={styles.eyebrow}>Portfólio operacional</p>
          <h1>Projetos de portfolio</h1>
          <p>Os cinco projetos têm catálogo editorial estável. Aqui você registra apenas o seu estado, o aprendizado e a próxima entrega.</p>
        </div>
        <div className={styles.telemetry}><span>Concluídos</span><strong>{completed}/{projects.length}</strong><small>{rows.length} projetos acompanhados</small></div>
      </section>

      {state === "loading" ? <p className={styles.muted}>Carregando progresso...</p> : null}
      {state === "error" ? <p className={styles.error} role="alert">{feedback}</p> : null}
      <div className={styles.projectGrid}>
        {projects.map((project) => {
          const draft = drafts[project.id] ?? toDraft();
          return (
            <article className={styles.projectCard} key={project.id}>
              <div className={styles.projectHeader}>
                <div><span className={styles.projectId}>{project.id}</span><h2>{project.title}</h2></div>
                <span className={styles.statusBadge}>{getPortfolioProjectProgressStatusLabel(draft.status)}</span>
              </div>
              <p className={styles.projectSummary}>{project.summary}</p>
              <p className={styles.projectLinks}>{project.fundamentIds.length} fundamentos · {project.taskIds.length} missões conectadas</p>
              <div className={styles.projectForm}>
                <label>Status<select value={draft.status} onChange={(event) => {
                  if (isPortfolioProjectProgressStatus(event.target.value)) updateDraft(project.id, "status", event.target.value);
                }} disabled={!canMutate || savingId === project.id}>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                <label>Objetivo desta fase<textarea rows={2} value={draft.objective} onChange={(event) => updateDraft(project.id, "objective", event.target.value)} disabled={!canMutate || savingId === project.id} placeholder="Qual entrega concreta está em foco?" /></label>
                <label>O que aprendi<textarea rows={3} value={draft.notes} onChange={(event) => updateDraft(project.id, "notes", event.target.value)} disabled={!canMutate || savingId === project.id} placeholder="Decisão, teste, falha ou evidência." /></label>
                <label>Próximo passo<textarea rows={2} value={draft.nextStep} onChange={(event) => updateDraft(project.id, "nextStep", event.target.value)} disabled={!canMutate || savingId === project.id} placeholder="Qual aplicação vem depois?" /></label>
                <button className={styles.primaryButton} type="button" onClick={() => void handleSave(project.id)} disabled={!canMutate || savingId === project.id}>{savingId === project.id ? "Salvando..." : "Salvar progresso"}</button>
              </div>
            </article>
          );
        })}
      </div>
      {feedback && state !== "error" ? <p className={styles.feedback} role="status">{feedback}</p> : null}
    </div>
  );
}

function toDraft(row?: PortfolioProjectProgressRow): Draft {
  return {
    status: row?.status ?? "planned",
    objective: row?.objective ?? "",
    notes: row?.notes ?? "",
    nextStep: row?.next_step ?? "",
  };
}

function StatusPanel({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return <section className={styles.statusPanel}><p className={styles.eyebrow}>Projetos de portfolio</p><h1>{title}</h1><p>{message}</p>{action ? <div className={styles.statusAction}>{action}</div> : null}</section>;
}
